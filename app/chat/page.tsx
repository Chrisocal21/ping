'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { recordScenarioCompletion, recordConversation } from '@/lib/memory'
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
import ScenarioCard from '@/components/ScenarioCard'

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

export default function ChatPage() {
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check authentication on mount
  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    setCurrentUser(user)

    // Load personality preference
    const preferredPersonality = getPersonalityPreference(user.username)
    setSelectedPersonality(preferredPersonality)

    const lastVisit = getLastVisit()
    const welcomeMsg = getWelcomeMessage(lastVisit)
    
    setMessages([{
      id: '1',
      sender: 'ai',
      content: welcomeMsg,
      timestamp: new Date(),
    }])

    const session = createSession('chat')
    setCurrentSession(session)
    updateLastVisit()
  }, [router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

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
    
    // Normal message handling
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Call API for response
    try {
      const currentInput = inputValue
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content,
          })),
          message: currentInput,
          mode: conversationMode,
          userId: currentUser?.username || 'admin',
          personality: selectedPersonality,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: data.reply,
        timestamp: new Date(),
        isCrisis: data.isCrisis,
        triggerType: data.triggerType,
      }
      
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: "Sorry, something went wrong on my end. Try again?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
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
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="relative">
          <button
            onClick={() => setShowPersonalityDropdown(!showPersonalityDropdown)}
            className="flex items-center space-x-3 hover:bg-gray-800/50 rounded-lg px-2 py-1 -ml-2 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-ai-bubble flex items-center justify-center text-xl">
              {getPersonality(selectedPersonality).emoji}
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-1">
                <p className="font-semibold">{getPersonality(selectedPersonality).name}</p>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p className="text-xs text-gray-400">{getPersonality(selectedPersonality).tagline}</p>
            </div>
          </button>

          {/* Personality Dropdown */}
          {showPersonalityDropdown && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-[#1a1a24] border border-gray-700 rounded-lg shadow-xl z-50">
              <div className="p-2 space-y-1">
                {getAllPersonalities().map((personality) => (
                  <button
                    key={personality.id}
                    onClick={() => {
                      setSelectedPersonality(personality.id)
                      if (currentUser) {
                        savePersonalityPreference(currentUser.username, personality.id)
                      }
                      setShowPersonalityDropdown(false)
                      
                      // Add a message showing personality switch
                      const switchMessage: Message = {
                        id: Date.now().toString(),
                        sender: 'ai',
                        content: `Hey! I'm ${personality.name}. ${personality.tagline} What's on your mind?`,
                        timestamp: new Date(),
                      }
                      setMessages((prev) => [...prev, switchMessage])
                    }}
                    className={`w-full flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                      selectedPersonality === personality.id
                        ? 'bg-user-bubble/20 border border-user-bubble/50'
                        : 'hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="text-2xl flex-shrink-0 mt-1">{personality.emoji}</div>
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

      {/* Quick Action Buttons */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto">
        <button 
          onClick={() => handleModeChange('practice')}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-colors ${
            conversationMode === 'practice' 
              ? 'bg-user-bubble text-white' 
              : 'bg-ai-bubble hover:bg-gray-700'
          }`}
        >
          Practice conversations
        </button>
        <button 
          onClick={() => handleModeChange('vent')}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-colors ${
            conversationMode === 'vent' 
              ? 'bg-user-bubble text-white' 
              : 'bg-ai-bubble hover:bg-gray-700'
          }`}
        >
          I need to vent
        </button>
        <button 
          onClick={() => handleModeChange('coaching')}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-colors ${
            conversationMode === 'coaching' 
              ? 'bg-user-bubble text-white' 
              : 'bg-ai-bubble hover:bg-gray-700'
          }`}
        >
          Help me decide
        </button>
        <button 
          onClick={() => handleModeChange('chat')}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-colors ${
            conversationMode === 'chat' 
              ? 'bg-user-bubble text-white' 
              : 'bg-ai-bubble hover:bg-gray-700'
          }`}
        >
          Just chat
        </button>
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
            className="bg-user-bubble hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-full p-3 transition-colors"
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
    </div>
  )
}
