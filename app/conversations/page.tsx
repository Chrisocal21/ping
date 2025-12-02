'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getAllConversations, deleteConversation, type ConversationMetadata } from '@/lib/conversation-history'
import { getPersonality } from '@/lib/personalities'
import { PersonalityAvatar } from '@/components/PersonalityAvatar'

export default function ConversationsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [conversations, setConversations] = useState<ConversationMetadata[]>([])
  const [longPressedId, setLongPressedId] = useState<string | null>(null)
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    setCurrentUser(user)
    loadConversations(user.username)
  }, [router])

  const loadConversations = (userId: string) => {
    const allConvos = getAllConversations(userId)
    setConversations(allConvos)
  }

  const handleOpenConversation = (conversationId: string) => {
    router.push(`/chat?conversation=${conversationId}`)
  }

  const handleDeleteConversation = (conversationId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    
    if (confirm('Delete this conversation? This cannot be undone.')) {
      deleteConversation(conversationId)
      if (currentUser) {
        loadConversations(currentUser.username)
      }
      setLongPressedId(null)
    }
  }

  const handlePressStart = (conversationId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const timer = setTimeout(() => {
      setLongPressedId(conversationId)
    }, 500) // 500ms long press
    setPressTimer(timer)
  }

  const handlePressEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer)
      setPressTimer(null)
    }
  }

  const handleNewChat = () => {
    router.push('/chat')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = diff / (1000 * 60 * 60)
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes < 1 ? 'Just now' : `${minutes}m ago`
    } else if (hours < 24) {
      return `${Math.floor(hours)}h ago`
    } else if (hours < 48) {
      return 'Yesterday'
    } else if (hours < 168) {
      return `${Math.floor(hours / 24)}d ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const groupedConversations = conversations.reduce((acc, conv) => {
    const date = new Date(conv.lastMessageAt)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    let group = 'Older'
    if (date.toDateString() === today.toDateString()) {
      group = 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      group = 'Yesterday'
    } else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
      group = 'This Week'
    }
    
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group].push(conv)
    return acc
  }, {} as Record<string, ConversationMetadata[]>)

  const groupOrder = ['Today', 'Yesterday', 'This Week', 'Older']

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#0a0a12] via-[#1a1a24] to-[#0a0a12]">
      {/* Header */}
      <div className="flex-none bg-black/30 backdrop-blur-sm border-b border-gray-800 px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/chat')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">Conversations</h1>
          </div>
          
          <button
            onClick={handleNewChat}
            className="px-4 py-2 bg-user-bubble hover:bg-user-bubble/80 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {conversations.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-4 flex justify-center">
                <svg className="w-16 h-16 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">No conversations yet</h2>
              <p className="text-gray-400 mb-6">Start a new chat to begin your journey</p>
              <button
                onClick={handleNewChat}
                className="px-6 py-3 bg-user-bubble hover:bg-user-bubble/80 text-white rounded-lg transition-colors"
              >
                Start Your First Chat
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {groupOrder.map(group => {
                const groupConvos = groupedConversations[group]
                if (!groupConvos || groupConvos.length === 0) return null
                
                return (
                  <div key={group}>
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                      {group}
                    </h2>
                    <div className="space-y-2">
                      {groupConvos.map(conv => {
                        const personality = getPersonality(conv.personality)
                        const isLongPressed = longPressedId === conv.id
                        
                        return (
                          <div
                            key={conv.id}
                            className="w-full bg-ai-bubble hover:bg-gray-800/80 rounded-lg p-4 transition-all group cursor-pointer relative"
                            onClick={() => !isLongPressed && handleOpenConversation(conv.id)}
                            onMouseDown={(e) => handlePressStart(conv.id, e)}
                            onMouseUp={handlePressEnd}
                            onMouseLeave={handlePressEnd}
                            onTouchStart={(e) => handlePressStart(conv.id, e)}
                            onTouchEnd={handlePressEnd}
                            onTouchCancel={handlePressEnd}
                          >
                            <div className="flex items-start space-x-3">
                              <PersonalityAvatar personalityId={personality.id} size="lg" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-semibold text-white">{personality.name}</h3>
                                  <span className="text-xs text-gray-500">{formatDate(conv.lastMessageAt)}</span>
                                </div>
                                <p className="text-sm text-gray-400 truncate">{conv.preview}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <span className="text-xs text-gray-500">{conv.messageCount} messages</span>
                                </div>
                              </div>
                              
                              {/* Delete button - shows on hover (desktop) or long press (mobile) */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteConversation(conv.id)
                                }}
                                className={`${
                                  isLongPressed 
                                    ? 'opacity-100' 
                                    : 'opacity-0 group-hover:opacity-100'
                                } transition-all text-gray-500 hover:text-red-400 p-2 ${
                                  isLongPressed ? 'scale-110' : ''
                                }`}
                                title="Delete conversation"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            
                            {/* Visual feedback for long press */}
                            {isLongPressed && (
                              <div className="absolute inset-0 rounded-lg border-2 border-red-400 pointer-events-none animate-pulse" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
