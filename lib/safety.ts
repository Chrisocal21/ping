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
