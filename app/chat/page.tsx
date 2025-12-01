'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  sender: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      content: "Hey. I'm Max. I'm here when you want to practice talking to humans, need to vent, or just want help figuring something out. No judgment, no therapy-speak, no weird positivity. What's on your mind?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: "I hear you. Let's dig into that.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-ai-bubble flex items-center justify-center">
            <span className="text-sm font-semibold">M</span>
          </div>
          <div>
            <p className="font-semibold">Max</p>
            <p className="text-xs text-gray-400">Witty Realist</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white text-sm">
          Settings
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-user-bubble text-white'
                  : 'bg-ai-bubble text-white'
              }`}
            >
              <p className="text-[15px] leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[75%] bg-ai-bubble rounded-2xl px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Buttons */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto">
        <button className="whitespace-nowrap px-4 py-2 bg-ai-bubble hover:bg-gray-700 rounded-full text-sm transition-colors">
          Practice conversations
        </button>
        <button className="whitespace-nowrap px-4 py-2 bg-ai-bubble hover:bg-gray-700 rounded-full text-sm transition-colors">
          I need to vent
        </button>
        <button className="whitespace-nowrap px-4 py-2 bg-ai-bubble hover:bg-gray-700 rounded-full text-sm transition-colors">
          Help me decide
        </button>
        <button className="whitespace-nowrap px-4 py-2 bg-ai-bubble hover:bg-gray-700 rounded-full text-sm transition-colors">
          Just chat
        </button>
      </div>

      {/* Input Area */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-end space-x-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-ai-bubble text-white rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-user-bubble placeholder-gray-500"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-user-bubble hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-full p-3 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
