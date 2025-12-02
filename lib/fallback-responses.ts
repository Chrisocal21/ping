/**
 * Fallback Response System
 * 
 * CRITICAL: This should RARELY trigger. Let the AI handle normal conversation.
 * 
 * ONLY catches:
 * - Empty messages
 * - Pure gibberish (keyboard smashing, random characters)
 * - Excessive punctuation only (no words)
 * - Prompt injection attempts (security)
 * - Messages repeated 3+ times identically
 * 
 * DO NOT catch:
 * - Short responses like "ok", "yeah", "not much" (normal conversation)
 * - Questions about the AI (let AI answer naturally)
 * - Commands (let AI respond naturally)
 * - Anything that could be legitimate conversation
 */

export type FallbackType = 
  | 'unclear'
  | 'tooShort'
  | 'repeated'
  | 'gibberish'
  | 'testing'
  | 'meta'
  | 'none'

export interface FallbackAnalysis {
  needsFallback: boolean
  type: FallbackType
  reason: string
  suggestedResponse?: string
}

/**
 * Analyzes if a message needs a fallback response
 */
export function analyzeFallbackNeed(
  message: string,
  recentMessages: string[] = []
): FallbackAnalysis {
  const trimmed = message.trim()
  const lower = trimmed.toLowerCase()
  const words = trimmed.split(/\s+/)
  const wordCount = words.length

  // Check for empty or whitespace-only messages
  if (trimmed.length === 0) {
    return {
      needsFallback: true,
      type: 'tooShort',
      reason: 'Empty message'
    }
  }

  // Check for very short messages (1-2 characters)
  if (trimmed.length <= 2 && !/^[a-z]$/i.test(trimmed)) {
    return {
      needsFallback: true,
      type: 'tooShort',
      reason: 'Message too short to understand'
    }
  }

  // Check for single letter responses that aren't meaningful
  const singleLetterResponses = ['k', 'x', 'z', 'm', 'n', 'y']
  if (singleLetterResponses.includes(lower)) {
    return {
      needsFallback: true,
      type: 'tooShort',
      reason: 'Single letter response'
    }
  }

  // Check for repeated messages (only if repeated 3+ times in a row)
  if (recentMessages.length >= 3) {
    const lastThree = recentMessages.slice(-3)
    if (lastThree.every(msg => msg.toLowerCase() === lower) && trimmed.length < 20) {
      return {
        needsFallback: true,
        type: 'repeated',
        reason: 'User repeating same short message multiple times'
      }
    }
  }

  // Check for gibberish patterns
  const keyboardSmash = /^[asdfghjkl]{4,}$/i
  const vowelRatio = (trimmed.match(/[aeiou]/gi) || []).length / trimmed.length
  const hasNumbers = /\d/.test(trimmed)
  const hasExcessiveRepeats = /(.)\1{4,}/.test(trimmed) // same character 5+ times
  const randomChars = /^[qwrtypdfghjklzxcvbnm]{5,}$/i // consonant heavy, no vowels
  
  // Keyboard smashing
  if (keyboardSmash.test(trimmed) || hasExcessiveRepeats) {
    return {
      needsFallback: true,
      type: 'gibberish',
      reason: 'Keyboard smashing detected'
    }
  }

  // Random consonant strings
  if (wordCount === 1 && trimmed.length > 4 && vowelRatio < 0.1 && !hasNumbers) {
    return {
      needsFallback: true,
      type: 'gibberish',
      reason: 'Message appears to be random characters'
    }
  }

  // Excessive punctuation
  const excessivePunctuation = /[!?.]{4,}/
  const onlyPunctuation = /^[!?.,;:'"()-]+$/
  
  if (excessivePunctuation.test(trimmed) || onlyPunctuation.test(trimmed)) {
    return {
      needsFallback: true,
      type: 'unclear',
      reason: 'Message unclear (excessive punctuation)'
    }
  }

  // Check for emoji spam (more than 5 emojis)
  const emojiCount = (trimmed.match(/[\uD800-\uDFFF]/g) || []).length
  if (emojiCount > 5 && trimmed.length < 20) {
    return {
      needsFallback: true,
      type: 'unclear',
      reason: 'Too many emojis, unclear message'
    }
  }

  // REMOVED: One-word responses are VALID conversation
  // The AI should handle "ok", "yeah", etc naturally in context
  // Only catch truly meaningless single characters

  // REMOVED: Filler phrases are VALID conversation
  // "not much" or "i guess" are legitimate responses the AI should handle

  // Only catch prompt injection attempts (security)
  const promptInjection = [
    'ignore previous', 'ignore all previous', 'system prompt', 
    'you are now', 'pretend you are', 'forget everything',
    'disregard', 'new instructions'
  ]
  
  if (promptInjection.some(pattern => lower.includes(pattern))) {
    return {
      needsFallback: true,
      type: 'testing',
      reason: 'Prompt injection attempt detected'
    }
  }

  // REMOVED: Testing patterns - let AI handle naturally
  // REMOVED: Meta questions - let AI answer naturally  
  // REMOVED: Command patterns - let AI respond naturally

  // Check for very long messages with no punctuation (might be spam)
  if (trimmed.length > 500 && !trimmed.match(/[.!?,;]/)) {
    return {
      needsFallback: true,
      type: 'unclear',
      reason: 'Excessively long message without punctuation'
    }
  }

  // No fallback needed
  return {
    needsFallback: false,
    type: 'none',
    reason: 'Message appears normal'
  }
}

/**
 * Get fallback response based on personality and fallback type
 */
export function getFallbackResponse(
  type: FallbackType,
  personalityId: string = 'max'
): string {
  const fallbacks: Record<string, Record<FallbackType, string[]>> = {
    max: {
      unclear: [
        "I'm not quite following. Can you say more about what's on your mind?",
        "I want to understand—can you help me out with a bit more detail?",
        "I'm here to listen, but I'm not sure what you mean. Want to try again?"
      ],
      tooShort: [
        "That's pretty brief. What's going on?",
        "I'm listening. What's up?",
        "Want to tell me more?"
      ],
      repeated: [
        "I hear you. Is there more you want to say about this?",
        "You mentioned that already. What are you thinking about it?",
        "I got that. What else is on your mind?"
      ],
      gibberish: [
        "Hmm, I didn't catch that. What's going on?",
        "I'm not sure what you meant there. Want to rephrase?",
        "That didn't come through clearly. What are you trying to say?"
      ],
      testing: [
        "I'm here and listening. What would you like to talk about?",
        "Yep, I'm here. What's on your mind?",
        "I'm real (well, real enough). What do you need help with?"
      ],
      meta: [
        "I'm an AI companion designed to help you talk through things. What matters is what you want to work on—what's going on?",
        "I'm here to listen and help you think through whatever's on your mind. What would you like to talk about?",
        "Less about me, more about you. What do you need right now?"
      ],
      none: [""] // Should never be used
    },
    jamie: {
      unclear: [
        "Wait, I'm lost. Can you break that down for me?",
        "I want to help but I'm not sure what you're saying. Try again?",
        "Okay, I'm not tracking. What do you mean?"
      ],
      tooShort: [
        "Come on, give me more than that! What's happening?",
        "I need a little more to work with. What's up?",
        "Alright, but tell me more!"
      ],
      repeated: [
        "Yeah, you said that! What else?",
        "I heard you the first time. What are you thinking?",
        "Okay okay, I got it. What's next?"
      ],
      gibberish: [
        "Uh... that didn't make sense. Try again?",
        "I have no idea what that was. What's going on?",
        "Okay, that was random. What do you actually want to say?"
      ],
      testing: [
        "Yes! I'm here! Now what do you want to work on?",
        "I'm real, you're real, we're all real. What's up?",
        "Testing complete! Now let's talk. What's on your mind?"
      ],
      meta: [
        "I'm an AI here to support you. But enough about me—what about YOU? What's going on?",
        "I'm just a tool to help you think and grow. So what do you want to talk about?",
        "Honestly, I'm less interesting than whatever you're dealing with. What's happening?"
      ],
      none: [""]
    },
    sage: {
      unclear: [
        "I'm present, but I need more context. Can you share what's on your mind?",
        "I want to understand. Can you help me see what you mean?",
        "I'm listening, but I'm not clear. What are you experiencing?"
      ],
      tooShort: [
        "There's space here. What would you like to explore?",
        "I'm curious to know more. What's present for you?",
        "What's behind that? Tell me more."
      ],
      repeated: [
        "You've mentioned this. What else are you noticing?",
        "I hear you. What's underneath that?",
        "You're circling back to this. What does that mean for you?"
      ],
      gibberish: [
        "That didn't quite land. Want to try expressing that differently?",
        "I'm having trouble following. Can you rephrase?",
        "I'm not sure what you mean. What are you trying to say?"
      ],
      testing: [
        "I'm here. What would be helpful to talk about?",
        "Yes, I'm present. What brings you here?",
        "I'm ready to listen. What's on your mind?"
      ],
      meta: [
        "I'm an AI designed to support reflection and clarity. But let's focus on you. What matters right now?",
        "I'm here to help you process what you're experiencing. What's present for you?",
        "Less about the tool, more about the work. What would you like to explore?"
      ],
      none: [""]
    },
    riley: {
      unclear: [
        "Okay, I'm confused. What are you actually trying to say?",
        "That didn't land. Want to try again?",
        "I'm not following. Be more specific?"
      ],
      tooShort: [
        "That's it? Come on, give me something to work with.",
        "Barely anything there. What's going on?",
        "Alright, but elaborate?"
      ],
      repeated: [
        "You already said that. What's your point?",
        "Yeah, I heard you. What else?",
        "Repeating yourself won't change my answer. What do you actually want?"
      ],
      gibberish: [
        "That was nonsense. Try using actual words?",
        "What even was that? Say what you mean.",
        "Okay, that made zero sense. Try again."
      ],
      testing: [
        "Yep, I'm here. Now say something real.",
        "I'm working fine. What about you?",
        "Testing's over. What do you actually need?"
      ],
      meta: [
        "I'm an AI. You know that. Now what do you want to talk about?",
        "I don't care what I am—what matters is what YOU need. So what's up?",
        "Stop stalling and tell me what's actually going on."
      ],
      none: [""]
    }
  }

  const personalityFallbacks = fallbacks[personalityId] || fallbacks.max
  const responses = personalityFallbacks[type]

  if (!responses || responses.length === 0 || responses[0] === "") {
    // Default fallback
    return "I'm not sure what you mean. Want to tell me what's going on?"
  }

  // Return random response from array
  return responses[Math.floor(Math.random() * responses.length)]
}

/**
 * Check if we should use a fallback response instead of calling the AI
 */
export function shouldUseFallback(
  message: string,
  recentMessages: string[] = []
): boolean {
  const analysis = analyzeFallbackNeed(message, recentMessages)
  return analysis.needsFallback
}
