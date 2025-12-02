'use client'

import { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { handleAPIError, retryWithBackoff, fetchWithTimeout, logError } from '@/lib/error-handling'
import { 
  createSession, 
  getLastVisit, 
  updateLastVisit, 
  getWelcomeMessage,
  type ConversationMode,
  type Session 
} from '@/lib/session'
import { getCurrentUser, logout } from '@/lib/auth'
import { getRandomScenario, type Scenario, type ScenarioOption } from '@/lib/scenarios'
import { recordScenarioCompletion, recordConversation, getUserMemory } from '@/lib/memory'
import { 
  getAllPersonalities, 
  getPersonality, 
  savePersonalityPreference, 
  getPersonalityPreference,
  type Personality 
} from '@/lib/personalities'
import { 
  recordScenarioLearning,
  analyzeMessageForScenario,
  recommendNextScenario,
  generateScenarioVariation,
  adaptScenarioDifficulty,
  getScenarioIntelligenceSummary
} from '@/lib/scenario-intelligence'
import {
  createConversation,
  saveConversation,
  getConversation,
  addMessagesToConversation,
  getActiveConversation,
  setActiveConversation,
  clearActiveConversation,
  getAllConversations,
  type SavedMessage,
  type SavedConversation
} from '@/lib/conversation-history'
import ScenarioCard from '@/components/ScenarioCard'
import { PersonalityAvatar } from '@/components/PersonalityAvatar'

// Lazy load heavy components for better performance
const OnboardingModal = dynamic(() => import('@/components/OnboardingModal').then(mod => ({ default: mod.OnboardingModal })), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14F195]"></div></div>
})

interface Message {
  id: string
  sender: 'user' | 'ai'
  content: string
  timestamp: Date
  isCrisis?: boolean
  triggerType?: string
  isScenario?: boolean
  scenario?: Scenario
}

function ChatPageContent() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [conversationMode, setConversationMode] = useState<ConversationMode>('chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null)
  const [selectedPersonality, setSelectedPersonality] = useState<string>('max')
  const [showPersonalityDropdown, setShowPersonalityDropdown] = useState(false)
  const [pendingMessages, setPendingMessages] = useState<string[]>([])
  const [lastSendTime, setLastSendTime] = useState<number>(0)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [showConversationsSidebar, setShowConversationsSidebar] = useState(false)
  const [responseLength, setResponseLength] = useState<'brief' | 'normal' | 'detailed'>('normal')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sendTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check authentication on mount and load/create conversation
  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    setCurrentUser(user)

    // Check if first-time user
    const hasSeenOnboarding = localStorage.getItem(`ping_onboarding_${user.username}`)
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
      return // Don't load conversation yet
    }

    // Load personality preference
    const preferredPersonality = getPersonalityPreference(user.username)
    setSelectedPersonality(preferredPersonality)

    // Load response length preference
    const storedLength = localStorage.getItem(`ping_responseLength_${user.username}`)
    if (storedLength) {
      setResponseLength(storedLength as 'brief' | 'normal' | 'detailed')
    }

    // Check for active conversation for this personality
    const activeConvId = getActiveConversation(user.username, preferredPersonality)
      
      if (activeConvId) {
        const savedConvo = getConversation(activeConvId)
        if (savedConvo) {
          // Continue existing conversation
          setCurrentConversationId(savedConvo.metadata.id)
          
          const loadedMessages: Message[] = savedConvo.messages.map(msg => ({
            id: msg.id,
            sender: msg.sender,
            content: msg.content,
            timestamp: new Date(msg.timestamp)
          }))
          
          setMessages(loadedMessages)
        } else {
          // Active conversation ID exists but conversation was deleted/cleared
          clearActiveConversation(user.username, preferredPersonality)
          
          // Show welcome message but don't create conversation yet
          const lastVisit = getLastVisit()
          const welcomeMsg = getWelcomeMessage(lastVisit, preferredPersonality)
          
          setMessages([{
            id: '1',
            sender: 'ai',
            content: welcomeMsg,
            timestamp: new Date(),
          }])
        }
      } else {
        // Show welcome message but don't create conversation yet
        const lastVisit = getLastVisit()
        const welcomeMsg = getWelcomeMessage(lastVisit, preferredPersonality)
        
        setMessages([{
          id: '1',
          sender: 'ai',
          content: welcomeMsg,
          timestamp: new Date(),
        }])
      }

    const session = createSession('chat')
    setCurrentSession(session)
    updateLastVisit()
  }, [router])

  const handleOnboardingComplete = (personalityId: string) => {
    if (!currentUser) return

    // Save onboarding completion flag
    localStorage.setItem(`ping_onboarding_${currentUser.username}`, 'true')
    
    // Save personality preference
    savePersonalityPreference(currentUser.username, personalityId)
    setSelectedPersonality(personalityId)
    
    // Hide onboarding
    setShowOnboarding(false)

    // Show welcome message but don't create conversation yet
    const lastVisit = getLastVisit()
    const welcomeMsg = getWelcomeMessage(lastVisit, personalityId)
    
    setMessages([{
      id: '1',
      sender: 'ai',
      content: welcomeMsg,
      timestamp: new Date(),
    }])

    const session = createSession('chat')
    setCurrentSession(session)
    updateLastVisit()
  }

  const handleLogout = useCallback(() => {
    logout()
    router.push('/')
  }, [router])

  // Memoize personality data to avoid recalculation
  const allPersonalities = useMemo(() => getAllPersonalities(), [])
  const currentPersonality = useMemo(() => getPersonality(selectedPersonality), [selectedPersonality])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const processPendingMessages = useCallback(async (messagesToProcess: string[], allMessages: Message[]) => {
    if (messagesToProcess.length === 0) return
    
    setIsTyping(true)
    
    try {
      // Build proper conversation history from ALL messages
      // The allMessages array already includes the user messages we need to process
      const conversationHistory = allMessages.map((msg) => ({
        role: msg.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: msg.content,
      }))
      
      console.log('📨 Sending conversation with', conversationHistory.length, 'messages:', {
        lastUser: conversationHistory.filter(m => m.role === 'user').slice(-1)[0]?.content,
        lastAI: conversationHistory.filter(m => m.role === 'assistant').slice(-1)[0]?.content
      })
      
      // Use retry logic with exponential backoff for resilience
      const data = await retryWithBackoff(async () => {
        const response = await fetchWithTimeout('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: conversationHistory,
            mode: conversationMode,
            userId: currentUser?.username || 'admin',
            personality: selectedPersonality,
            responseLength: responseLength,
          }),
        }, 30000) // 30 second timeout

        return await response.json()
      }, 2) // Max 2 retries
      
      // Show subtle intent detection feedback
      if (data.detectedIntent && data.intentConfidence > 0.7) {
        const intentLabels = {
          practice: '🎯 Practice mode',
          vent: '💭 Listening mode',
          coaching: '🤔 Thinking mode',
          chat: '💬 Chat mode'
        }
        console.log(`Intent detected: ${intentLabels[data.detectedIntent as keyof typeof intentLabels]} (${Math.round(data.intentConfidence * 100)}% confidence)`)
      }
      
      // Handle multi-bubble responses for more natural conversation
      if (data.bubbles && data.bubbles.length > 1) {
        // Send each bubble with a delay between them
        for (let i = 0; i < data.bubbles.length; i++) {
          // Show typing for each bubble
          if (i > 0) {
            setIsTyping(true)
            await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 400))
          }
          
          setIsTyping(false)
          const aiMessage: Message = {
            id: `${Date.now()}_${i}`,
            sender: 'ai',
            content: data.bubbles[i],
            timestamp: new Date(),
            isCrisis: data.isCrisis && i === 0,
            triggerType: data.triggerType,
          }
          
          setMessages((prev) => [...prev, aiMessage])
          
          // Save to conversation history
          if (currentConversationId && currentUser) {
            const savedMsg: SavedMessage = {
              id: aiMessage.id,
              sender: aiMessage.sender,
              content: aiMessage.content,
              timestamp: aiMessage.timestamp.toISOString()
            }
            addMessagesToConversation(currentConversationId, [savedMsg])
          }
          
          // Small delay before next bubble
          if (i < data.bubbles.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300))
          }
        }
      } else {
        // Single bubble response
        await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 400))
        
        const aiMessage: Message = {
          id: Date.now().toString(),
          sender: 'ai',
          content: data.reply,
          timestamp: new Date(),
          isCrisis: data.isCrisis,
          triggerType: data.triggerType,
        }
        
        setMessages((prev) => {
          const updated = [...prev, aiMessage]
          // Save to conversation history
          if (currentConversationId && currentUser) {
            const savedMsg: SavedMessage = {
              id: aiMessage.id,
              sender: aiMessage.sender,
              content: aiMessage.content,
              timestamp: aiMessage.timestamp.toISOString()
            }
            addMessagesToConversation(currentConversationId, [savedMsg])
          }
          return updated
        })
      }
      
      // Clear pending messages
      setPendingMessages([])
      
    } catch (error) {
      // Get user-friendly error message
      const apiError = handleAPIError(error)
      
      // Log error with context for debugging
      logError('processPendingMessages', error, {
        userId: currentUser?.username,
        personality: selectedPersonality,
        mode: conversationMode,
        messageCount: messagesToProcess.length
      })
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        content: apiError.message,
        timestamp: new Date(),
      }
      
      setMessages((prev) => {
        const updated = [...prev, errorMessage]
        // Save error message too
        if (currentConversationId && currentUser) {
          const savedMsg: SavedMessage = {
            id: errorMessage.id,
            sender: errorMessage.sender,
            content: errorMessage.content,
            timestamp: errorMessage.timestamp.toISOString()
          }
          addMessagesToConversation(currentConversationId, [savedMsg])
        }
        return updated
      })
      setPendingMessages([])
    } finally {
      setIsTyping(false)
    }
  }, [conversationMode, currentUser, selectedPersonality, currentConversationId])

  // Helper to save messages to conversation history
  const saveMessagesToHistory = useCallback((newMessages: Message[]) => {
    if (!currentConversationId || !currentUser) return
    
    const savedMessages: SavedMessage[] = newMessages.map(msg => ({
      id: msg.id,
      sender: msg.sender,
      content: msg.content,
      timestamp: msg.timestamp.toISOString()
    }))
    
    addMessagesToConversation(currentConversationId, savedMessages)
  }, [currentConversationId, currentUser])

  const handleModeChange = (mode: ConversationMode) => {
    setConversationMode(mode)
    
    // Create new session with the selected mode
    const newSession = createSession(mode)
    setCurrentSession(newSession)
    
    // Map modes to user-friendly text
    const modeText: Record<ConversationMode, string> = {
      practice: 'Practice conversations',
      vent: 'I need to vent',
      coaching: 'Help me decide',
      chat: 'Just chat',
    }
    
    // Add user message showing which button they clicked
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: modeText[mode],
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // For practice mode, intelligently select scenario based on user's learning
    if (mode === 'practice') {
      if (currentUser) {
        // Get smart recommendation based on user's history
        const recommendation = recommendNextScenario(currentUser.username)
        const scenario = getRandomScenario(recommendation.category)
        
        // Adapt difficulty based on recent performance
        const adaptedScenario = {
          ...scenario,
          difficulty: adaptScenarioDifficulty(currentUser.username, 'safe', scenario.difficulty)
        }
        
        setActiveScenario(adaptedScenario)
        
        setTimeout(() => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            content: `Alright, let's practice. ${recommendation.reasoning}\n\nI'll throw you a scenario and you pick how you'd respond. No pressure—this is just for you.`,
            timestamp: new Date(),
            isScenario: true,
            scenario: adaptedScenario,
          }
          setMessages((prev) => [...prev, aiMessage])
        }, 500)
      } else {
        // Fallback if no user (shouldn't happen due to auth check)
        const scenario = getRandomScenario('everyday')
        setActiveScenario(scenario)
        
        setTimeout(() => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            content: "Alright, let's practice. I'll throw you a scenario and you pick how you'd respond. No pressure—this is just for you.",
            timestamp: new Date(),
            isScenario: true,
            scenario: scenario,
          }
          setMessages((prev) => [...prev, aiMessage])
        }, 500)
      }
      return
    }

    // For other modes, just acknowledge the mode change
    const modeMessages: Record<ConversationMode, string> = {
      chat: "Okay, I'm all ears. What's up?",
      vent: "I'm here. Let it all out—no judgment.",
      coaching: "Alright, let's figure this out together. What's the situation?",
      practice: "", // Already handled above
    }

    if (modeMessages[mode]) {
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: modeMessages[mode],
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      }, 500)
    }
    setActiveScenario(null)
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    // Check if user is asking for another scenario or specific type
    const lowerInput = inputValue.toLowerCase()
    if (conversationMode === 'practice' && 
        (lowerInput.includes('another') || 
         lowerInput.includes('more') || 
         lowerInput.includes('yes') ||
         lowerInput.includes('sure') ||
         lowerInput.includes('practice') ||
         lowerInput.includes('scenario'))) {
      
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        content: inputValue,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setInputValue('')

      // Analyze message to understand what kind of scenario they want
      const analysis = analyzeMessageForScenario(inputValue)
      
      // Load intelligent scenario based on their request and learning
      setTimeout(() => {
        let scenario = getRandomScenario(analysis.suggestedCategory)
        
        // If they mentioned specific keywords, try to match
        if (analysis.keywords.length > 0) {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            content: `Got it—${analysis.suggestedCategory} scenario coming up. Here you go:`,
            timestamp: new Date(),
            isScenario: true,
            scenario: scenario,
          }
          setMessages((prev) => [...prev, aiMessage])
        } else {
          // Smart recommendation
          if (currentUser) {
            const recommendation = recommendNextScenario(currentUser.username)
            scenario = getRandomScenario(recommendation.category)
          }
          
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            content: "Okay, here's another one:",
            timestamp: new Date(),
            isScenario: true,
            scenario: scenario,
          }
          setMessages((prev) => [...prev, aiMessage])
        }
        
        setActiveScenario(scenario)
      }, 500)
      return
    }

    // Check if user is asking for their progress/stats
    if (lowerInput.includes('how am i doing') || 
        lowerInput.includes('my progress') ||
        lowerInput.includes('my stats') ||
        lowerInput.includes('how\'s my') ||
        lowerInput.includes('show my')) {
      
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        content: inputValue,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setInputValue('')
      
      if (currentUser) {
        setTimeout(() => {
          const summary = getScenarioIntelligenceSummary(currentUser.username)
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            content: summary,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, aiMessage])
        }, 500)
      } else {
        setTimeout(() => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            content: "Start practicing scenarios to unlock your personalized intelligence report!",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, aiMessage])
        }, 500)
      }
      return
    }
    
    // Handle rapid/double messaging - group messages sent within 3 seconds
    const now = Date.now()
    const timeSinceLastSend = now - lastSendTime
    
    // Add current message to user's messages
    const userMessage: Message = {
      id: now.toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
    }
    const currentInput = inputValue
    setInputValue('')
    
    // Save user message to conversation history BEFORE updating UI
    if (currentUser) {
      if (!currentConversationId) {
        // Create new conversation with user's first message
        const savedMsg: SavedMessage = {
          id: userMessage.id,
          sender: userMessage.sender,
          content: userMessage.content,
          timestamp: userMessage.timestamp.toISOString()
        }
        
        const newConvo = createConversation(currentUser.username, selectedPersonality, savedMsg)
        saveConversation(newConvo)
        setCurrentConversationId(newConvo.metadata.id)
        setActiveConversation(currentUser.username, selectedPersonality, newConvo.metadata.id)
      } else {
        // Add to existing conversation
        const savedMsg: SavedMessage = {
          id: userMessage.id,
          sender: userMessage.sender,
          content: userMessage.content,
          timestamp: userMessage.timestamp.toISOString()
        }
        addMessagesToConversation(currentConversationId, [savedMsg])
      }
    }
    
    // Update messages UI
    setMessages((prev) => {
      const newMessages = [...prev, userMessage]
      
      // Clear any existing timeout
      if (sendTimeoutRef.current) {
        clearTimeout(sendTimeoutRef.current)
      }
      
      // Update pending messages
      const newPending = [...pendingMessages, currentInput]
      setPendingMessages(newPending)
      setLastSendTime(now)
      
      // If user is rapid-firing messages (< 3 seconds apart), wait a bit longer
      if (timeSinceLastSend < 3000 && pendingMessages.length > 0) {
        // Wait for more messages
        sendTimeoutRef.current = setTimeout(() => {
          processPendingMessages(newPending, newMessages)
        }, 2000)
      } else {
        // Otherwise process immediately with slight delay
        sendTimeoutRef.current = setTimeout(() => {
          processPendingMessages(newPending, newMessages)
        }, 800)
      }
      
      return newMessages
    })
  }

  const handleScenarioOptionSelect = (option: ScenarioOption) => {
    // User selected an option
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: option.text,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Record scenario completion with tone choice AND learning data
    if (currentUser && activeScenario) {
      recordScenarioCompletion(currentUser.username, option.tone)
      recordScenarioLearning(
        currentUser.username,
        activeScenario.id,
        option.tone,
        activeScenario.difficulty,
        option.skill
      )
    }

    // Max responds with feedback
    setTimeout(() => {
      let feedback = option.response
      if (option.insight) {
        feedback += `\n\n💡 ${option.insight}`
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: feedback,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setActiveScenario(null)

      // After feedback, ask if they want another scenario
      setTimeout(() => {
        const followUpMessage: Message = {
          id: (Date.now() + 2).toString(),
          sender: 'ai',
          content: "Want to try another scenario, or you good?",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, followUpMessage])
      }, 1000)
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Onboarding Modal */}
      {showOnboarding && currentUser && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="relative flex items-center space-x-3">
          <button
            onClick={() => setShowPersonalityDropdown(!showPersonalityDropdown)}
            className="flex items-center space-x-3 hover:bg-gray-800/50 rounded-lg px-2 py-1 -ml-2 transition-colors"
          >
            <PersonalityAvatar personalityId={selectedPersonality} size="md" />
            <div className="text-left">
              <div className="flex items-center space-x-1">
                <p className="font-semibold tracking-wide">{currentPersonality.name}</p>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </button>

          {/* Memory Indicator */}
          {currentUser && (() => {
            const memory = getUserMemory(currentUser.username)
            const factsCount = memory.facts.length
            const conversationsCount = memory.pastConversations.length
            
            if (factsCount > 0 || conversationsCount > 0) {
              return (
                <div className="flex items-center space-x-1 px-2 py-1 bg-[#14F195]/10 border border-[#14F195]/30 rounded-md" title={`${factsCount} facts, ${conversationsCount} conversations remembered`}>
                  <svg className="w-4 h-4 text-[#14F195]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span className="text-xs font-medium text-[#14F195]">
                    {factsCount} {factsCount === 1 ? 'memory' : 'memories'}
                  </span>
                </div>
              )
            }
            return null
          })()}

          {/* Personality Dropdown */}
          {showPersonalityDropdown && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-[#1a1a24] border border-gray-700 rounded-lg shadow-xl z-50">
              <div className="p-2 space-y-1">
                {allPersonalities.map((personality) => (
                  <button
                    key={personality.id}
                    onClick={() => {
                      setSelectedPersonality(personality.id)
                      if (currentUser) {
                        savePersonalityPreference(currentUser.username, personality.id)
                      }
                      setShowPersonalityDropdown(false)
                      
                      // Clear conversation and start fresh with new personality
                      const greetings: Record<string, string> = {
                        max: "Hey there. I'm here to help. What would you like to talk about?",
                        jamie: "Hey! Ready to tackle whatever's on your mind. What's up?",
                        sage: "Hi. I'm here to listen and help you find clarity. What's going on?",
                        riley: "Hey. Let's figure this out together. What's the situation?"
                      }
                      
                      const switchMessage: Message = {
                        id: Date.now().toString(),
                        sender: 'ai',
                        content: greetings[personality.id] || `Hey. I'm ${personality.name}. What's on your mind?`,
                        timestamp: new Date(),
                      }
                      
                      // Start fresh - clear previous conversation state
                      // Don't create conversation yet - wait for user's first message
                      if (currentUser) {
                        clearActiveConversation(currentUser.username, selectedPersonality)
                        setCurrentConversationId(null)
                      }
                      
                      setMessages([switchMessage])
                      setPendingMessages([])
                      setActiveScenario(null)
                    }}
                    className={`w-full flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                      selectedPersonality === personality.id
                        ? 'bg-user-bubble/20 border border-user-bubble/50'
                        : 'hover:bg-gray-800/50'
                    }`}
                  >
                    <PersonalityAvatar personalityId={personality.id} size="md" />
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{personality.name}</p>
                        {selectedPersonality === personality.id && (
                          <span className="text-xs text-user-bubble">Active</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{personality.tagline}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {personality.bestFor.slice(0, 2).map((use, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-gray-800 rounded-full text-gray-300">
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/insights')}
            className="text-gray-400 hover:text-white transition-colors"
            title="Insights Dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button
            onClick={() => router.push('/conversations')}
            className="text-gray-400 hover:text-white transition-colors"
            title="Conversation History"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
          <button
            onClick={() => router.push('/settings')}
            className="text-gray-400 hover:text-white transition-colors"
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <div
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-user-bubble text-white'
                    : message.isCrisis
                    ? 'bg-red-900/30 border border-red-500/50 text-white'
                    : 'bg-ai-bubble text-white'
                }`}
              >
                <p className="text-[15px] leading-relaxed whitespace-pre-line">{message.content}</p>
                {message.isCrisis && (
                  <div className="mt-3 pt-3 border-t border-red-500/30">
                    <p className="text-xs text-red-300">
                      🆘 Crisis resources provided above
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Show scenario card if this message has one */}
            {message.isScenario && message.scenario && (
              <div className="mt-3">
                <ScenarioCard 
                  scenario={message.scenario} 
                  onOptionSelect={handleScenarioOptionSelect}
                />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[75%] bg-ai-bubble rounded-2xl px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-end space-x-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-ai-bubble text-white rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-user-bubble placeholder-gray-500"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-[#14F195] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#14F195] disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-full p-3 transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Conversations Sidebar */}
      {showConversationsSidebar && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
            onClick={() => setShowConversationsSidebar(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-[#1a1a24] shadow-2xl z-50 flex flex-col animate-slide-in-right">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Conversations</h2>
              <button
                onClick={() => setShowConversationsSidebar(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {(() => {
                if (!currentUser) return null
                
                const allConvos = getAllConversations(currentUser.username)
                
                if (allConvos.length === 0) {
                  return (
                    <div className="text-center py-20">
                      <div className="mb-3 flex justify-center">
                        <svg className="w-12 h-12 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p className="text-gray-400 text-sm">No saved conversations yet</p>
                    </div>
                  )
                }
                
                // Group conversations
                const grouped = allConvos.reduce((acc, conv) => {
                  const date = new Date(conv.lastMessageAt)
                  const today = new Date()
                  const yesterday = new Date(today)
                  yesterday.setDate(yesterday.getDate() - 1)
                  
                  let group = 'Older'
                  if (date.toDateString() === today.toDateString()) {
                    group = 'Today'
                  } else if (date.toDateString() === yesterday.toDateString()) {
                    group = 'Yesterday'
                  } else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
                    group = 'This Week'
                  }
                  
                  if (!acc[group]) acc[group] = []
                  acc[group].push(conv)
                  return acc
                }, {} as Record<string, typeof allConvos>)
                
                const groupOrder = ['Today', 'Yesterday', 'This Week', 'Older']
                
                const formatDate = (dateString: string) => {
                  const date = new Date(dateString)
                  const now = new Date()
                  const diff = now.getTime() - date.getTime()
                  const hours = diff / (1000 * 60 * 60)
                  
                  if (hours < 1) {
                    const minutes = Math.floor(diff / (1000 * 60))
                    return minutes < 1 ? 'Just now' : `${minutes}m`
                  } else if (hours < 24) {
                    return `${Math.floor(hours)}h`
                  } else {
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                }
                
                return (
                  <div className="space-y-4">
                    {groupOrder.map(group => {
                      const groupConvos = grouped[group]
                      if (!groupConvos || groupConvos.length === 0) return null
                      
                      return (
                        <div key={group}>
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
                            {group}
                          </h3>
                          <div className="space-y-1">
                            {groupConvos.map(conv => {
                              const personality = getPersonality(conv.personality)
                              const isActive = conv.id === currentConversationId
                              
                              return (
                                <button
                                  key={conv.id}
                                  onClick={() => {
                                    if (conv.id !== currentConversationId) {
                                      router.push(`/chat?conversation=${conv.id}`)
                                    }
                                    setShowConversationsSidebar(false)
                                  }}
                                  className={`w-full rounded-lg p-3 transition-colors text-left ${
                                    isActive 
                                      ? 'bg-user-bubble/20 border border-user-bubble/50' 
                                      : 'bg-ai-bubble/50 hover:bg-ai-bubble'
                                  }`}
                                >
                                  <div className="flex items-start space-x-3">
                                    <PersonalityAvatar personalityId={personality.id} size="sm" />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-sm text-white">{personality.name}</span>
                                        <span className="text-xs text-gray-500">{formatDate(conv.lastMessageAt)}</span>
                                      </div>
                                      <p className="text-xs text-gray-400 truncate">{conv.preview}</p>
                                      {isActive && (
                                        <span className="text-xs text-user-bubble mt-1 inline-block">Current</span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>

            {/* New Chat Button */}
            <div className="border-t border-gray-800 p-4">
              <button
                onClick={() => {
                  setShowConversationsSidebar(false)
                  // Create new conversation by clearing active and refreshing
                  if (currentUser) {
                    clearActiveConversation(currentUser.username, selectedPersonality)
                    router.push('/chat')
                  }
                }}
                className="w-full py-3 bg-user-bubble hover:bg-user-bubble/80 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Chat</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#0F1419]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-user-bubble mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  )
}
