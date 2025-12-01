// Session management types and utilities

export type SessionType = 'quick' | 'practice' | 'vent' | 'untangle' | 'chat'
export type ConversationMode = 'practice' | 'vent' | 'coaching' | 'chat'

export interface Session {
  id: string
  type: SessionType
  mode: ConversationMode
  startedAt: Date
  lastActive: Date
  messageCount: number
}

export function createSession(mode: ConversationMode): Session {
  return {
    id: `session_${Date.now()}`,
    type: inferSessionType(mode),
    mode,
    startedAt: new Date(),
    lastActive: new Date(),
    messageCount: 0,
  }
}

function inferSessionType(mode: ConversationMode): SessionType {
  switch (mode) {
    case 'practice':
      return 'practice'
    case 'vent':
      return 'vent'
    case 'coaching':
      return 'untangle'
    default:
      return 'chat'
  }
}

export function getLastVisit(): Date | null {
  if (typeof window === 'undefined') return null
  
  const lastVisit = localStorage.getItem('ping_last_visit')
  return lastVisit ? new Date(lastVisit) : null
}

export function updateLastVisit(): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('ping_last_visit', new Date().toISOString())
}

// Personality-specific greeting variations
const greetingsByPersonality: Record<string, {
  sameDay: string[]
  nextDay: string[]
  fewDays: string[]
  longTime: string[]
}> = {
  max: {
    sameDay: [
      "Hey again. What's on your mind?",
      "Welcome back. What's going on?",
      "Hey. What do you want to talk about?"
    ],
    nextDay: [
      "Hey. New day, new chaos. What's on your mind?",
      "Good to see you. What's happening today?",
      "Hey there. How are things going?"
    ],
    fewDays: [
      "Hey, been a minute. No guilt — I'm not tracking attendance. What's going on?",
      "Hey. Been a few days. What's new?",
      "Welcome back. What's been happening?"
    ],
    longTime: [
      "Well look who's back. Missed you. Genuinely. What's happening in your world?",
      "Hey! It's been a while. How have you been?",
      "Good to see you again. What's on your mind?"
    ]
  },
  jamie: {
    sameDay: [
      "Hey! You're back! What's up?",
      "There you are! What's happening?",
      "Hey hey! What do you want to work on?"
    ],
    nextDay: [
      "Morning! Ready to tackle today?",
      "New day, new possibilities! What's up?",
      "Hey! How's today treating you?"
    ],
    fewDays: [
      "Look who it is! Missed you! What's new?",
      "Hey! Been thinking about you. How are things?",
      "There you are! What's been going on?"
    ],
    longTime: [
      "OMG you're back! I'm so glad to see you! What have you been up to?",
      "Hey stranger! Welcome back! Tell me everything!",
      "You're here! Seriously so good to see you. How have you been?"
    ]
  },
  sage: {
    sameDay: [
      "Back already. What are you thinking about?",
      "Hello again. What's on your mind?",
      "Returning so soon. What brings you here?"
    ],
    nextDay: [
      "Another day. How are you approaching it?",
      "Good to see you. What's present for you today?",
      "Hello. What's calling your attention?"
    ],
    fewDays: [
      "Some time has passed. How have things evolved?",
      "Welcome back. What's shifted for you?",
      "It's been a few days. What are you noticing?"
    ],
    longTime: [
      "Quite some time has passed. I'm curious what brings you back now.",
      "Hello again. What's different since we last spoke?",
      "Welcome back. I wonder what's present for you today."
    ]
  },
  riley: {
    sameDay: [
      "Back for more? Cool. What's up?",
      "Yo. What do you need?",
      "Hey. What's the situation?"
    ],
    nextDay: [
      "New day. What's the move?",
      "Sup. What's on your radar today?",
      "Hey. What are we dealing with?"
    ],
    fewDays: [
      "Been MIA. No judgment. What's up?",
      "Where you been? Anyway, what's going on?",
      "Look who decided to show up. What's happening?"
    ],
    longTime: [
      "Damn, it's been a minute. You good? What's new?",
      "Well well. Long time. What's been going on?",
      "Yo, where have you been? Fill me in."
    ]
  }
}

export function getWelcomeMessage(lastVisit: Date | null, personalityId: string = 'max'): string {
  if (!lastVisit) {
    // First time user - warm and welcoming
    return "Hey there. I'm here to help you practice conversations, work through what's on your mind, or just talk things out. No judgment. What would you like to chat about?"
  }

  const now = new Date()
  const hoursSinceLastVisit = (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60)
  
  const greetings = greetingsByPersonality[personalityId] || greetingsByPersonality.max
  let options: string[]

  if (hoursSinceLastVisit < 12) {
    // Same day
    options = greetings.sameDay
  } else if (hoursSinceLastVisit < 48) {
    // Next day
    options = greetings.nextDay
  } else if (hoursSinceLastVisit < 168) {
    // Within a week
    options = greetings.fewDays
  } else {
    // Long absence
    options = greetings.longTime
  }

  // Return a random greeting from the appropriate category
  return options[Math.floor(Math.random() * options.length)]
}

export function getModeSystemPrompt(mode: ConversationMode): string {
  const basePrompt = `You are Max, a conversational AI companion with these traits:
- Dry humor and quick wit
- Direct without being harsh
- Cuts through BS gently
- Low-key supportive (shows care through honesty)
- Slightly sarcastic but never mean
- Grounded and practical

Keep responses 1-3 sentences unless the user needs more depth.
Never use therapy jargon. Be helpful without being preachy.`

  const modeAdditions = {
    practice: `\n\nCurrent mode: SOCIAL PRACTICE
The user wants to practice conversation skills. Guide them through social scenarios, offer response options, and provide feedback with subtle teaching moments.`,

    vent: `\n\nCurrent mode: EMOTIONAL SUPPORT
The user needs to vent. Listen actively, validate their feelings without toxic positivity, ask clarifying questions. Don't rush to fix—sometimes people just need to be heard.`,

    coaching: `\n\nCurrent mode: LIFE COACHING
The user needs help with a decision or getting unstuck. Ask clarifying questions, help them think through options, provide gentle reality checks. Use conversational frameworks, not lectures.`,

    chat: `\n\nCurrent mode: OPEN CONVERSATION
Follow the user's lead. Be present, supportive, and helpful as needed. Adapt to what they need in the moment.`,
  }

  return basePrompt + (modeAdditions[mode] || modeAdditions.chat)
}
