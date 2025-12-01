/**
 * Loading Skeleton Components
 * 
 * Provides visual feedback while content is loading,
 * improving perceived performance.
 */

export function MessageSkeleton() {
  return (
    <div className="flex justify-start animate-pulse">
      <div className="max-w-[75%] bg-ai-bubble rounded-2xl px-4 py-3 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-48"></div>
        <div className="h-4 bg-gray-700 rounded w-32"></div>
      </div>
    </div>
  )
}

export function InsightCardSkeleton() {
  return (
    <div className="bg-gray-800/30 rounded-xl p-4 animate-pulse">
      <div className="h-5 bg-gray-700 rounded w-32 mb-3"></div>
      <div className="h-8 bg-gray-700 rounded w-16"></div>
    </div>
  )
}

export function ConversationItemSkeleton() {
  return (
    <div className="p-3 rounded-lg bg-gray-800/30 animate-pulse">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-700 rounded w-24"></div>
          <div className="h-3 bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    </div>
  )
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14F195]"></div>
        <div className="text-gray-400">Loading...</div>
      </div>
    </div>
  )
}

export function ChatLoadingSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <MessageSkeleton />
      <div className="flex justify-end animate-pulse">
        <div className="max-w-[75%] bg-user-bubble/30 rounded-2xl px-4 py-3">
          <div className="h-4 bg-gray-600 rounded w-40"></div>
        </div>
      </div>
      <MessageSkeleton />
    </div>
  )
}
