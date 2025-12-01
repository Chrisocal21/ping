/**
 * Error Display Component
 * 
 * Shows user-friendly error messages inline
 */

interface ErrorDisplayProps {
  message: string
  retry?: () => void
  dismiss?: () => void
}

export function ErrorDisplay({ message, retry, dismiss }: ErrorDisplayProps) {
  return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          <p className="text-sm text-red-300">{message}</p>
          <div className="mt-3 flex space-x-2">
            {retry && (
              <button
                onClick={retry}
                className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded transition-colors"
              >
                Try Again
              </button>
            )}
            {dismiss && (
              <button
                onClick={dismiss}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function NetworkErrorDisplay({ retry }: { retry?: () => void }) {
  return (
    <ErrorDisplay
      message="Can't connect right now. Check your internet connection."
      retry={retry}
    />
  )
}

export function TimeoutErrorDisplay({ retry }: { retry?: () => void }) {
  return (
    <ErrorDisplay
      message="Request timed out. The server might be busy - try again."
      retry={retry}
    />
  )
}

export function ServerErrorDisplay({ retry }: { retry?: () => void }) {
  return (
    <ErrorDisplay
      message="Server error. We're working on it - try again in a moment."
      retry={retry}
    />
  )
}
