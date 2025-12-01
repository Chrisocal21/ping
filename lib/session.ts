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

export function getWelcomeMessage(lastVisit: Date | null): string {
  if (!lastVisit) {
    // First time user
    return "Hey. I'm Max. I'm here when you want to practice talking to humans, need to vent, or just want help figuring something out. No judgment, no therapy-speak, no weird positivity. What's on your mind?"
  }

  const now = new Date()
  const hoursSinceLastVisit = (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60)

  if (hoursSinceLastVisit < 12) {
    // Same day
    return "Back already? I respect the hustle. What's up?"
  } else if (hoursSinceLastVisit < 48) {
    // Next day
    return "Hey. New day, new chaos. What's on your mind?"
  } else if (hoursSinceLastVisit < 168) {
    // Within a week
    return "Hey, been a minute. No guilt — I'm not tracking attendance. What's going on?"
  } else {
    // Long absence
    return "Well look who's back. Missed you. Genuinely. What's happening in your world?"
  }
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
