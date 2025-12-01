// Intelligent scenario generation and adaptation system
// Learns from user behavior and generates dynamic scenarios

import { Scenario, ScenarioOption, ScenarioCategory, ToneType } from './scenarios'

// --- SCENARIO LEARNING SYSTEM ---

export interface ScenarioPattern {
  userPreferences: {
    difficultySweetSpot: number // 1-5, what difficulty they succeed at most
    preferredCategories: ScenarioCategory[]
    avoidedTones: ToneType[] // Tones they never pick
    successfulTones: ToneType[] // Tones that work well for them
  }
  performanceHistory: {
    scenarioId: string
    chosenTone: ToneType
    difficulty: number
    timestamp: string
    feltSuccessful: boolean // Did they feel good about their choice?
  }[]
  skillGaps: string[] // Skills they haven't practiced yet
  masteredSkills: string[] // Skills they consistently do well with
}

// Initialize learning data for user
export function initializeScenarioLearning(userId: string): ScenarioPattern {
  return {
    userPreferences: {
      difficultySweetSpot: 2, // Start at medium-low
      preferredCategories: [],
      avoidedTones: [],
      successfulTones: [],
    },
    performanceHistory: [],
    skillGaps: [],
    masteredSkills: [],
  }
}

// Get learning data from localStorage
export function getScenarioLearning(userId: string): ScenarioPattern {
  if (typeof window === 'undefined') return initializeScenarioLearning(userId)
  
  const stored = localStorage.getItem(`ping_scenario_learning_${userId}`)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return initializeScenarioLearning(userId)
    }
  }
  return initializeScenarioLearning(userId)
}

// Save learning data
function saveScenarioLearning(userId: string, data: ScenarioPattern): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`ping_scenario_learning_${userId}`, JSON.stringify(data))
}

// Record scenario completion and learn from it
export function recordScenarioLearning(
  userId: string,
  scenarioId: string,
  chosenTone: ToneType,
  difficulty: number,
  skill: string
): void {
  const data = getScenarioLearning(userId)
  
  // Add to history
  data.performanceHistory.push({
    scenarioId,
    chosenTone,
    difficulty,
    timestamp: new Date().toISOString(),
    feltSuccessful: true, // Default to true, can be updated later
  })
  
  // Keep last 100 scenarios
  if (data.performanceHistory.length > 100) {
    data.performanceHistory = data.performanceHistory.slice(-100)
  }
  
  // Update tone preferences
  const toneCount: Record<ToneType, number> = { safe: 0, curious: 0, playful: 0, bold: 0 }
  data.performanceHistory.forEach(h => {
    toneCount[h.chosenTone]++
  })
  
  // Tones chosen > 40% of the time are "successful"
  const total = data.performanceHistory.length
  data.userPreferences.successfulTones = (Object.keys(toneCount) as ToneType[]).filter(
    tone => toneCount[tone] / total > 0.4
  )
  
  // Tones chosen < 5% of the time are "avoided"
  data.userPreferences.avoidedTones = (Object.keys(toneCount) as ToneType[]).filter(
    tone => toneCount[tone] / total < 0.05 && total > 20
  )
  
  // Calculate difficulty sweet spot (average of last 20 scenarios)
  const recentDifficulties = data.performanceHistory.slice(-20).map(h => h.difficulty)
  data.userPreferences.difficultySweetSpot = Math.round(
    recentDifficulties.reduce((a, b) => a + b, 0) / recentDifficulties.length
  )
  
  // Track skill practice
  if (!data.masteredSkills.includes(skill)) {
    const skillCount = data.performanceHistory.filter(h => {
      // Would need to track skill per scenario, simplified here
      return true
    }).length
    
    if (skillCount > 10) {
      data.masteredSkills.push(skill)
    }
  }
  
  saveScenarioLearning(userId, data)
}

// --- SCENARIO VARIATION ALGORITHM ---

// Generate variations of a scenario by changing one element
export function generateScenarioVariation(baseScenario: Scenario, variationType: 'location' | 'relationship' | 'context' | 'stakes'): Scenario {
  const variation = { ...baseScenario }
  variation.id = `${baseScenario.id}_var_${Date.now()}`
  
  if (variationType === 'location') {
    // Same situation, different location
    const locations = [
      { old: 'coffee shop', new: 'bookstore' },
      { old: 'elevator', new: 'waiting room' },
      { old: 'office', new: 'co-working space' },
      { old: 'party', new: 'wedding' },
      { old: 'gym', new: 'yoga class' },
    ]
    
    locations.forEach(({ old, new: newLoc }) => {
      if (variation.setup.toLowerCase().includes(old)) {
        variation.setup = variation.setup.replace(new RegExp(old, 'gi'), newLoc)
        variation.aiPrompt = variation.aiPrompt.replace(new RegExp(old, 'gi'), newLoc)
      }
    })
  }
  
  if (variationType === 'relationship') {
    // Same situation, different relationship
    const relationships = [
      { old: 'coworker', new: 'classmate' },
      { old: 'friend', new: 'acquaintance' },
      { old: 'stranger', new: 'neighbor' },
      { old: 'boss', new: 'teacher' },
      { old: 'colleague', new: 'teammate' },
    ]
    
    relationships.forEach(({ old, new: newRel }) => {
      if (variation.setup.toLowerCase().includes(old) || variation.aiPrompt.toLowerCase().includes(old)) {
        variation.setup = variation.setup.replace(new RegExp(old, 'gi'), newRel)
        variation.aiPrompt = variation.aiPrompt.replace(new RegExp(old, 'gi'), newRel)
      }
    })
  }
  
  if (variationType === 'context') {
    // Same core interaction, different circumstances
    if (baseScenario.category === 'everyday') {
      variation.difficulty = Math.min(5, baseScenario.difficulty + 1)
      variation.setup = variation.setup + ' (You\'re running late)'
    } else if (baseScenario.category === 'professional') {
      variation.setup = variation.setup + ' (Your manager is watching)'
    }
  }
  
  if (variationType === 'stakes') {
    // Increase or decrease pressure
    variation.difficulty = Math.min(5, Math.max(1, baseScenario.difficulty + (Math.random() > 0.5 ? 1 : -1)))
  }
  
  return variation
}

// --- DYNAMIC SCENARIO GENERATION ---

// Generate a completely new scenario based on learned patterns
export function generateDynamicScenario(
  userId: string,
  category: ScenarioCategory,
  targetDifficulty?: number
): Scenario {
  const learning = getScenarioLearning(userId)
  const difficulty = targetDifficulty || learning.userPreferences.difficultySweetSpot
  
  // Template-based generation (in production, would use GPT to generate these)
  const templates = getScenarioTemplates(category, difficulty)
  const template = templates[Math.floor(Math.random() * templates.length)]
  
  return {
    id: `dynamic_${category}_${Date.now()}`,
    category,
    setup: template.setup,
    aiPrompt: template.prompt,
    options: generateDynamicOptions(learning),
    difficulty,
  }
}

// Get scenario templates for generation
function getScenarioTemplates(category: ScenarioCategory, difficulty: number): { setup: string; prompt: string }[] {
  const templates: Record<ScenarioCategory, { setup: string; prompt: string }[]> = {
    everyday: [
      {
        setup: 'Grocery store small talk',
        prompt: 'Someone in line comments on your groceries. How do you respond?',
      },
      {
        setup: 'Library encounter',
        prompt: 'You reach for the same book as someone else. What do you say?',
      },
      {
        setup: 'Walking your dog',
        prompt: 'Another dog owner approaches to let your dogs meet. Your response:',
      },
    ],
    professional: [
      {
        setup: 'Video call technical issue',
        prompt: 'Your video freezes during a presentation. When it reconnects, what do you say?',
      },
      {
        setup: 'Slack message misread',
        prompt: 'Someone misinterprets your message as rude. How do you clarify?',
      },
    ],
    relationships: [
      {
        setup: 'Friend running late',
        prompt: 'Your friend is 30 minutes late. They arrive without acknowledging it. What do you say?',
      },
      {
        setup: 'Group chat drama',
        prompt: 'Someone subtweeted you in the group chat. How do you handle it?',
      },
    ],
    difficult: [
      {
        setup: 'Confronting gossip',
        prompt: 'You hear someone spreading rumors about you. How do you address it?',
      },
      {
        setup: 'Saying no to family',
        prompt: 'A family member asks for a favor you can\'t/don\'t want to do. What do you say?',
      },
    ],
    anxiety_friendly: [
      {
        setup: 'Rescheduling plans',
        prompt: 'You need to cancel plans due to anxiety. How do you communicate that?',
      },
      {
        setup: 'Asking for accommodation',
        prompt: 'You need a sensory accommodation (quiet room, less eye contact). How do you ask?',
      },
    ],
  }
  
  return templates[category] || templates.everyday
}

// Generate options dynamically based on learning
function generateDynamicOptions(learning: ScenarioPattern): ScenarioOption[] {
  // Would use GPT in production, but here's template-based approach
  const baseOptions: ScenarioOption[] = [
    {
      text: 'Safe response option',
      tone: 'safe',
      response: 'Simple and effective. No risk.',
      skill: 'basic_rapport',
    },
    {
      text: 'Curious response option',
      tone: 'curious',
      response: 'You asked a question and opened conversation.',
      skill: 'follow_up_questions',
    },
    {
      text: 'Playful response option',
      tone: 'playful',
      response: 'Light humor made it memorable.',
      skill: 'humor_deployment',
    },
    {
      text: 'Bold response option',
      tone: 'bold',
      response: 'Direct and confident. High risk, high reward.',
      skill: 'assertive_communication',
    },
  ]
  
  // Filter out tones the user avoids
  return baseOptions.filter(opt => !learning.userPreferences.avoidedTones.includes(opt.tone))
}

// --- CONTEXT UNDERSTANDING ALGORITHM ---

// Analyze user's message to understand what scenario they need
export function analyzeMessageForScenario(message: string): {
  suggestedCategory: ScenarioCategory
  suggestedDifficulty: number
  keywords: string[]
  context: string
} {
  const lowerMessage = message.toLowerCase()
  
  // Keyword detection for categories
  const categoryKeywords: Record<ScenarioCategory, string[]> = {
    everyday: ['coffee', 'store', 'stranger', 'casual', 'small talk', 'neighbor', 'random'],
    professional: ['work', 'boss', 'colleague', 'meeting', 'office', 'email', 'manager', 'job'],
    relationships: ['friend', 'boyfriend', 'girlfriend', 'roommate', 'family', 'dating', 'partner'],
    difficult: ['confrontation', 'conflict', 'argument', 'disagree', 'uncomfortable', 'awkward', 'hard'],
    anxiety_friendly: ['anxious', 'nervous', 'scared', 'easy', 'low-pressure', 'simple', 'practice'],
  }
  
  // Difficulty keywords
  const difficultyKeywords = {
    easy: ['easy', 'simple', 'basic', 'beginner', 'start'],
    hard: ['difficult', 'challenging', 'advanced', 'scary', 'intimidating'],
  }
  
  let suggestedCategory: ScenarioCategory = 'everyday'
  let matchCount = 0
  
  // Find best category match
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const matches = keywords.filter(kw => lowerMessage.includes(kw)).length
    if (matches > matchCount) {
      matchCount = matches
      suggestedCategory = category as ScenarioCategory
    }
  }
  
  // Determine difficulty
  let suggestedDifficulty = 2 // Default medium-low
  
  if (difficultyKeywords.easy.some(kw => lowerMessage.includes(kw))) {
    suggestedDifficulty = 1
  } else if (difficultyKeywords.hard.some(kw => lowerMessage.includes(kw))) {
    suggestedDifficulty = 4
  }
  
  // Extract context keywords
  const allKeywords = Object.values(categoryKeywords).flat()
  const foundKeywords = allKeywords.filter(kw => lowerMessage.includes(kw))
  
  return {
    suggestedCategory,
    suggestedDifficulty,
    keywords: foundKeywords,
    context: message,
  }
}

// --- SMART SCENARIO RECOMMENDATION ---

// Recommend next scenario based on learning and current context
export function recommendNextScenario(
  userId: string,
  currentEmotionalState?: string,
  recentTopics?: string[]
): {
  category: ScenarioCategory
  difficulty: number
  reasoning: string
} {
  const learning = getScenarioLearning(userId)
  
  // If user is anxious, suggest anxiety-friendly scenarios
  if (currentEmotionalState === 'anxious' || currentEmotionalState === 'overwhelmed') {
    return {
      category: 'anxiety_friendly',
      difficulty: Math.max(1, learning.userPreferences.difficultySweetSpot - 1),
      reasoning: 'You seem overwhelmed. Let\'s practice something low-pressure.',
    }
  }
  
  // If user is building confidence, gradually increase difficulty
  if (learning.performanceHistory.length > 20) {
    const recentSuccesses = learning.performanceHistory.slice(-10).filter(h => h.feltSuccessful).length
    
    if (recentSuccesses >= 8) {
      return {
        category: learning.userPreferences.preferredCategories[0] || 'everyday',
        difficulty: Math.min(5, learning.userPreferences.difficultySweetSpot + 1),
        reasoning: 'You\'re doing great! Ready for something a bit more challenging?',
      }
    }
  }
  
  // Default: suggest category they haven't practiced recently
  const recentCategories = learning.performanceHistory.slice(-10).map(h => {
    // Would need to store category with history, simplified here
    return 'everyday' as ScenarioCategory
  })
  
  const allCategories: ScenarioCategory[] = ['everyday', 'professional', 'relationships', 'difficult', 'anxiety_friendly']
  const underPracticedCategories = allCategories.filter(cat => !recentCategories.includes(cat))
  
  return {
    category: underPracticedCategories[0] || 'everyday',
    difficulty: learning.userPreferences.difficultySweetSpot,
    reasoning: 'Let\'s practice something different to keep building diverse skills.',
  }
}

// --- SCENARIO ADAPTATION ALGORITHM ---

// Adapt scenario difficulty in real-time based on user's response
export function adaptScenarioDifficulty(
  userId: string,
  lastChosenTone: ToneType,
  scenarioDifficulty: number
): number {
  const learning = getScenarioLearning(userId)
  
  // If they consistently choose "safe", reduce difficulty
  const lastFiveChoices = learning.performanceHistory.slice(-5).map(h => h.chosenTone)
  const safeCount = lastFiveChoices.filter(t => t === 'safe').length
  
  if (safeCount >= 4) {
    return Math.max(1, scenarioDifficulty - 1)
  }
  
  // If they're choosing bold/playful consistently, increase difficulty
  const boldOrPlayful = lastFiveChoices.filter(t => t === 'bold' || t === 'playful').length
  
  if (boldOrPlayful >= 4) {
    return Math.min(5, scenarioDifficulty + 1)
  }
  
  return scenarioDifficulty
}

// --- PATTERN RECOGNITION ---

// Identify patterns in user's scenario choices
export function identifyUserPatterns(userId: string): {
  communicationStyle: string
  growthTrajectory: string
  recommendations: string[]
} {
  const learning = getScenarioLearning(userId)
  
  if (learning.performanceHistory.length < 10) {
    return {
      communicationStyle: 'Still learning your style',
      growthTrajectory: 'Just getting started',
      recommendations: ['Keep practicing to build your profile'],
    }
  }
  
  // Analyze tone distribution
  const toneCount: Record<ToneType, number> = { safe: 0, curious: 0, playful: 0, bold: 0 }
  learning.performanceHistory.forEach(h => {
    toneCount[h.chosenTone]++
  })
  
  const total = learning.performanceHistory.length
  const dominantTone = (Object.keys(toneCount) as ToneType[]).reduce((a, b) => 
    toneCount[a] > toneCount[b] ? a : b
  )
  
  const communicationStyles: Record<ToneType, string> = {
    safe: 'Cautious Communicator - You prioritize comfort and low-risk interactions',
    curious: 'Engaged Conversationalist - You build connections through genuine interest',
    playful: 'Lighthearted Connector - You use humor and warmth to relate to others',
    bold: 'Direct Communicator - You value authenticity and aren\'t afraid of discomfort',
  }
  
  // Analyze growth trajectory
  const firstHalf = learning.performanceHistory.slice(0, Math.floor(total / 2))
  const secondHalf = learning.performanceHistory.slice(Math.floor(total / 2))
  
  const firstAvgDifficulty = firstHalf.reduce((sum, h) => sum + h.difficulty, 0) / firstHalf.length
  const secondAvgDifficulty = secondHalf.reduce((sum, h) => sum + h.difficulty, 0) / secondHalf.length
  
  let growthTrajectory = 'Steady progress'
  if (secondAvgDifficulty > firstAvgDifficulty + 0.5) {
    growthTrajectory = 'Increasing confidence - you\'re tackling harder scenarios'
  } else if (secondAvgDifficulty < firstAvgDifficulty - 0.5) {
    growthTrajectory = 'Focusing on fundamentals - building strong foundation'
  }
  
  // Generate recommendations
  const recommendations: string[] = []
  
  if (toneCount.safe / total > 0.7) {
    recommendations.push('Try experimenting with curious or playful responses')
  }
  
  if (toneCount.bold / total < 0.1 && total > 20) {
    recommendations.push('Challenge yourself with a bold response sometime')
  }
  
  const categoryVariety = new Set(learning.performanceHistory.map(h => h.scenarioId.split('_')[0])).size
  if (categoryVariety < 3) {
    recommendations.push('Explore different scenario categories to build diverse skills')
  }
  
  return {
    communicationStyle: communicationStyles[dominantTone],
    growthTrajectory,
    recommendations: recommendations.length > 0 ? recommendations : ['Keep up the great work!'],
  }
}

// --- EXPORT SCENARIO INTELLIGENCE SUMMARY ---

export function getScenarioIntelligenceSummary(userId: string): string {
  const learning = getScenarioLearning(userId)
  const patterns = identifyUserPatterns(userId)
  
  if (learning.performanceHistory.length === 0) {
    return 'Start practicing scenarios to unlock personalized insights!'
  }
  
  let summary = `📊 **Scenario Intelligence Report**\n\n`
  summary += `**Scenarios Completed:** ${learning.performanceHistory.length}\n`
  summary += `**Your Style:** ${patterns.communicationStyle}\n`
  summary += `**Growth:** ${patterns.growthTrajectory}\n`
  summary += `**Sweet Spot Difficulty:** Level ${learning.userPreferences.difficultySweetSpot}/5\n\n`
  
  if (learning.userPreferences.successfulTones.length > 0) {
    summary += `**Your Go-To Tones:** ${learning.userPreferences.successfulTones.join(', ')}\n`
  }
  
  if (patterns.recommendations.length > 0) {
    summary += `\n**Recommendations:**\n`
    patterns.recommendations.forEach(rec => {
      summary += `• ${rec}\n`
    })
  }
  
  return summary
}
