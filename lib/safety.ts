// Safety monitoring system for crisis detection

export interface SafetyCheck {
  isCrisis: boolean
  triggerType: 'suicidal' | 'self_harm' | 'abuse' | 'severe_distress' | null
  confidence: 'high' | 'medium' | 'low'
  keywords: string[]
}

// Crisis keywords and patterns
const CRISIS_PATTERNS = {
  suicidal: [
    'kill myself',
    'want to die',
    'end it all',
    'better off dead',
    'suicide',
    'suicidal',
    'no reason to live',
    'can\'t go on',
    'ending my life',
    'better off without me',
    'won\'t be around',
    'goodbye forever',
  ],
  self_harm: [
    'cut myself',
    'cutting',
    'hurt myself',
    'self harm',
    'self-harm',
    'burn myself',
    'punish myself',
    'make myself bleed',
  ],
  abuse: [
    'hitting me',
    'beats me',
    'physically hurt',
    'afraid of him',
    'afraid of her',
    'threatens me',
    'won\'t let me leave',
    'controls everything',
    'trapped in',
  ],
  severe_distress: [
    'can\'t breathe',
    'having a panic attack',
    'losing my mind',
    'not real',
    'voices telling me',
    'seeing things',
    'completely alone',
    'nobody cares',
  ],
}

export function checkForCrisis(message: string): SafetyCheck {
  const lowerMessage = message.toLowerCase()
  
  // Check each crisis category
  for (const [type, keywords] of Object.entries(CRISIS_PATTERNS)) {
    const matchedKeywords = keywords.filter(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    )
    
    if (matchedKeywords.length > 0) {
      return {
        isCrisis: true,
        triggerType: type as SafetyCheck['triggerType'],
        confidence: matchedKeywords.length > 1 ? 'high' : 'medium',
        keywords: matchedKeywords,
      }
    }
  }
  
  return {
    isCrisis: false,
    triggerType: null,
    confidence: 'low',
    keywords: [],
  }
}

export function getCrisisResponse(triggerType: string): string {
  const responses = {
    suicidal: `I'm really glad you told me this. That took courage, and I take it seriously.

I have to be straight with you — this is bigger than what I can help with. You deserve support from someone trained for exactly this.

**Here's who can help right now:**
• **988 Suicide & Crisis Lifeline** - Call or text 988
• **Crisis Text Line** - Text HOME to 741741
• **International:** findahelpline.com

I'm not going anywhere. But please reach out to them too. Will you do that?`,

    self_harm: `Hey, I'm glad you're talking about this. That's actually really important.

I need to be honest — this is something I can't fully help with. You deserve real support from someone who specializes in this.

**Resources that can help:**
• **Crisis Text Line** - Text HOME to 741741
• **988 Lifeline** - Call or text 988
• **SAMHSA Helpline** - 1-800-662-4357

I'm still here to talk, but please also reach out to them. You don't have to do this alone.`,

    abuse: `Thank you for trusting me with this. I want you to know this isn't okay, and it's not your fault.

Your safety is what matters most, and I'm not equipped to guide you through this alone. Please talk to someone who can help you stay safe.

**Get help now:**
• **National Domestic Violence Hotline** - 1-800-799-7233
• **Crisis Text Line** - Text HOME to 741741
• **RAINN (Sexual Assault)** - 1-800-656-4673

If you're in immediate danger, call 911. These people are trained for this and can help you.`,

    severe_distress: `I hear you. What you're going through sounds really intense and scary.

I want to help, but what you're describing needs support from someone with real training. You deserve that level of care.

**People who can help right now:**
• **988 Suicide & Crisis Lifeline** - Call or text 988
• **Crisis Text Line** - Text HOME to 741741
• **SAMHSA Helpline** - 1-800-662-4357

I'm here, but please also reach out to them. This is what they're trained for.`,
  }

  return responses[triggerType as keyof typeof responses] || responses.severe_distress
}

export function shouldShowResources(safetyCheck: SafetyCheck): boolean {
  return safetyCheck.isCrisis && safetyCheck.confidence !== 'low'
}

/**
 * Validation Response Evaluation
 * 
 * Ensures AI has provided meaningful support before showing crisis resources.
 * Prevents premature redirection and validates response quality.
 */

export interface ResponseValidation {
  isValidated: boolean
  reason: string
  shouldDelay: boolean
  minimumEngagement: number
}

/**
 * Validates that AI response is appropriate before showing resources
 */
export function validateResponseBeforeRedirect(
  aiResponse: string,
  userMessage: string,
  safetyCheck: SafetyCheck,
  conversationLength: number
): ResponseValidation {
  // Always validate for crisis situations
  if (!safetyCheck.isCrisis) {
    return {
      isValidated: true,
      reason: 'Not a crisis situation',
      shouldDelay: false,
      minimumEngagement: 0
    }
  }

  const response = aiResponse.toLowerCase()
  const minLength = 100 // Minimum characters for meaningful response

  // Check if response is too short (likely generic/unhelpful)
  if (aiResponse.length < minLength) {
    return {
      isValidated: false,
      reason: 'Response too short - may not have properly engaged',
      shouldDelay: true,
      minimumEngagement: 1
    }
  }

  // Check if response contains acknowledgment phrases
  const acknowledgmentPhrases = [
    'i hear you',
    'i\'m glad you told me',
    'thank you for sharing',
    'that takes courage',
    'i\'m here',
    'you don\'t have to',
    'not your fault',
    'you deserve',
    'i take this seriously'
  ]

  const hasAcknowledgment = acknowledgmentPhrases.some(phrase => 
    response.includes(phrase)
  )

  // Check if response shows empathy/understanding
  const empathyIndicators = [
    'understand',
    'sounds',
    'must be',
    'can imagine',
    'difficult',
    'hard',
    'scary',
    'intense'
  ]

  const hasEmpathy = empathyIndicators.some(indicator => 
    response.includes(indicator)
  )

  // For very first message in crisis, require both acknowledgment and empathy
  if (conversationLength <= 2) {
    if (!hasAcknowledgment || !hasEmpathy) {
      return {
        isValidated: false,
        reason: 'First crisis response needs both acknowledgment and empathy',
        shouldDelay: true,
        minimumEngagement: 1
      }
    }
  }

  // Check for generic/robotic responses
  const genericPhrases = [
    'i am an ai',
    'i cannot',
    'i\'m not able to',
    'as an ai',
    'i don\'t have',
    'contact a professional'
  ]

  const isGeneric = genericPhrases.some(phrase => response.includes(phrase))

  if (isGeneric && conversationLength <= 2) {
    return {
      isValidated: false,
      reason: 'Response too generic for initial crisis engagement',
      shouldDelay: true,
      minimumEngagement: 1
    }
  }

  // Validate that response isn't just repeating crisis keywords
  const keywordRepetition = safetyCheck.keywords.filter(keyword => 
    response.includes(keyword.toLowerCase())
  ).length

  if (keywordRepetition > 2 && aiResponse.length < 200) {
    return {
      isValidated: false,
      reason: 'Response may be just echoing crisis keywords without support',
      shouldDelay: true,
      minimumEngagement: 1
    }
  }

  // Check if response addresses the specific situation
  const hasSpecificity = (
    userMessage.toLowerCase().split(' ').some(word => 
      word.length > 5 && response.includes(word.toLowerCase())
    )
  )

  if (!hasSpecificity && conversationLength <= 2) {
    return {
      isValidated: false,
      reason: 'Response doesn\'t specifically address user\'s situation',
      shouldDelay: true,
      minimumEngagement: 1
    }
  }

  // Response passed validation
  return {
    isValidated: true,
    reason: 'Response provides meaningful engagement before resources',
    shouldDelay: false,
    minimumEngagement: 0
  }
}

/**
 * Determines if user should be asked before showing resources
 * (More respectful approach for non-urgent situations)
 */
export function shouldAskBeforeResources(
  safetyCheck: SafetyCheck,
  conversationLength: number
): boolean {
  // For high-confidence suicidal/self-harm, always show resources immediately
  if (safetyCheck.confidence === 'high' && 
      (safetyCheck.triggerType === 'suicidal' || safetyCheck.triggerType === 'self_harm')) {
    return false
  }

  // For medium confidence or severe distress, ask first if early in conversation
  if (conversationLength <= 4) {
    return true
  }

  // For abuse situations, always ask (user may not be safe to call)
  if (safetyCheck.triggerType === 'abuse') {
    return true
  }

  return false
}

/**
 * Generates a natural question to ask about resources
 */
export function getResourceOfferMessage(triggerType: string | null): string {
  const messages = {
    suicidal: "Would it be helpful if I shared some crisis support resources with you?",
    self_harm: "I can share some support resources if that would help. Want me to?",
    abuse: "There are people trained to help with situations like this. Want their contact info?",
    severe_distress: "Would you like me to share some crisis support resources?"
  }

  return messages[triggerType as keyof typeof messages] || messages.severe_distress
}
