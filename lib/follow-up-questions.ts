/**
 * Follow-Up Question Generation
 * 
 * Generates contextual follow-up questions to help users continue conversations naturally.
 * Questions are tailored to conversation mode, detected intent, and personality.
 */

import { ConversationMode } from './session'
import { ConversationIntent } from './intent-classification'

export interface FollowUpQuestion {
  text: string
  category: 'explore' | 'reflect' | 'action' | 'clarify'
}

export interface FollowUpContext {
  mode: ConversationMode
  intent?: ConversationIntent
  personality: string
  lastUserMessage: string
  lastAssistantMessage: string
  emotionalState?: string
  hasFramework?: boolean
}

/**
 * Generates 2-3 contextual follow-up questions based on conversation context
 */
export function generateFollowUpQuestions(
  context: FollowUpContext
): FollowUpQuestion[] {
  const { mode, intent, personality, lastUserMessage, lastAssistantMessage, emotionalState } = context

  // Detect what the conversation is about
  const isAboutFeelings = /\b(feel|feeling|felt|emotion|anxious|worried|stressed|nervous|scared|excited|happy|sad|angry|frustrated)\b/i.test(lastUserMessage + ' ' + lastAssistantMessage)
  const isAboutDecision = /\b(should|decide|choice|option|thinking about|considering|wondering if)\b/i.test(lastUserMessage)
  const isAboutEvent = /\b(interview|meeting|presentation|conversation|date|exam|test|tomorrow|next week)\b/i.test(lastUserMessage)
  const isAboutRelationship = /\b(friend|partner|boss|coworker|family|parent|sibling|relationship|they said|he said|she said)\b/i.test(lastUserMessage)
  const isAboutWork = /\b(job|work|career|interview|boss|colleague|project|meeting|promotion)\b/i.test(lastUserMessage)

  let questions: FollowUpQuestion[] = []

  // Practice mode - Focus on preparation and scenarios
  if (mode === 'practice' || intent === 'practice') {
    if (isAboutEvent) {
      questions = [
        { text: "What part feels most challenging?", category: 'explore' },
        { text: "Want to practice what you'd say?", category: 'action' },
        { text: "What would a great outcome look like?", category: 'reflect' }
      ]
    } else {
      questions = [
        { text: "What specifically do you want to practice?", category: 'clarify' },
        { text: "What's your biggest concern about it?", category: 'explore' },
        { text: "How do you usually handle situations like this?", category: 'reflect' }
      ]
    }
  }
  
  // Vent mode - Focus on feelings and validation
  else if (mode === 'vent' || intent === 'vent') {
    if (isAboutFeelings) {
      questions = [
        { text: "What's the hardest part right now?", category: 'explore' },
        { text: "How long have you been feeling this way?", category: 'clarify' },
        { text: "What would help you feel better?", category: 'action' }
      ]
    } else if (isAboutRelationship) {
      questions = [
        { text: "What did that feel like for you?", category: 'reflect' },
        { text: "Have they done this before?", category: 'clarify' },
        { text: "What do you need from them?", category: 'explore' }
      ]
    } else {
      questions = [
        { text: "Tell me more about what happened", category: 'explore' },
        { text: "How are you feeling about it now?", category: 'reflect' },
        { text: "What's been the worst part?", category: 'clarify' }
      ]
    }
  }
  
  // Coaching mode - Focus on decisions and clarity
  else if (mode === 'coaching' || intent === 'coaching') {
    if (isAboutDecision) {
      questions = [
        { text: "What are the pros and cons you see?", category: 'explore' },
        { text: "What does your gut tell you?", category: 'reflect' },
        { text: "What's the worst that could happen?", category: 'clarify' }
      ]
    } else if (isAboutWork) {
      questions = [
        { text: "What outcome are you hoping for?", category: 'clarify' },
        { text: "What's holding you back?", category: 'explore' },
        { text: "What's one step you could take?", category: 'action' }
      ]
    } else {
      questions = [
        { text: "What's most important to you here?", category: 'reflect' },
        { text: "What have you tried already?", category: 'clarify' },
        { text: "What would success look like?", category: 'explore' }
      ]
    }
  }
  
  // Chat mode - General conversational follow-ups
  else {
    if (isAboutFeelings) {
      questions = [
        { text: "What triggered that feeling?", category: 'explore' },
        { text: "Is this new or familiar?", category: 'clarify' },
        { text: "What helps when you feel this way?", category: 'action' }
      ]
    } else if (isAboutEvent) {
      questions = [
        { text: "How are you preparing?", category: 'explore' },
        { text: "What's your main concern?", category: 'clarify' },
        { text: "Have you done something like this before?", category: 'reflect' }
      ]
    } else {
      questions = [
        { text: "What's on your mind about it?", category: 'explore' },
        { text: "How does that sit with you?", category: 'reflect' },
        { text: "Want to talk through it more?", category: 'action' }
      ]
    }
  }

  // Apply personality adjustments
  questions = adjustQuestionsForPersonality(questions, personality)

  // Return 2-3 questions (prefer 3, but sometimes 2 is better)
  return questions.slice(0, 3)
}

/**
 * Adjusts question phrasing based on personality
 */
function adjustQuestionsForPersonality(
  questions: FollowUpQuestion[],
  personality: string
): FollowUpQuestion[] {
  return questions.map(q => {
    let text = q.text

    switch (personality) {
      case 'max':
        // Max is thoughtful and gentle - keep as is mostly
        // Add warmth to action items
        if (q.category === 'action') {
          text = text.replace('Want to', 'Would it help to')
          text = text.replace('What would help', 'What do you think would help')
        }
        break

      case 'jamie':
        // Jamie is warm and encouraging - add energy
        text = text.replace('Tell me more', 'I want to hear more')
        text = text.replace('What', 'What do you think')
        text = text.replace('How', 'How do you feel')
        text = text.replace(/\?$/, '? 💙')
        break

      case 'sage':
        // Sage is calm and wise - make more reflective
        if (q.category === 'reflect') {
          text = text.replace('What', 'What comes up when you consider')
          text = text.replace('How', 'What do you notice about how')
        }
        text = text.replace('your gut', 'your inner wisdom')
        break

      case 'riley':
        // Riley is direct and practical - make punchier
        text = text.replace('What do you think', 'What')
        text = text.replace('Would it help to', 'Want to')
        text = text.replace('Tell me more about', "What's")
        text = text.replace('How are you feeling', 'How you feeling')
        break
    }

    return { ...q, text }
  })
}

/**
 * Generates follow-up questions specifically for crisis situations
 * (More supportive and safety-focused)
 */
export function generateCrisisFollowUps(personality: string): FollowUpQuestion[] {
  const baseQuestions = [
    { text: "Are you in a safe place right now?", category: 'clarify' as const },
    { text: "Is there someone you can call?", category: 'action' as const },
    { text: "What would help you feel safer?", category: 'explore' as const }
  ]

  return adjustQuestionsForPersonality(baseQuestions, personality)
}

/**
 * Generates follow-up questions when user seems stuck
 * (Helps move conversation forward)
 */
export function generateUnstuckQuestions(
  context: Pick<FollowUpContext, 'mode' | 'personality'>
): FollowUpQuestion[] {
  const { mode, personality } = context

  let questions: FollowUpQuestion[] = []

  if (mode === 'practice') {
    questions = [
      { text: "What scenario would help you most?", category: 'clarify' },
      { text: "What's coming up that you're nervous about?", category: 'explore' },
      { text: "Want to work through something specific?", category: 'action' }
    ]
  } else if (mode === 'vent') {
    questions = [
      { text: "What's been bothering you lately?", category: 'explore' },
      { text: "Anything you need to get off your chest?", category: 'clarify' },
      { text: "What's weighing on you?", category: 'reflect' }
    ]
  } else if (mode === 'coaching') {
    questions = [
      { text: "What decision are you working through?", category: 'clarify' },
      { text: "What do you need clarity on?", category: 'explore' },
      { text: "What's your biggest question right now?", category: 'reflect' }
    ]
  } else {
    questions = [
      { text: "What's been on your mind?", category: 'explore' },
      { text: "What would be helpful to talk about?", category: 'clarify' },
      { text: "What's going on with you?", category: 'reflect' }
    ]
  }

  return adjustQuestionsForPersonality(questions, personality).slice(0, 2)
}

/**
 * Checks if follow-up questions should be generated
 * (Don't generate for very short exchanges or crisis situations)
 */
export function shouldGenerateFollowUps(
  isCrisis: boolean,
  messageCount: number,
  lastUserMessage: string
): boolean {
  // Don't generate for crisis situations (separate handling)
  if (isCrisis) return false

  // Don't generate if conversation just started (less than 2 exchanges)
  if (messageCount < 4) return false

  // Don't generate if user message was very short (they might be thinking)
  if (lastUserMessage.trim().length < 10) return false

  return true
}
