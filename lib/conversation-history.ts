/**
 * Conversation History Management
 * 
 * Handles saving, loading, and managing conversation sessions.
 * Each conversation is stored with metadata and can be continued later.
 */

export interface SavedMessage {
  id: string
  sender: 'user' | 'ai'
  content: string
  timestamp: string
}

export interface ConversationMetadata {
  id: string
  userId: string
  personality: string
  startedAt: string
  lastMessageAt: string
  messageCount: number
  preview: string // Last user message or first message
  isActive: boolean // Current conversation or archived
}

export interface SavedConversation {
  metadata: ConversationMetadata
  messages: SavedMessage[]
}

const STORAGE_KEY = 'ping_conversations'
const ACTIVE_CONVERSATION_KEY = 'ping_active_conversation'

/**
 * Get all conversations for a user
 */
export function getAllConversations(userId: string): ConversationMetadata[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const allConversations: SavedConversation[] = JSON.parse(stored)
    
    // Filter by user and return metadata only, sorted by most recent
    return allConversations
      .filter(conv => conv.metadata.userId === userId)
      .map(conv => conv.metadata)
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
  } catch (error) {
    console.error('Error loading conversations:', error)
    return []
  }
}

/**
 * Get a specific conversation by ID
 */
export function getConversation(conversationId: string): SavedConversation | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    
    const allConversations: SavedConversation[] = JSON.parse(stored)
    return allConversations.find(conv => conv.metadata.id === conversationId) || null
  } catch (error) {
    console.error('Error loading conversation:', error)
    return null
  }
}

/**
 * Save or update a conversation
 */
export function saveConversation(conversation: SavedConversation): void {
  if (typeof window === 'undefined') return
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const allConversations: SavedConversation[] = stored ? JSON.parse(stored) : []
    
    // Find existing conversation index
    const existingIndex = allConversations.findIndex(
      conv => conv.metadata.id === conversation.metadata.id
    )
    
    if (existingIndex >= 0) {
      // Update existing
      allConversations[existingIndex] = conversation
    } else {
      // Add new
      allConversations.push(conversation)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allConversations))
  } catch (error) {
    console.error('Error saving conversation:', error)
  }
}

/**
 * Create a new conversation
 */
export function createConversation(
  userId: string,
  personality: string,
  initialMessage?: SavedMessage
): SavedConversation {
  const now = new Date().toISOString()
  const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`
  
  const messages: SavedMessage[] = initialMessage ? [initialMessage] : []
  
  const conversation: SavedConversation = {
    metadata: {
      id: conversationId,
      userId,
      personality,
      startedAt: now,
      lastMessageAt: now,
      messageCount: messages.length,
      preview: initialMessage?.content || 'New conversation',
      isActive: true,
    },
    messages,
  }
  
  return conversation
}

/**
 * Add messages to a conversation
 */
export function addMessagesToConversation(
  conversationId: string,
  newMessages: SavedMessage[]
): void {
  const conversation = getConversation(conversationId)
  if (!conversation) return
  
  conversation.messages.push(...newMessages)
  conversation.metadata.messageCount = conversation.messages.length
  conversation.metadata.lastMessageAt = new Date().toISOString()
  
  // Update preview with last user message
  const lastUserMessage = [...conversation.messages]
    .reverse()
    .find(m => m.sender === 'user')
  
  if (lastUserMessage) {
    conversation.metadata.preview = lastUserMessage.content.substring(0, 100)
  }
  
  saveConversation(conversation)
}

/**
 * Delete a conversation
 */
export function deleteConversation(conversationId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return
    
    const allConversations: SavedConversation[] = JSON.parse(stored)
    const filtered = allConversations.filter(conv => conv.metadata.id !== conversationId)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error deleting conversation:', error)
  }
}

/**
 * Get or create active conversation for user/personality
 */
export function getActiveConversation(userId: string, personality: string): string | null {
  if (typeof window === 'undefined') return null
  
  const key = `${ACTIVE_CONVERSATION_KEY}_${userId}_${personality}`
  return localStorage.getItem(key)
}

/**
 * Set active conversation
 */
export function setActiveConversation(userId: string, personality: string, conversationId: string): void {
  if (typeof window === 'undefined') return
  
  const key = `${ACTIVE_CONVERSATION_KEY}_${userId}_${personality}`
  localStorage.setItem(key, conversationId)
}

/**
 * Clear active conversation (when starting fresh)
 */
export function clearActiveConversation(userId: string, personality: string): void {
  if (typeof window === 'undefined') return
  
  const key = `${ACTIVE_CONVERSATION_KEY}_${userId}_${personality}`
  localStorage.removeItem(key)
}

/**
 * Get conversation count by personality
 */
export function getConversationCountByPersonality(userId: string): Record<string, number> {
  const conversations = getAllConversations(userId)
  const counts: Record<string, number> = {}
  
  conversations.forEach(conv => {
    counts[conv.personality] = (counts[conv.personality] || 0) + 1
  })
  
  return counts
}
