// User memory and personalization system

export interface UserMemory {
  userId: string
  
  // Personal details learned over time
  preferences: {
    name?: string
    topics: string[] // Topics they care about
    conversationStyle?: 'direct' | 'gentle' | 'humorous' // How they like to talk
    preferredPersonality?: 'max' | 'jamie' | 'sage' | 'riley' // Which AI they prefer
  }
  
  // Conversation patterns
  patterns: {
    commonEmotions: string[] // Emotions they express frequently
    tonePreferences: { safe: number; curious: number; playful: number; bold: number } // Which scenario tones they pick
    timeOfDayUsage: string[] // When they typically talk
    conversationLength: 'short' | 'medium' | 'long' // How long they like to chat
    weeklyPatterns: { day: string; count: number }[] // When they use the app most
  }
  
  // Relationship building
  pastConversations: {
    topic: string
    date: string
    emotion?: string
    outcome?: string
    mode: string // practice/vent/coaching/chat
  }[]
  
  // Things they've mentioned
  facts: {
    fact: string
    date: string
    category: 'personal' | 'work' | 'relationship' | 'interest' | 'struggle' | 'goal'
  }[]
  
  // Progress tracking
  growth: {
    scenariosCompleted: number
    difficultConversationsHandled: string[]
    milestones: { description: string; date: string }[]
    streakDays: number
    lastActiveDate?: string
  }
  
  // Smart insights about the user
  insights: {
    recurringThemes: string[] // Topics they keep coming back to
    emotionalTriggers: string[] // Things that make them anxious/upset
    strengths: string[] // Things they're good at
    growthAreas: string[] // Things they're working on
    supportPatterns: string[] // What kind of support helps them most
  }
}

// Initialize memory for new user
export function createUserMemory(userId: string): UserMemory {
  return {
    userId,
    preferences: {
      topics: [],
    },
    patterns: {
      commonEmotions: [],
      tonePreferences: { safe: 0, curious: 0, playful: 0, bold: 0 },
      timeOfDayUsage: [],
      conversationLength: 'medium',
      weeklyPatterns: [],
    },
    pastConversations: [],
    facts: [],
    growth: {
      scenariosCompleted: 0,
      difficultConversationsHandled: [],
      milestones: [],
      streakDays: 0,
    },
    insights: {
      recurringThemes: [],
      emotionalTriggers: [],
      strengths: [],
      growthAreas: [],
      supportPatterns: [],
    },
  }
}

// Get user memory from localStorage
export function getUserMemory(userId: string): UserMemory {
  if (typeof window === 'undefined') return createUserMemory(userId)
  
  const stored = localStorage.getItem(`ping_memory_${userId}`)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return createUserMemory(userId)
    }
  }
  return createUserMemory(userId)
}

// Save user memory
export function saveUserMemory(memory: UserMemory): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`ping_memory_${memory.userId}`, JSON.stringify(memory))
}

// Add a fact learned about the user
export function addUserFact(
  userId: string, 
  fact: string, 
  category: 'personal' | 'work' | 'relationship' | 'interest' | 'struggle' | 'goal'
): void {
  const memory = getUserMemory(userId)
  memory.facts.push({
    fact,
    date: new Date().toISOString(),
    category,
  })
  // Keep only last 50 facts to avoid bloat
  if (memory.facts.length > 50) {
    memory.facts = memory.facts.slice(-50)
  }
  saveUserMemory(memory)
}

// Record scenario completion with tone choice
export function recordScenarioCompletion(userId: string, tone: string): void {
  const memory = getUserMemory(userId)
  memory.growth.scenariosCompleted += 1
  
  // Track tone preference
  if (tone in memory.patterns.tonePreferences) {
    memory.patterns.tonePreferences[tone as keyof typeof memory.patterns.tonePreferences] += 1
  }
  
  saveUserMemory(memory)
}

// Record conversation for context
export function recordConversation(
  userId: string,
  topic: string,
  mode: string,
  emotion?: string,
  outcome?: string
): void {
  const memory = getUserMemory(userId)
  memory.pastConversations.push({
    topic,
    date: new Date().toISOString(),
    emotion,
    outcome,
    mode,
  })
  
  // Update streak
  updateStreak(userId)
  
  // Keep only last 20 conversations
  if (memory.pastConversations.length > 20) {
    memory.pastConversations = memory.pastConversations.slice(-20)
  }
  
  // Auto-detect recurring themes
  detectRecurringThemes(userId)
  
  saveUserMemory(memory)
}

// Get personalized context for AI
export function getPersonalizedContext(userId: string): string {
  const memory = getUserMemory(userId)
  
  let context = ""
  
  // Add user's name if known
  if (memory.preferences.name) {
    context += `The user's name is ${memory.preferences.name}. `
  }
  
  // Add conversation style preference
  if (memory.preferences.conversationStyle) {
    context += `They prefer ${memory.preferences.conversationStyle} conversation. `
  }
  
  // Add recent facts (last 10)
  if (memory.facts.length > 0) {
    const recentFacts = memory.facts.slice(-10)
    context += `\n\nThings you know about them:\n`
    recentFacts.forEach(f => {
      context += `- ${f.fact}\n`
    })
  }
  
  // Add tone preferences
  const totalTones = Object.values(memory.patterns.tonePreferences).reduce((a, b) => a + b, 0)
  if (totalTones > 5) {
    const prefs = memory.patterns.tonePreferences
    const maxTone = Object.entries(prefs).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    context += `\nThey tend to choose ${maxTone} responses in practice scenarios. `
  }
  
  // Add recent conversation topics
  if (memory.pastConversations.length > 0) {
    const recent = memory.pastConversations.slice(-3)
    context += `\n\nRecent topics they've discussed:\n`
    recent.forEach(c => {
      context += `- ${c.topic}${c.emotion ? ` (feeling ${c.emotion})` : ''}\n`
    })
  }
  
  // Add growth milestones
  if (memory.growth.scenariosCompleted > 0) {
    context += `\nThey've completed ${memory.growth.scenariosCompleted} practice scenarios. `
  }
  
  return context
}

// Extract facts from conversation (simple keyword detection)
export function extractFactsFromMessage(userId: string, message: string): void {
  const lowerMessage = message.toLowerCase()
  
  // Detect name mentions
  const namePatterns = [
    /my name is (\w+)/i,
    /i'm (\w+)/i,
    /call me (\w+)/i,
  ]
  for (const pattern of namePatterns) {
    const match = message.match(pattern)
    if (match) {
      const memory = getUserMemory(userId)
      memory.preferences.name = match[1]
      saveUserMemory(memory)
      return
    }
  }
  
  // Detect job/work mentions
  if (lowerMessage.includes('work') || lowerMessage.includes('job')) {
    const workKeywords = ['manager', 'developer', 'teacher', 'nurse', 'engineer', 'designer', 'student']
    for (const keyword of workKeywords) {
      if (lowerMessage.includes(keyword)) {
        addUserFact(userId, `Works as or studying to be a ${keyword}`, 'work')
        break
      }
    }
  }
  
  // Detect interests
  const interestKeywords = ['love', 'enjoy', 'interested in', 'hobby', 'fan of']
  for (const keyword of interestKeywords) {
    if (lowerMessage.includes(keyword)) {
      // Extract the interest (simplified - in production would use NLP)
      addUserFact(userId, `Mentioned interest: "${message.substring(0, 100)}"`, 'interest')
      break
    }
  }
  
  // Detect struggles/challenges
  const struggleKeywords = ['struggling with', 'hard time', 'difficult', 'anxious about', 'worried about', 'stressed about']
  for (const keyword of struggleKeywords) {
    if (lowerMessage.includes(keyword)) {
      addUserFact(userId, `Struggle: "${message.substring(0, 100)}"`, 'struggle')
      break
    }
  }
  
  // Detect goals
  const goalKeywords = ['want to', 'trying to', 'goal is', 'working on', 'hope to']
  for (const keyword of goalKeywords) {
    if (lowerMessage.includes(keyword)) {
      addUserFact(userId, `Goal: "${message.substring(0, 100)}"`, 'goal')
      break
    }
  }
}

// Get recent emotional patterns
export function getEmotionalPatterns(userId: string): string[] {
  const memory = getUserMemory(userId)
  const recentEmotions = memory.pastConversations
    .slice(-10)
    .filter(c => c.emotion)
    .map(c => c.emotion!)
  
  // Count frequency
  const emotionCounts = recentEmotions.reduce((acc, emotion) => {
    acc[emotion] = (acc[emotion] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Return most common emotions
  return Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([emotion]) => emotion)
}

// Add a milestone
export function addMilestone(userId: string, description: string): void {
  const memory = getUserMemory(userId)
  memory.growth.milestones.push({
    description,
    date: new Date().toISOString(),
  })
  saveUserMemory(memory)
}

// Update daily streak
export function updateStreak(userId: string): void {
  const memory = getUserMemory(userId)
  const today = new Date().toISOString().split('T')[0]
  
  if (!memory.growth.lastActiveDate) {
    memory.growth.streakDays = 1
    memory.growth.lastActiveDate = today
  } else {
    const lastDate = new Date(memory.growth.lastActiveDate)
    const todayDate = new Date(today)
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      // Consecutive day
      memory.growth.streakDays += 1
      memory.growth.lastActiveDate = today
      
      // Award milestones
      if (memory.growth.streakDays === 7) {
        addMilestone(userId, '7-day streak! You\'re building a habit.')
      } else if (memory.growth.streakDays === 30) {
        addMilestone(userId, '30-day streak! This is who you are now.')
      }
    } else if (diffDays > 1) {
      // Streak broken
      memory.growth.streakDays = 1
      memory.growth.lastActiveDate = today
    }
    // If diffDays === 0, same day, do nothing
  }
  
  saveUserMemory(memory)
}

// Detect recurring themes across conversations
export function detectRecurringThemes(userId: string): void {
  const memory = getUserMemory(userId)
  
  // Count topic frequency
  const topicCounts: Record<string, number> = {}
  memory.pastConversations.forEach(conv => {
    const words = conv.topic.toLowerCase().split(' ')
    words.forEach(word => {
      if (word.length > 4) { // Ignore short words
        topicCounts[word] = (topicCounts[word] || 0) + 1
      }
    })
  })
  
  // Find recurring themes (appears 3+ times)
  const recurring = Object.entries(topicCounts)
    .filter(([_, count]) => count >= 3)
    .map(([word]) => word)
  
  memory.insights.recurringThemes = recurring.slice(0, 5) // Top 5
  saveUserMemory(memory)
}

// Get check-in prompt based on user patterns
export function getSmartCheckIn(userId: string): string {
  const memory = getUserMemory(userId)
  
  // If they have recurring struggles, check on those
  const struggles = memory.facts.filter(f => f.category === 'struggle').slice(-2)
  if (struggles.length > 0) {
    const recentStruggle = struggles[0].fact.split(':')[1]?.trim()
    return `Hey. How's ${recentStruggle} been lately?`
  }
  
  // If they have goals, ask about progress
  const goals = memory.facts.filter(f => f.category === 'goal').slice(-1)
  if (goals.length > 0) {
    const recentGoal = goals[0].fact.split(':')[1]?.trim()
    return `Any progress on ${recentGoal}?`
  }
  
  // If they prefer a certain mode, suggest it
  const conversations = memory.pastConversations.slice(-10)
  const modeCounts = conversations.reduce((acc, c) => {
    acc[c.mode] = (acc[c.mode] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const topMode = Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  
  if (topMode === 'practice') {
    return "Want to practice some conversations today?"
  } else if (topMode === 'vent') {
    return "Need to vent about something?"
  } else if (topMode === 'coaching') {
    return "Got a decision to work through?"
  }
  
  // Default
  return "What's on your mind today?"
}

// Predict what kind of support they need based on patterns
export function predictSupportNeeded(userId: string, message: string): string {
  const memory = getUserMemory(userId)
  const lowerMessage = message.toLowerCase()
  
  // Check emotional triggers
  const triggers = memory.insights.emotionalTriggers
  const hasTriggered = triggers.some(trigger => lowerMessage.includes(trigger))
  
  if (hasTriggered) {
    return 'validation' // They need emotional support
  }
  
  // Check for decision language
  if (lowerMessage.includes('should i') || lowerMessage.includes('what if') || lowerMessage.includes('decide')) {
    return 'coaching'
  }
  
  // Check for social anxiety language
  if (lowerMessage.includes('awkward') || lowerMessage.includes('nervous') || lowerMessage.includes('social')) {
    return 'practice'
  }
  
  // Check for venting language
  if (lowerMessage.includes('frustrated') || lowerMessage.includes('annoyed') || lowerMessage.includes('tired of')) {
    return 'vent'
  }
  
  return 'chat'
}

// Generate insights summary for user
export function getInsightsSummary(userId: string): string {
  const memory = getUserMemory(userId)
  let summary = ""
  
  if (memory.growth.streakDays > 1) {
    summary += `🔥 ${memory.growth.streakDays} day streak\n`
  }
  
  if (memory.growth.scenariosCompleted > 0) {
    summary += `✅ ${memory.growth.scenariosCompleted} scenarios completed\n`
  }
  
  if (memory.insights.recurringThemes.length > 0) {
    summary += `\n💭 You talk about: ${memory.insights.recurringThemes.slice(0, 3).join(', ')}\n`
  }
  
  // Tone preference insight
  const prefs = memory.patterns.tonePreferences
  const total = Object.values(prefs).reduce((a, b) => a + b, 0)
  if (total > 5) {
    const maxTone = Object.entries(prefs).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    const percentage = Math.round((prefs[maxTone as keyof typeof prefs] / total) * 100)
    summary += `\n🎯 You choose ${maxTone} responses ${percentage}% of the time\n`
  }
  
  if (memory.growth.milestones.length > 0) {
    const recent = memory.growth.milestones.slice(-3)
    summary += `\n🏆 Recent wins:\n${recent.map(m => `• ${m.description}`).join('\n')}\n`
  }
  
  return summary || "Start chatting to build your insights!"
}

// Export memory as JSON for user download (data portability)
export function exportUserData(userId: string): string {
  const memory = getUserMemory(userId)
  return JSON.stringify(memory, null, 2)
}

// Import memory from JSON
export function importUserData(userId: string, jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData)
    data.userId = userId // Ensure userId matches
    saveUserMemory(data)
    return true
  } catch {
    return false
  }
}

// Clear specific types of memory (for privacy)
export function clearMemoryCategory(userId: string, category: 'facts' | 'conversations' | 'all'): void {
  const memory = getUserMemory(userId)
  
  if (category === 'facts') {
    memory.facts = []
  } else if (category === 'conversations') {
    memory.pastConversations = []
  } else if (category === 'all') {
    const freshMemory = createUserMemory(userId)
    saveUserMemory(freshMemory)
    return
  }
  
  saveUserMemory(memory)
}

