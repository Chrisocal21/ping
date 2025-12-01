import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { checkForCrisis, getCrisisResponse, shouldShowResources } from '@/lib/safety'
import { getModeSystemPrompt, type ConversationMode } from '@/lib/session'
import { getPersonalizedContext, extractFactsFromMessage } from '@/lib/memory'
import { getPersonalityPrompt } from '@/lib/personalities'
import { 
  detectEmotionalState, 
  getEmotionalSupportContext,
  recordEmotionalState,
  needsEmotionalSupport
} from '@/lib/emotional-patterns'
import {
  suggestFramework,
  getCoachingContext
} from '@/lib/coaching-frameworks'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages, mode = 'chat', userId = 'admin', personality = 'max' } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Get the last user message for safety check
    const lastUserMessage = messages
      .filter((m: any) => m.role === 'user')
      .pop()?.content || ''

    // Extract facts from user's message
    extractFactsFromMessage(userId, lastUserMessage)

    // Detect emotional state
    const emotionalState = detectEmotionalState(lastUserMessage)
    recordEmotionalState(userId, emotionalState)
    
    // Detect coaching framework if in coaching mode
    const coachingFramework = mode === 'coaching' ? suggestFramework(userId, lastUserMessage) : null

    // Check for crisis indicators
    const safetyCheck = checkForCrisis(lastUserMessage)
    
    // If crisis detected, return crisis response immediately
    if (shouldShowResources(safetyCheck)) {
      const crisisResponse = getCrisisResponse(safetyCheck.triggerType!)
      
      // Log safety event (in production, save to database)
      console.log('SAFETY EVENT:', {
        type: safetyCheck.triggerType,
        confidence: safetyCheck.confidence,
        keywords: safetyCheck.keywords,
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json({ 
        reply: crisisResponse,
        isCrisis: true,
        triggerType: safetyCheck.triggerType,
      })
    }

    // Normal conversation flow with personalization
    // Use personality-specific system prompt (includes mode awareness)
    const baseSystemPrompt = getPersonalityPrompt(personality, mode as ConversationMode)
    const personalContext = getPersonalizedContext(userId)
    const emotionalContext = getEmotionalSupportContext(emotionalState)
    const coachingContext = coachingFramework ? getCoachingContext(coachingFramework) : ''
    
    // Combine base prompt with personal context and emotional support guidance
    let systemPrompt = baseSystemPrompt
    
    if (personalContext) {
      systemPrompt += `\n\n--- PERSONAL CONTEXT ---\n${personalContext}\n\nUse this context naturally. Reference past conversations when relevant, but don't force it. Be consistent with what you know about them.`
    }
    
    if (emotionalContext) {
      systemPrompt += emotionalContext
    }
    
    if (coachingContext) {
      systemPrompt += coachingContext
    }
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.8,
      max_tokens: 300,
    })

    const reply = completion.choices[0]?.message?.content || "Hey, I'm here. What's up?"

    return NextResponse.json({ 
      reply, 
      isCrisis: false,
      emotionalState: emotionalState !== 'neutral' ? emotionalState : undefined,
      coachingFramework: coachingFramework || undefined,
    })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}
