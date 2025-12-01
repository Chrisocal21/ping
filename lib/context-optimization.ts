/**
 * Context Window Optimization
 * 
 * Intelligently manages conversation context to stay within token limits
 * while preserving the most relevant information for AI responses.
 */

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface OptimizationConfig {
  maxTokens: number
  preserveRecentCount: number
  includeSystemPrompt: boolean
  prioritizeFacts: boolean
  prioritizeEmotionalState: boolean
}

export interface OptimizationResult {
  messages: Message[]
  tokensUsed: number
  messagesRemoved: number
  factsIncluded: string[]
}

const DEFAULT_CONFIG: OptimizationConfig = {
  maxTokens: 3000, // Safe limit for context window
  preserveRecentCount: 10, // Always keep last 10 messages
  includeSystemPrompt: true,
  prioritizeFacts: true,
  prioritizeEmotionalState: true
}

/**
 * Rough token estimation (4 characters ≈ 1 token)
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Calculates total tokens for a set of messages
 */
function calculateTotalTokens(messages: Message[]): number {
  return messages.reduce((total, msg) => {
    return total + estimateTokens(msg.content)
  }, 0)
}

/**
 * Assigns priority score to a message based on importance
 */
function getMessagePriority(
  message: Message,
  index: number,
  totalMessages: number,
  config: OptimizationConfig
): number {
  let priority = 0

  // System messages always have highest priority
  if (message.role === 'system') {
    return 1000
  }

  // Recent messages get higher priority (recency boost)
  const recencyBoost = (index / totalMessages) * 100
  priority += recencyBoost

  // Messages with emotional content get priority boost
  if (config.prioritizeEmotionalState) {
    const emotionalKeywords = [
      'feel', 'feeling', 'felt', 'anxious', 'worried', 'scared', 'excited',
      'happy', 'sad', 'angry', 'frustrated', 'stressed', 'overwhelmed',
      'nervous', 'confident', 'proud', 'ashamed', 'guilty', 'hurt'
    ]
    
    const lowerContent = message.content.toLowerCase()
    const emotionalCount = emotionalKeywords.filter(kw => lowerContent.includes(kw)).length
    priority += emotionalCount * 10
  }

  // Longer messages often contain more context
  const lengthBoost = Math.min(message.content.length / 100, 20)
  priority += lengthBoost

  // User messages slightly more important than assistant (contain user's thoughts)
  if (message.role === 'user') {
    priority += 5
  }

  // Messages with questions get priority (important context)
  if (message.content.includes('?')) {
    priority += 15
  }

  return priority
}

/**
 * Extracts important facts from conversation that should be preserved
 */
function extractImportantFacts(messages: Message[]): string[] {
  const facts: string[] = []
  
  const factPatterns = [
    /my name is (\w+)/i,
    /i'?m (?:a |an )?(\w+) (?:at|in|for) ([\w\s]+)/i, // "I'm a developer at Google"
    /i have (?:a |an )?(\w+)/i, // "I have an interview"
    /i'?m (?:going to|preparing for) ([\w\s]+)/i,
    /(?:tomorrow|next week|in \d+ days?) (?:i have|is my) ([\w\s]+)/i,
  ]

  messages.forEach(msg => {
    if (msg.role === 'user') {
      factPatterns.forEach(pattern => {
        const match = msg.content.match(pattern)
        if (match) {
          facts.push(match[0])
        }
      })
    }
  })

  return Array.from(new Set(facts)) // Remove duplicates
}

/**
 * Creates a condensed summary of removed messages
 */
function createContextSummary(removedMessages: Message[], facts: string[]): string {
  const userMessageCount = removedMessages.filter(m => m.role === 'user').length
  const assistantMessageCount = removedMessages.filter(m => m.role === 'assistant').length
  
  let summary = `[Previous conversation: ${userMessageCount} user messages, ${assistantMessageCount} assistant responses`
  
  if (facts.length > 0) {
    summary += `. Key facts: ${facts.join('; ')}`
  }
  
  summary += ']'
  
  return summary
}

/**
 * Optimizes conversation context to fit within token limits
 */
export function optimizeContext(
  messages: Message[],
  userConfig?: Partial<OptimizationConfig>
): OptimizationResult {
  const config = { ...DEFAULT_CONFIG, ...userConfig }
  
  // If already under limit, return as-is
  const currentTokens = calculateTotalTokens(messages)
  if (currentTokens <= config.maxTokens) {
    return {
      messages,
      tokensUsed: currentTokens,
      messagesRemoved: 0,
      factsIncluded: []
    }
  }

  // Separate system messages from conversation
  const systemMessages = messages.filter(m => m.role === 'system')
  const conversationMessages = messages.filter(m => m.role !== 'system')

  // Always preserve the most recent messages
  const recentMessages = conversationMessages.slice(-config.preserveRecentCount)
  const olderMessages = conversationMessages.slice(0, -config.preserveRecentCount)

  // Extract important facts from older messages
  const facts = config.prioritizeFacts ? extractImportantFacts(olderMessages) : []

  // Calculate tokens used by system + recent messages
  let tokensUsed = calculateTotalTokens([...systemMessages, ...recentMessages])

  // Reserve tokens for context summary if we have facts
  const summaryTokens = facts.length > 0 ? estimateTokens(createContextSummary([], facts)) : 0
  const availableTokens = config.maxTokens - tokensUsed - summaryTokens

  // If we still have room, add older messages by priority
  const selectedOlderMessages: Message[] = []
  
  if (availableTokens > 0 && olderMessages.length > 0) {
    // Score and sort older messages by priority
    const scoredMessages = olderMessages.map((msg, idx) => ({
      message: msg,
      priority: getMessagePriority(msg, idx, olderMessages.length, config),
      tokens: estimateTokens(msg.content)
    }))

    scoredMessages.sort((a, b) => b.priority - a.priority)

    // Add highest priority messages until we run out of tokens
    let remainingTokens = availableTokens
    for (const scored of scoredMessages) {
      if (scored.tokens <= remainingTokens) {
        selectedOlderMessages.push(scored.message)
        remainingTokens -= scored.tokens
      }
    }

    // Re-sort selected messages to maintain chronological order
    selectedOlderMessages.sort((a, b) => {
      const aIndex = olderMessages.indexOf(a)
      const bIndex = olderMessages.indexOf(b)
      return aIndex - bIndex
    })
  }

  // Build final message list
  const finalMessages: Message[] = [...systemMessages]

  // Add context summary if we removed messages
  const removedCount = olderMessages.length - selectedOlderMessages.length
  if (removedCount > 0 && facts.length > 0) {
    const removedMessages = olderMessages.filter(m => !selectedOlderMessages.includes(m))
    const summary = createContextSummary(removedMessages, facts)
    finalMessages.push({
      role: 'system',
      content: summary
    })
  }

  // Add selected older messages + recent messages
  finalMessages.push(...selectedOlderMessages, ...recentMessages)

  const finalTokens = calculateTotalTokens(finalMessages)

  return {
    messages: finalMessages,
    tokensUsed: finalTokens,
    messagesRemoved: removedCount,
    factsIncluded: facts
  }
}

/**
 * Helper function to check if optimization is needed
 */
export function needsOptimization(
  messages: Message[],
  maxTokens: number = DEFAULT_CONFIG.maxTokens
): boolean {
  return calculateTotalTokens(messages) > maxTokens
}

/**
 * Gets optimization stats for monitoring
 */
export function getOptimizationStats(messages: Message[]): {
  totalMessages: number
  totalTokens: number
  systemMessages: number
  userMessages: number
  assistantMessages: number
  averageTokensPerMessage: number
} {
  const totalTokens = calculateTotalTokens(messages)
  const systemMessages = messages.filter(m => m.role === 'system').length
  const userMessages = messages.filter(m => m.role === 'user').length
  const assistantMessages = messages.filter(m => m.role === 'assistant').length

  return {
    totalMessages: messages.length,
    totalTokens,
    systemMessages,
    userMessages,
    assistantMessages,
    averageTokensPerMessage: Math.round(totalTokens / messages.length)
  }
}
