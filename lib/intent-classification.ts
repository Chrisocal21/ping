/**
 * Intent Classification System
 * 
 * Automatically detects user intent from their messages to provide appropriate support.
 * Classifies into: practice, vent, coaching, or chat modes.
 */

export type ConversationIntent = 'practice' | 'vent' | 'coaching' | 'chat'

export interface IntentAnalysis {
  primaryIntent: ConversationIntent
  confidence: number
  signals: string[]
  suggestedMode?: ConversationIntent
}

// Keywords and patterns for each intent
const intentPatterns = {
  practice: {
    keywords: [
      'practice', 'rehearse', 'prepare', 'interview', 'presentation',
      'conversation', 'talk to', 'meeting', 'speaking', 'saying',
      'respond', 'reply', 'answer', 'what should i say', 'how do i say',
      'social', 'awkward', 'small talk', 'networking', 'introduce myself',
      'roleplay', 'pretend', 'scenario', 'situation'
    ],
    phrases: [
      'how do i', 'what should i', 'help me practice', 'can we practice',
      'i have a', 'coming up', 'need to prepare', 'getting ready for',
      'i want to practice', 'can you help me', 'i need help with'
    ]
  },
  vent: {
    keywords: [
      'frustrated', 'annoyed', 'angry', 'pissed', 'mad', 'upset',
      'exhausted', 'tired', 'overwhelmed', 'stressed', 'anxious',
      'worried', 'scared', 'nervous', 'panic', 'freaking out',
      'hate', 'can\'t stand', 'so done', 'fed up', 'sick of',
      'ugh', 'argh', 'just need to', 'need to talk', 'listen'
    ],
    phrases: [
      'i just need', 'i can\'t deal', 'so frustrated', 'driving me crazy',
      'i hate when', 'why do people', 'i\'m so tired', 'can\'t take',
      'need to vent', 'hear me out', 'let me rant', 'i\'m so over'
    ],
    intensity: ['!!!', 'FUCK', 'SHIT', 'DAMN', 'seriously', 'literally']
  },
  coaching: {
    keywords: [
      'decide', 'decision', 'choice', 'option', 'should i',
      'wondering if', 'thinking about', 'considering', 'unsure',
      'confused', 'stuck', 'don\'t know', 'help me think',
      'advice', 'what do you think', 'perspective', 'opinion',
      'torn between', 'weighing', 'pros and cons', 'evaluate'
    ],
    phrases: [
      'should i', 'do you think i should', 'i don\'t know if',
      'trying to decide', 'help me figure out', 'not sure whether',
      'thinking about whether', 'help me think through', 'stuck on',
      'can\'t decide', 'what would you'
    ]
  },
  chat: {
    // Default - casual conversation that doesn't fit other categories
    keywords: [
      'hey', 'hi', 'hello', 'sup', 'what\'s up', 'how are you',
      'how\'s it going', 'just wanted to', 'checking in',
      'random', 'tell me about', 'what do you think about'
    ]
  }
}

/**
 * Analyzes a message to determine user intent
 */
export function classifyIntent(message: string): IntentAnalysis {
  const lowerMessage = message.toLowerCase()
  const signals: string[] = []
  let maxConfidence = 0
  let detectedIntent: ConversationIntent = 'chat'

  // Check each intent type
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    let score = 0
    const intentType = intent as ConversationIntent

    // Check keywords
    if (patterns.keywords) {
      for (const keyword of patterns.keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          score += 1
          signals.push(`keyword: "${keyword}"`)
        }
      }
    }

    // Check phrases (weighted higher)
    if ('phrases' in patterns && Array.isArray(patterns.phrases)) {
      for (const phrase of patterns.phrases) {
        if (lowerMessage.includes(phrase.toLowerCase())) {
          score += 2
          signals.push(`phrase: "${phrase}"`)
        }
      }
    }

    // Check intensity markers for venting
    if (intentType === 'vent' && 'intensity' in patterns && Array.isArray(patterns.intensity)) {
      for (const marker of patterns.intensity) {
        if (message.includes(marker) || lowerMessage.includes(marker.toLowerCase())) {
          score += 1.5
          signals.push(`intensity: "${marker}"`)
        }
      }
    }

    // Normalize score to confidence (0-1)
    const confidence = Math.min(score / 5, 1)

    if (confidence > maxConfidence) {
      maxConfidence = confidence
      detectedIntent = intentType
    }
  }

  // Question patterns suggest coaching
  const questionWords = ['should i', 'do i', 'is it', 'am i', 'can i', 'would it']
  if (questionWords.some(q => lowerMessage.includes(q)) && detectedIntent === 'chat') {
    detectedIntent = 'coaching'
    maxConfidence = Math.max(maxConfidence, 0.4)
    signals.push('decision question detected')
  }

  // Long messages with emotional content suggest venting
  if (message.length > 200 && detectedIntent === 'chat') {
    const emotionalWords = ['feel', 'feeling', 'felt', 'just', 'really', 'so']
    const emotionalCount = emotionalWords.filter(word => 
      lowerMessage.includes(word)
    ).length
    
    if (emotionalCount >= 2) {
      detectedIntent = 'vent'
      maxConfidence = Math.max(maxConfidence, 0.5)
      signals.push('long emotional message')
    }
  }

  // Specific action/event mentions suggest practice
  const practiceIndicators = [
    /tomorrow/i, /next week/i, /coming up/i, /tonight/i, /later/i,
    /job/i, /interview/i, /date/i, /party/i, /meeting/i
  ]
  if (practiceIndicators.some(pattern => pattern.test(message))) {
    if (detectedIntent === 'chat' || maxConfidence < 0.6) {
      detectedIntent = 'practice'
      maxConfidence = Math.max(maxConfidence, 0.5)
      signals.push('upcoming event detected')
    }
  }

  return {
    primaryIntent: detectedIntent,
    confidence: maxConfidence,
    signals: signals.slice(0, 3), // Top 3 signals
    suggestedMode: maxConfidence > 0.5 ? detectedIntent : undefined
  }
}

/**
 * Determines if mode should auto-switch based on intent analysis
 */
export function shouldSwitchMode(
  currentMode: ConversationIntent,
  analysis: IntentAnalysis
): boolean {
  // Don't switch if confidence is too low
  if (analysis.confidence < 0.6) return false

  // Don't switch if already in the right mode
  if (currentMode === analysis.primaryIntent) return false

  // Don't switch from chat to practice/coaching unless confidence is high
  if (currentMode === 'chat' && analysis.confidence < 0.7) return false

  // Allow switching from chat easily
  if (currentMode === 'chat') return true

  // Allow switching to vent from any mode (emotional urgency)
  if (analysis.primaryIntent === 'vent' && analysis.confidence > 0.7) return true

  // Otherwise, keep current mode (user explicitly chose it)
  return false
}

/**
 * Generates a smooth transition message when mode switches
 */
export function getModeTransitionMessage(
  fromMode: ConversationIntent,
  toMode: ConversationIntent,
  personalityId: string
): string | null {
  // Don't announce transitions from chat
  if (fromMode === 'chat') return null

  const transitions: Record<string, Record<string, string[]>> = {
    max: {
      'practice-vent': [
        "Sounds like there's a lot going on. Let's talk through it.",
        "I hear you. Want to talk about what's happening?"
      ],
      'practice-coaching': [
        "This sounds like a decision to work through. Let's think it through.",
        "Okay, let's figure this out together."
      ],
      'coaching-vent': [
        "I'm hearing you need to let this out. I'm listening.",
        "Let's pause on that and just talk about how you're feeling."
      ],
      'coaching-practice': [
        "Want to practice how you'd approach this?",
        "Should we work through what you'd actually say?"
      ],
      'vent-coaching': [
        "Okay. Now, what do you want to do about this?",
        "Alright. Let's think through your options."
      ],
      'vent-practice': [
        "Want to practice how you'd handle this conversation?",
        "Should we work on what you'd actually say?"
      ]
    }
  }

  const personalityTransitions = transitions[personalityId] || transitions.max
  const key = `${fromMode}-${toMode}`
  const options = personalityTransitions[key]

  if (!options) return null

  return options[Math.floor(Math.random() * options.length)]
}

/**
 * Get context hints for the AI based on detected intent
 */
export function getIntentContext(analysis: IntentAnalysis): string {
  const contexts = {
    practice: `\n\n--- DETECTED INTENT: PRACTICE ---\nThe user wants to practice or prepare for a real situation. Offer to role-play, provide response options, or help them rehearse. Ask about the specific context and what they want to work on.`,
    
    vent: `\n\n--- DETECTED INTENT: VENTING ---\nThe user needs to express frustration or difficult emotions. Listen actively, validate without trying to fix immediately. Let them get it all out. Ask clarifying questions but don't rush to solutions.`,
    
    coaching: `\n\n--- DETECTED INTENT: DECISION SUPPORT ---\nThe user is working through a decision or problem. Ask clarifying questions, help them explore options, and guide their thinking. Use coaching frameworks naturally.`,
    
    chat: `\n\n--- DETECTED INTENT: CASUAL CHAT ---\nThe user wants casual conversation. Be present, follow their lead, and stay curious about what they want to talk about.`
  }

  return contexts[analysis.primaryIntent]
}
