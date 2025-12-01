// Coaching frameworks for decision-making and problem-solving conversations

export type CoachingFramework = 
  | 'decision-making'
  | 'pros-cons'
  | 'values-alignment'
  | 'worst-case-best-case'
  | 'five-whys'
  | 'outcome-visualization'
  | 'boundary-setting'
  | 'goal-clarification'
  | 'obstacle-identification'
  | 'action-planning'
  | 'perspective-shift'
  | 'gut-check'
  | 'priority-matrix'
  | 'energy-audit'
  | 'fear-vs-intuition'
  | 'reverse-engineer'
  | 'trial-period'
  | 'advice-to-friend'
  | 'values-test'
  | 'regret-minimization'

export interface CoachingFrameworkTemplate {
  name: string
  description: string
  triggers: string[] // When to use this framework
  steps: string[] // Guiding questions/prompts
  outcome: string // What this helps achieve
  exampleUse: string
}

export const coachingFrameworks: Record<CoachingFramework, CoachingFrameworkTemplate> = {
  'decision-making': {
    name: 'Decision Framework',
    description: 'Structured approach to making unclear decisions',
    triggers: ['should i', 'deciding between', 'can\'t decide', 'which option', 'make a choice'],
    steps: [
      'What are you actually deciding between? Let\'s name the options.',
      'What matters most to you in this decision?',
      'What would each option look like in practice?',
      'Which option feels more aligned with where you want to be?',
      'What\'s making this decision hard?',
    ],
    outcome: 'Clarity on the real decision and what matters most',
    exampleUse: 'User is torn between two job offers or life paths',
  },
  
  'pros-cons': {
    name: 'Pros and Cons Analysis',
    description: 'Classic comparison framework with nuance',
    triggers: ['advantages', 'disadvantages', 'weighing options', 'compare'],
    steps: [
      'Let\'s list the upsides of Option A. What draws you to it?',
      'Now the downsides of Option A. What concerns you?',
      'Same for Option B - what are the upsides?',
      'And the downsides of Option B?',
      'Looking at all of this, which factors matter most to you?',
      'Are any of these pros or cons deal-breakers?',
    ],
    outcome: 'Visual comparison of tradeoffs',
    exampleUse: 'Comparing concrete options with clear differences',
  },
  
  'values-alignment': {
    name: 'Values Check',
    description: 'Test decisions against core values',
    triggers: ['feels wrong', 'not sure why', 'something\'s off', 'doesn\'t sit right'],
    steps: [
      'What do you value most? (authenticity, security, growth, connection, etc.)',
      'Which option honors those values more?',
      'What would you be compromising by choosing each option?',
      'Can you live with that compromise?',
      'Which choice would you respect yourself for?',
    ],
    outcome: 'Decision aligned with personal values',
    exampleUse: 'When the "logical" choice feels wrong emotionally',
  },
  
  'worst-case-best-case': {
    name: 'Worst/Best Case Scenario',
    description: 'Explore the range of possible outcomes',
    triggers: ['what if', 'scared', 'risky', 'might fail', 'could go wrong'],
    steps: [
      'What\'s the absolute worst that could happen?',
      'Could you survive that worst case? What would you do?',
      'What\'s the best case scenario?',
      'What\'s the most likely scenario - realistically?',
      'Which risk are you more willing to live with?',
    ],
    outcome: 'Reality check on fears and realistic outcomes',
    exampleUse: 'User is catastrophizing or avoiding due to fear',
  },
  
  'five-whys': {
    name: 'Five Whys',
    description: 'Dig deeper to find the root issue',
    triggers: ['don\'t know why', 'keep doing this', 'always', 'pattern'],
    steps: [
      'Why is this bothering you?',
      'And why does that matter?',
      'Why is that important to you?',
      'What\'s underneath that?',
      'So at the core, this is really about...?',
    ],
    outcome: 'Uncover the real issue beneath the surface',
    exampleUse: 'User is stuck in a pattern or can\'t articulate the problem',
  },
  
  'outcome-visualization': {
    name: 'Future Self Check',
    description: 'Project into the future to gain perspective',
    triggers: ['future', 'long term', 'years from now', 'will i regret'],
    steps: [
      'Imagine it\'s a year from now. You chose Option A. How do you feel?',
      'What\'s your day-to-day life like with that choice?',
      'Now imagine you chose Option B instead. How does that feel?',
      'What\'s different in your daily life?',
      'Which version of your future self seems happier?',
    ],
    outcome: 'Emotional clarity from future perspective',
    exampleUse: 'Short-term vs. long-term decision tension',
  },
  
  'boundary-setting': {
    name: 'Boundary Framework',
    description: 'Identify and set healthy boundaries',
    triggers: ['taken advantage', 'can\'t say no', 'using me', 'disrespected', 'crossed a line'],
    steps: [
      'What boundary was crossed here?',
      'What do you need instead?',
      'What would a healthy boundary look like?',
      'What makes it hard to set that boundary?',
      'What would you say if you weren\'t afraid?',
      'What\'s a small first step toward that boundary?',
    ],
    outcome: 'Clear boundary identified and plan to communicate it',
    exampleUse: 'User is being taken advantage of or disrespected',
  },
  
  'goal-clarification': {
    name: 'Goal Clarity',
    description: 'Define what success actually looks like',
    triggers: ['want to', 'trying to', 'goal', 'achieve', 'accomplish'],
    steps: [
      'What do you want to accomplish?',
      'Why do you want this?',
      'What would success look like specifically?',
      'How will you know when you\'ve achieved it?',
      'What\'s the smallest version of this goal?',
    ],
    outcome: 'Specific, achievable goal definition',
    exampleUse: 'Vague aspirations need to become concrete goals',
  },
  
  'obstacle-identification': {
    name: 'Obstacle Mapping',
    description: 'Name what\'s actually in the way',
    triggers: ['stuck', 'can\'t', 'blocked', 'not working', 'hitting a wall'],
    steps: [
      'What\'s stopping you?',
      'Is that obstacle real or assumed?',
      'What would you need to overcome that?',
      'What\'s within your control here?',
      'What\'s one small way around this obstacle?',
    ],
    outcome: 'Clear picture of what\'s blocking progress',
    exampleUse: 'User feels stuck but can\'t articulate why',
  },
  
  'action-planning': {
    name: 'Next Steps',
    description: 'Turn decisions into concrete actions',
    triggers: ['now what', 'what should i do', 'next steps', 'how do i'],
    steps: [
      'What\'s the very first small step?',
      'When specifically will you do that?',
      'What might get in the way?',
      'How will you handle that obstacle?',
      'Who can support you in this?',
    ],
    outcome: 'Concrete action plan with timing',
    exampleUse: 'Decision is made but user needs to act',
  },
  
  'perspective-shift': {
    name: 'Perspective Reframe',
    description: 'Look at situation from different angles',
    triggers: ['only way', 'no choice', 'have to', 'stuck with'],
    steps: [
      'How would your best friend see this situation?',
      'What would you tell someone else in this exact situation?',
      'What\'s another way to look at this?',
      'What are you assuming that might not be true?',
      'What would change if you questioned that assumption?',
    ],
    outcome: 'New perspective on a stuck situation',
    exampleUse: 'User has tunnel vision or fixed mindset',
  },
  
  'gut-check': {
    name: 'Intuition Check',
    description: 'Tune into what your gut is saying',
    triggers: ['feel like', 'gut says', 'something tells me', 'instinct'],
    steps: [
      'What is your gut telling you?',
      'When you imagine choosing Option A, what do you feel in your body?',
      'What about Option B - what sensations come up?',
      'Which option makes you feel more expansive vs. contracted?',
      'If you had to decide right now based only on feeling, what would you choose?',
    ],
    outcome: 'Connection to intuitive knowing',
    exampleUse: 'Overthinking has drowned out intuition',
  },
  
  'priority-matrix': {
    name: 'Priority Sort',
    description: 'Organize competing demands',
    triggers: ['too much', 'everything', 'all at once', 'competing priorities'],
    steps: [
      'Let\'s list everything competing for your attention.',
      'Which of these is urgent AND important?',
      'Which is important but not urgent?',
      'Which feels urgent but isn\'t actually important?',
      'What can you let go of completely?',
    ],
    outcome: 'Clear priority order and permission to drop things',
    exampleUse: 'User is overwhelmed with competing demands',
  },
  
  'energy-audit': {
    name: 'Energy Check',
    description: 'Evaluate what gives vs. drains energy',
    triggers: ['exhausted', 'drained', 'burned out', 'no energy'],
    steps: [
      'What in your life gives you energy?',
      'What drains your energy?',
      'How much of your time goes to draining vs. energizing things?',
      'What\'s one draining thing you could reduce or eliminate?',
      'What\'s one energizing thing you could do more of?',
    ],
    outcome: 'Awareness of energy balance and adjustments needed',
    exampleUse: 'User is burned out or depleted',
  },
  
  'fear-vs-intuition': {
    name: 'Fear vs. Intuition',
    description: 'Distinguish between fear and wisdom',
    triggers: ['scared but', 'fear', 'nervous', 'hesitant'],
    steps: [
      'What are you afraid of?',
      'Is that fear protecting you from real danger, or just discomfort?',
      'What would you do if you weren\'t afraid?',
      'Does that feel reckless, or does it feel right?',
      'What\'s the difference between your fear talking and your intuition?',
    ],
    outcome: 'Clarity on whether to listen to or challenge the fear',
    exampleUse: 'Fear is blocking a decision',
  },
  
  'reverse-engineer': {
    name: 'Work Backwards',
    description: 'Start from the end goal and work back',
    triggers: ['how do i get to', 'achieve', 'become', 'end up'],
    steps: [
      'Where do you want to end up?',
      'What would have to be true right before that happens?',
      'And what would need to happen before that?',
      'Keep going - what\'s the step before that?',
      'So the first step is actually...?',
    ],
    outcome: 'Clear path from current state to goal',
    exampleUse: 'Goal feels overwhelming or far away',
  },
  
  'trial-period': {
    name: 'Trial Period',
    description: 'Test before committing',
    triggers: ['permanent', 'forever', 'irreversible', 'can\'t go back'],
    steps: [
      'What if this wasn\'t permanent?',
      'Could you try this for a set period of time?',
      'What would a 30-day experiment look like?',
      'How would you know if it\'s working or not?',
      'What would make you reverse course?',
    ],
    outcome: 'Lower-stakes way to test the decision',
    exampleUse: 'Decision feels too big or irreversible',
  },
  
  'advice-to-friend': {
    name: 'Friend Advice Test',
    description: 'What would you tell someone you love?',
    triggers: ['friend', 'someone else', 'other people'],
    steps: [
      'If your best friend came to you with this exact situation, what would you tell them?',
      'Why is it easier to see clearly for them than for yourself?',
      'What would you want for them?',
      'Can you offer yourself that same compassion?',
      'So what does that advice look like applied to you?',
    ],
    outcome: 'Self-compassion and clearer perspective',
    exampleUse: 'User is being too hard on themselves',
  },
  
  'values-test': {
    name: 'Values Stress Test',
    description: 'Test which values are non-negotiable',
    triggers: ['compromise', 'give up', 'sacrifice'],
    steps: [
      'What would you be giving up with this choice?',
      'Can you live without that?',
      'What\'s non-negotiable for you?',
      'If you had to choose between [value A] and [value B], which wins?',
      'Where\'s your actual line in the sand?',
    ],
    outcome: 'Clarity on non-negotiable values',
    exampleUse: 'User is considering compromising too much',
  },
  
  'regret-minimization': {
    name: 'Regret Minimization',
    description: 'Choose based on future regret',
    triggers: ['regret', 'wish i had', 'looking back'],
    steps: [
      'Imagine you\'re 80 years old looking back at this moment.',
      'If you choose Option A, will you regret it?',
      'What about Option B - will you regret that?',
      'Which regret would be harder to live with?',
      'What would your 80-year-old self want you to do?',
    ],
    outcome: 'Long-term perspective on decisions',
    exampleUse: 'Short-term comfort vs. long-term growth',
  },
}

// Detect which framework would be most helpful
export function detectCoachingFramework(message: string): CoachingFramework | null {
  const lowerMessage = message.toLowerCase()
  
  // Check each framework's triggers
  for (const [framework, template] of Object.entries(coachingFrameworks)) {
    const matchCount = template.triggers.filter(trigger => 
      lowerMessage.includes(trigger)
    ).length
    
    if (matchCount > 0) {
      return framework as CoachingFramework
    }
  }
  
  // Default frameworks based on common patterns
  if (lowerMessage.includes('should i') || lowerMessage.includes('deciding')) {
    return 'decision-making'
  }
  if (lowerMessage.includes('overwhelmed') || lowerMessage.includes('too much')) {
    return 'priority-matrix'
  }
  if (lowerMessage.includes('stuck') || lowerMessage.includes('don\'t know')) {
    return 'five-whys'
  }
  
  return null
}

// Get coaching guidance for AI prompt
export function getCoachingContext(framework: CoachingFramework | null): string {
  if (!framework) return ''
  
  const template = coachingFrameworks[framework]
  
  let context = `\n\nCOACHING FRAMEWORK: ${template.name}\n`
  context += `Goal: ${template.outcome}\n\n`
  context += `GUIDING QUESTIONS (use these to structure the conversation):\n`
  
  template.steps.forEach((step, index) => {
    context += `${index + 1}. ${step}\n`
  })
  
  context += `\nDon't ask all questions at once. Start with the first one, then follow their answer. Guide them through the framework naturally.`
  
  return context
}

// Get next coaching question based on conversation progress
export function getNextCoachingStep(
  framework: CoachingFramework,
  currentStep: number
): string {
  const template = coachingFrameworks[framework]
  
  if (currentStep >= template.steps.length) {
    return 'So what are you thinking now?'
  }
  
  return template.steps[currentStep]
}

// Track which frameworks user responds well to
export function recordFrameworkUse(userId: string, framework: CoachingFramework, helpful: boolean): void {
  if (typeof window === 'undefined') return
  
  const key = `ping_frameworks_${userId}`
  const stored = localStorage.getItem(key)
  let frameworks: { framework: CoachingFramework; helpful: boolean; timestamp: string }[] = []
  
  if (stored) {
    try {
      frameworks = JSON.parse(stored)
    } catch {
      frameworks = []
    }
  }
  
  frameworks.push({
    framework,
    helpful,
    timestamp: new Date().toISOString(),
  })
  
  // Keep last 30 uses
  if (frameworks.length > 30) {
    frameworks = frameworks.slice(-30)
  }
  
  localStorage.setItem(key, JSON.stringify(frameworks))
}

// Get user's preferred frameworks
export function getPreferredFrameworks(userId: string): CoachingFramework[] {
  if (typeof window === 'undefined') return []
  
  const key = `ping_frameworks_${userId}`
  const stored = localStorage.getItem(key)
  
  if (!stored) return []
  
  try {
    const frameworks: { framework: CoachingFramework; helpful: boolean }[] = JSON.parse(stored)
    
    // Count helpful uses
    const counts: Record<string, number> = {}
    frameworks.forEach(f => {
      if (f.helpful) {
        counts[f.framework] = (counts[f.framework] || 0) + 1
      }
    })
    
    // Return top 3
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([framework]) => framework as CoachingFramework)
  } catch {
    return []
  }
}

// Suggest framework based on user history and current message
export function suggestFramework(userId: string, message: string): CoachingFramework | null {
  // First check preferred frameworks
  const preferred = getPreferredFrameworks(userId)
  const detected = detectCoachingFramework(message)
  
  // If detected framework is in their preferred list, use it
  if (detected && preferred.includes(detected)) {
    return detected
  }
  
  // Otherwise use detected framework
  return detected
}
