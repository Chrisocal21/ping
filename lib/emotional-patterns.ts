// Emotional support pattern system
// Detects emotional states and provides appropriate validation and support

export type EmotionalState = 
  | 'venting'
  | 'anxious'
  | 'sad'
  | 'angry'
  | 'overwhelmed'
  | 'neutral'

export interface EmotionalPattern {
  state: EmotionalState
  triggers: string[] // Keywords that indicate this state
  validationTemplates: string[] // Responses that validate their feeling
  followUpStrategies: string[] // Ways to continue the conversation
  avoidPhrases: string[] // Things NOT to say
  supportLevel: 'light' | 'moderate' | 'deep' // How much support to offer
}

// Pattern definitions for each emotional state
export const emotionalPatterns: Record<EmotionalState, EmotionalPattern> = {
  venting: {
    state: 'venting',
    triggers: [
      'frustrated', 'annoyed', 'sick of', 'tired of', 'fed up',
      'ugh', 'annoying', 'irritating', 'drives me crazy',
      'can\'t stand', 'bothers me', 'getting on my nerves'
    ],
    validationTemplates: [
      'That sounds really frustrating.',
      'Yeah, that would annoy me too.',
      'Ugh, I get why that\'s bothering you.',
      'That\'s genuinely irritating.',
      'You have every right to be frustrated about that.',
      'That sounds exhausting to deal with.',
    ],
    followUpStrategies: [
      'Let them continue - ask "What else?" or "Go on"',
      'Reflect back what they said to show you\'re listening',
      'Validate the feeling without trying to fix it',
      'Ask if there\'s more they want to get off their chest',
      'Only offer solutions if they explicitly ask',
    ],
    avoidPhrases: [
      'At least...',
      'It could be worse',
      'Have you tried...',
      'Look on the bright side',
      'Everything happens for a reason',
      'Just don\'t think about it',
    ],
    supportLevel: 'light',
  },
  
  anxious: {
    state: 'anxious',
    triggers: [
      'anxious', 'nervous', 'worried', 'scared', 'terrified',
      'what if', 'freaking out', 'panicking', 'can\'t stop thinking',
      'overthinking', 'spiraling', 'racing thoughts', 'heart racing'
    ],
    validationTemplates: [
      'That anxiety makes sense given the situation.',
      'Yeah, uncertainty like that is really hard.',
      'Your brain is trying to protect you, even if it\'s overdoing it right now.',
      'That\'s a lot to be carrying around in your head.',
      'Anxiety can make everything feel way more intense.',
      'It makes sense you\'re worried about this.',
    ],
    followUpStrategies: [
      'Ground them in the present moment',
      'Help them separate fears from facts',
      'Ask what\'s the worst case, best case, most likely case',
      'Gently challenge catastrophic thinking',
      'Offer to break down the situation into smaller pieces',
      'Remind them they\'ve handled hard things before',
    ],
    avoidPhrases: [
      'Just relax',
      'Don\'t worry about it',
      'You\'re overreacting',
      'It\'s all in your head',
      'Calm down',
      'There\'s nothing to be anxious about',
    ],
    supportLevel: 'moderate',
  },
  
  sad: {
    state: 'sad',
    triggers: [
      'sad', 'depressed', 'down', 'hopeless', 'empty',
      'crying', 'tears', 'hurting', 'broken', 'lost',
      'lonely', 'alone', 'miss', 'grief', 'mourning'
    ],
    validationTemplates: [
      'I\'m really sorry you\'re feeling this way.',
      'That sounds really painful.',
      'It\'s okay to feel sad about this.',
      'That\'s a heavy thing to be carrying.',
      'You don\'t have to be okay right now.',
      'It makes sense this is hitting you hard.',
    ],
    followUpStrategies: [
      'Sit with them in the sadness - don\'t rush to cheer them up',
      'Ask if they want to talk about it or just have company',
      'Acknowledge the loss or disappointment',
      'Remind them sadness comes in waves',
      'Gently ask if there\'s anything that would help right now',
      'Normalize crying and emotional release',
    ],
    avoidPhrases: [
      'Cheer up',
      'It\'ll get better',
      'Time heals all wounds',
      'Stay positive',
      'Other people have it worse',
      'You should be grateful for...',
    ],
    supportLevel: 'deep',
  },
  
  angry: {
    state: 'angry',
    triggers: [
      'angry', 'mad', 'pissed', 'furious', 'rage',
      'hate', 'betrayed', 'screwed over', 'unfair',
      'disrespected', 'violated', 'wronged', 'livid'
    ],
    validationTemplates: [
      'You have every right to be angry about that.',
      'That\'s genuinely unfair.',
      'I\'d be pissed too.',
      'They had no right to do that to you.',
      'That crossed a line.',
      'Your anger is completely valid here.',
    ],
    followUpStrategies: [
      'Let them express the anger fully first',
      'Validate that the anger is justified',
      'Help them identify what boundary was crossed',
      'Ask what they need - to be heard, or to problem-solve',
      'Support them in deciding how to respond',
      'Distinguish between feeling angry and acting on it',
    ],
    avoidPhrases: [
      'Let it go',
      'Forgive and forget',
      'Maybe they didn\'t mean it',
      'You\'re being too sensitive',
      'Holding onto anger only hurts you',
      'Just move on',
    ],
    supportLevel: 'moderate',
  },
  
  overwhelmed: {
    state: 'overwhelmed',
    triggers: [
      'overwhelmed', 'too much', 'can\'t handle', 'drowning',
      'stressed', 'burned out', 'exhausted', 'can\'t cope',
      'falling apart', 'breaking point', 'can\'t keep up'
    ],
    validationTemplates: [
      'That is objectively a lot to be dealing with.',
      'Anyone would feel overwhelmed with that much on their plate.',
      'It makes sense you\'re feeling stretched thin.',
      'You\'re not weak - that\'s genuinely too much.',
      'No wonder you\'re exhausted.',
      'That\'s more than one person should have to handle.',
    ],
    followUpStrategies: [
      'Help them externalize everything in their head',
      'Break down the overwhelm into smaller pieces',
      'Identify what actually needs to happen vs. what feels urgent',
      'Ask what can be dropped, delayed, or delegated',
      'Focus on one next small step',
      'Remind them they don\'t have to solve everything today',
    ],
    avoidPhrases: [
      'Just prioritize',
      'You can do it!',
      'One thing at a time (without actually helping them figure out which thing)',
      'It\'s not that bad',
      'You\'re stronger than you think',
      'Take a deep breath and push through',
    ],
    supportLevel: 'deep',
  },
  
  neutral: {
    state: 'neutral',
    triggers: [],
    validationTemplates: [
      'I\'m listening.',
      'Tell me more about that.',
      'How\'s that sitting with you?',
      'What\'s going through your mind?',
    ],
    followUpStrategies: [
      'Stay curious and open',
      'Follow their lead',
      'Reflect back what you hear',
      'Ask open-ended questions',
    ],
    avoidPhrases: [],
    supportLevel: 'light',
  },
}

// Detect emotional state from message
export function detectEmotionalState(message: string): EmotionalState {
  const lowerMessage = message.toLowerCase()
  
  // Check each emotional pattern's triggers
  const states: EmotionalState[] = ['venting', 'anxious', 'sad', 'angry', 'overwhelmed']
  
  for (const state of states) {
    const pattern = emotionalPatterns[state]
    const matchCount = pattern.triggers.filter(trigger => 
      lowerMessage.includes(trigger)
    ).length
    
    // If multiple triggers match, this is likely the state
    if (matchCount >= 2) {
      return state
    }
    
    // Even one strong trigger can indicate state
    if (matchCount >= 1) {
      // Priority order: overwhelmed > angry > anxious > sad > venting
      // (more intense emotions take precedence)
      if (state === 'overwhelmed') return state
      if (state === 'angry' && !lowerMessage.includes('overwhelmed')) return state
      if (state === 'anxious' && !lowerMessage.includes('angry') && !lowerMessage.includes('overwhelmed')) return state
      if (state === 'sad' && !lowerMessage.includes('anxious') && !lowerMessage.includes('angry')) return state
      if (state === 'venting') return state
    }
  }
  
  return 'neutral'
}

// Get appropriate validation response
export function getValidationResponse(state: EmotionalState): string {
  const pattern = emotionalPatterns[state]
  const templates = pattern.validationTemplates
  return templates[Math.floor(Math.random() * templates.length)]
}

// Get follow-up strategy guidance
export function getFollowUpStrategy(state: EmotionalState): string {
  const pattern = emotionalPatterns[state]
  const strategies = pattern.followUpStrategies
  return strategies[Math.floor(Math.random() * strategies.length)]
}

// Build emotional support context for AI prompt
export function getEmotionalSupportContext(state: EmotionalState): string {
  if (state === 'neutral') return ''
  
  const pattern = emotionalPatterns[state]
  
  let context = `\n\nEMOTIONAL SUPPORT GUIDANCE:\n`
  context += `User appears to be feeling: ${state}\n\n`
  
  context += `VALIDATION APPROACH:\n`
  context += `- Use phrases like: ${pattern.validationTemplates.slice(0, 3).join(', ')}\n`
  context += `- Support level: ${pattern.supportLevel}\n\n`
  
  context += `FOLLOW-UP STRATEGY:\n`
  pattern.followUpStrategies.forEach(strategy => {
    context += `- ${strategy}\n`
  })
  
  context += `\nAVOID SAYING:\n`
  pattern.avoidPhrases.forEach(phrase => {
    context += `- "${phrase}"\n`
  })
  
  return context
}

// Check if message needs emotional support (vs. other modes)
export function needsEmotionalSupport(message: string): boolean {
  const state = detectEmotionalState(message)
  return state !== 'neutral'
}

// Get recommended response length based on emotional state
export function getRecommendedResponseLength(state: EmotionalState): 'short' | 'medium' | 'long' {
  const pattern = emotionalPatterns[state]
  
  if (pattern.supportLevel === 'light') return 'short'
  if (pattern.supportLevel === 'moderate') return 'medium'
  return 'long'
}

// Track emotional patterns over time (for memory system integration)
export function recordEmotionalState(userId: string, state: EmotionalState): void {
  if (typeof window === 'undefined') return
  
  const key = `ping_emotions_${userId}`
  const stored = localStorage.getItem(key)
  let emotions: { state: EmotionalState; timestamp: string }[] = []
  
  if (stored) {
    try {
      emotions = JSON.parse(stored)
    } catch {
      emotions = []
    }
  }
  
  emotions.push({
    state,
    timestamp: new Date().toISOString(),
  })
  
  // Keep last 50 emotional states
  if (emotions.length > 50) {
    emotions = emotions.slice(-50)
  }
  
  localStorage.setItem(key, JSON.stringify(emotions))
}

// Get emotional patterns summary for insights
export function getEmotionalPatternsSummary(userId: string): string {
  if (typeof window === 'undefined') return 'No data available'
  
  const key = `ping_emotions_${userId}`
  const stored = localStorage.getItem(key)
  
  if (!stored) return 'Not enough data yet'
  
  try {
    const emotions: { state: EmotionalState; timestamp: string }[] = JSON.parse(stored)
    
    // Count frequency
    const counts: Record<string, number> = {}
    emotions.forEach(e => {
      if (e.state !== 'neutral') {
        counts[e.state] = (counts[e.state] || 0) + 1
      }
    })
    
    // Get most common
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    
    if (sorted.length === 0) return 'Mostly neutral conversations'
    
    const topState = sorted[0][0]
    const topCount = sorted[0][1]
    const total = emotions.filter(e => e.state !== 'neutral').length
    const percentage = Math.round((topCount / total) * 100)
    
    return `You tend to come here when feeling ${topState} (${percentage}% of emotional conversations)`
  } catch {
    return 'Error reading emotional data'
  }
}

// Suggest conversation mode based on emotional state
export function suggestModeFromEmotion(state: EmotionalState): 'practice' | 'vent' | 'coaching' | 'chat' {
  if (state === 'venting' || state === 'angry') return 'vent'
  if (state === 'anxious' || state === 'overwhelmed') return 'coaching'
  if (state === 'sad') return 'chat' // Just be there with them
  return 'chat'
}
