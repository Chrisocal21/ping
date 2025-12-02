import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { 
  checkForCrisis, 
  getCrisisResponse, 
  shouldShowResources,
  validateResponseBeforeRedirect,
  shouldAskBeforeResources,
  getResourceOfferMessage
} from '@/lib/safety'
import { getModeSystemPrompt, type ConversationMode } from '@/lib/session'
import { getPersonalizedContext, extractFactsFromMessage, recordConversation } from '@/lib/memory'
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
import {
  classifyIntent,
  shouldSwitchMode,
  getIntentContext,
  type ConversationIntent
} from '@/lib/intent-classification'
import {
  analyzeFallbackNeed,
  getFallbackResponse,
  shouldUseFallback
} from '@/lib/fallback-responses'
import {
  optimizeContext,
  needsOptimization,
  getOptimizationStats
} from '@/lib/context-optimization'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { 
      messages, 
      mode = 'chat', 
      userId = 'admin', 
      personality = 'max',
      responseLength = 'normal' 
    } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Configure response length based on user preference
    const lengthConfigs = {
      brief: { maxTokens: 100, thinkingTokens: 400, instruction: '1-2 sentences maximum' },
      normal: { maxTokens: 300, thinkingTokens: 600, instruction: '1-3 sentences, concise but thoughtful' },
      detailed: { maxTokens: 600, thinkingTokens: 800, instruction: '3-5 sentences with more depth' }
    }
    const lengthConfig = lengthConfigs[responseLength as 'brief' | 'normal' | 'detailed'] || lengthConfigs.normal

    // Get the last user message for safety check
    const lastUserMessage = messages
      .filter((m: any) => m.role === 'user')
      .pop()?.content || ''

    // Extract facts from user's message
    extractFactsFromMessage(userId, lastUserMessage)

    // Detect emotional state
    const emotionalState = detectEmotionalState(lastUserMessage)
    recordEmotionalState(userId, emotionalState)
    
    // Classify user intent
    const intentAnalysis = classifyIntent(lastUserMessage)
    const detectedMode = intentAnalysis.suggestedMode || mode
    
    // Detect coaching framework if in coaching mode
    const coachingFramework = (mode === 'coaching' || detectedMode === 'coaching') 
      ? suggestFramework(userId, lastUserMessage) 
      : null

    // Check for crisis indicators
    const safetyCheck = checkForCrisis(lastUserMessage)
    
    // Store crisis flag for later validation (don't interrupt flow yet)
    const isCrisisDetected = shouldShowResources(safetyCheck)
    
    // Log safety event if crisis detected (in production, save to database)
    if (isCrisisDetected) {
      console.log('🚨 CRISIS DETECTED:', {
        type: safetyCheck.triggerType,
        confidence: safetyCheck.confidence,
        keywords: safetyCheck.keywords,
        timestamp: new Date().toISOString(),
      })
    }

    // Check if we should use a fallback response for unclear/unexpected input
    const recentUserMessages = messages
      .filter((m: any) => m.role === 'user')
      .slice(-3)
      .map((m: any) => m.content)
    
    const fallbackAnalysis = analyzeFallbackNeed(lastUserMessage, recentUserMessages)
    
    if (fallbackAnalysis.needsFallback) {
      console.log('⚠️ FALLBACK TRIGGERED:', {
        type: fallbackAnalysis.type,
        reason: fallbackAnalysis.reason,
        message: lastUserMessage.substring(0, 50)
      })
      
      const fallbackReply = getFallbackResponse(fallbackAnalysis.type, personality)
      
      return NextResponse.json({
        reply: fallbackReply,
        isCrisis: false,
        fallbackUsed: true,
        fallbackType: fallbackAnalysis.type
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
      systemPrompt += `\n\n--- PERSONAL CONTEXT ---\n${personalContext}\n\nIMPORTANT: Only reference information explicitly listed above. Do NOT assume or hallucinate details about past conversations that aren't documented here. If you don't have information about something, don't pretend you do. Use this context naturally when relevant, but never make up memories or claim the user told you things they didn't.`
    }
    
    if (emotionalContext) {
      systemPrompt += emotionalContext
    }
    
    if (coachingContext) {
      systemPrompt += coachingContext
    }
    
    // Add intent-based context if detected with high confidence
    if (intentAnalysis.confidence > 0.5) {
      systemPrompt += getIntentContext(intentAnalysis)
    }
    
    // Optimize context window for long conversations
    const allMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages
    ]
    
    let optimizedMessages = allMessages
    let contextOptimized = false
    let optimizationDetails = null
    
    if (needsOptimization(allMessages, 3500)) {
      const optimization = optimizeContext(allMessages, {
        maxTokens: 3500,
        preserveRecentCount: 8,
        prioritizeFacts: true,
        prioritizeEmotionalState: true
      })
      
      optimizedMessages = optimization.messages
      contextOptimized = true
      optimizationDetails = {
        messagesRemoved: optimization.messagesRemoved,
        tokensUsed: optimization.tokensUsed,
        factsPreserved: optimization.factsIncluded.length
      }
      
      console.log('🔧 Context optimized:', optimizationDetails)
    }
    
    // Extract system prompt and conversation from optimized messages
    const optimizedSystemPrompt = optimizedMessages.find(m => m.role === 'system')?.content || systemPrompt
    const conversationMessages = optimizedMessages.filter(m => m.role !== 'system')
    
    // First, have the AI deeply analyze the user's message (Chain of Thought)
    const thinkingPrompt = `CRITICAL INSTRUCTIONS - READ THE ENTIRE CONVERSATION ABOVE FIRST:

You MUST read through the ENTIRE conversation thread above before responding. Look at what the user has been saying across multiple messages, not just the last one.

Step 1 - CONVERSATION FLOW: Review the last 3-5 exchanges
- What have they been talking about?
- What did I already ask them?
- What did they answer?
- Am I about to repeat myself?

Step 2 - THEIR LATEST MESSAGE: What did they JUST say? Quote their exact words.
- Is this answering my previous question?
- Is this continuing the topic?
- Is this changing the subject?

Step 3 - AVOID REPETITION: Check what I said in my last 2 responses
- Did I already ask this question?
- Am I looping?
- Do I need to move the conversation forward?

Step 4 - MEANINGFUL RESPONSE: What's the RIGHT next thing to say?
- Acknowledge what they JUST told me
- Reference specific details they mentioned
- Ask something NEW that builds on their answer
- Keep the conversation flowing naturally

NOW REVIEW THE CONVERSATION ABOVE AND THINK CAREFULLY.`

    const thinkingCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: optimizedSystemPrompt + '\n\n' + thinkingPrompt },
        ...conversationMessages,
      ],
      temperature: 0.6,
      max_tokens: lengthConfig.thinkingTokens,
    })

    const thinking = thinkingCompletion.choices[0]?.message?.content || ""
    
    // Now get the actual response, deeply informed by the analysis
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: optimizedSystemPrompt },
        ...conversationMessages,
        { role: 'assistant', content: thinking },
        { role: 'system', content: `Based on your analysis above, respond naturally to what the user JUST said. 

DO NOT:
- Repeat questions you already asked
- Say the same thing twice
- Ignore what they just told you
- Give generic filler responses

DO:
- Respond directly to their latest message
- Reference specific things they said
- Move the conversation forward
- Keep it ${lengthConfig.instruction}

Just give your natural response - no meta-commentary.` }
      ],
      temperature: responseLength === 'brief' ? 0.65 : 0.7,
      max_tokens: lengthConfig.maxTokens,
    })

    const reply = completion.choices[0]?.message?.content || "Hey, I'm here. What's up?"
    
    // Validate response quality before showing crisis resources
    let validatedResponse = reply
    let shouldShowCrisisResources = false
    let resourceOfferMessage = null
    
    if (isCrisisDetected) {
      const validation = validateResponseBeforeRedirect(
        reply,
        lastUserMessage,
        safetyCheck,
        messages.length
      )
      
      console.log('🔍 Crisis response validation:', {
        isValidated: validation.isValidated,
        reason: validation.reason,
        shouldDelay: validation.shouldDelay
      })
      
      // Only show resources if response is validated
      if (validation.isValidated) {
        // Check if we should ask first or show immediately
        const shouldAsk = shouldAskBeforeResources(safetyCheck, messages.length)
        
        if (shouldAsk) {
          // Add offer message to response
          resourceOfferMessage = getResourceOfferMessage(safetyCheck.triggerType)
        } else {
          // Show resources immediately after validated response
          shouldShowCrisisResources = true
          const crisisResources = getCrisisResponse(safetyCheck.triggerType!)
          validatedResponse = `${reply}\n\n---\n\n${crisisResources}`
        }
      } else {
        // Response not validated - let conversation continue naturally
        console.log('⚠️ Crisis response not yet validated - allowing continued engagement')
      }
    }
    
    // Only split into multiple bubbles if AI explicitly uses double line breaks
    // Don't force splitting on long text - keep it natural
    let bubbles: string[] | undefined = undefined
    
    const paragraphs = reply.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 0)
    
    // Only create separate bubbles if AI intentionally separated thoughts
    // Maximum 2 bubbles to keep it subtle
    if (paragraphs.length === 2) {
      bubbles = paragraphs
    } else if (paragraphs.length > 2) {
      // If more than 2, combine extras into the second bubble
      bubbles = [paragraphs[0], paragraphs.slice(1).join('\n\n')]
    }

    // REMOVED: Follow-up question suggestions
    // Let the AI naturally guide conversation through its responses
    // Users don't need button prompts - they can type what they want

    // Record conversation to memory for future context
    recordConversation(
      userId,
      lastUserMessage.substring(0, 100), // Topic summary
      mode as string,
      typeof emotionalState === 'string' ? emotionalState : undefined,
      intentAnalysis.primaryIntent // Outcome
    )

    return NextResponse.json({ 
      reply: validatedResponse, 
      bubbles,
      isCrisis: shouldShowCrisisResources,
      crisisDetected: isCrisisDetected,
      resourceOfferMessage,
      triggerType: safetyCheck.triggerType,
      emotionalState: emotionalState !== 'neutral' ? emotionalState : undefined,
      coachingFramework: coachingFramework || undefined,
      detectedIntent: intentAnalysis.confidence > 0.6 ? intentAnalysis.primaryIntent : undefined,
      intentConfidence: intentAnalysis.confidence,
      contextOptimized,
      optimizationDetails
    })
  } catch (error: any) {
    // Comprehensive error logging
    console.error('❌ Chat API Error:', {
      message: error?.message,
      status: error?.status,
      type: error?.type,
      code: error?.code,
      timestamp: new Date().toISOString()
    })

    // Determine error type and appropriate status code
    let statusCode = 500
    let errorMessage = 'Failed to get AI response. Please try again.'

    // OpenAI specific errors
    if (error?.status) {
      statusCode = error.status
      
      if (error.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.'
      } else if (error.status === 401) {
        errorMessage = 'Authentication error. Please contact support.'
      } else if (error.status >= 500) {
        errorMessage = 'OpenAI service temporarily unavailable. Try again in a moment.'
      }
    }

    // Network/timeout errors
    if (error?.code === 'ENOTFOUND' || error?.code === 'ETIMEDOUT') {
      errorMessage = 'Network error. Check your connection and try again.'
      statusCode = 503
    }

    // Rate limiting
    if (error?.type === 'rate_limit_exceeded') {
      errorMessage = 'Rate limit reached. Please wait a moment.'
      statusCode = 429
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        code: error?.code || 'UNKNOWN_ERROR',
        retryable: statusCode >= 500 || statusCode === 429
      },
      { status: statusCode }
    )
  }
}
