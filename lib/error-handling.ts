/**
 * Error Handling Utilities
 * 
 * Provides consistent error handling, retry logic, and user-friendly error messages.
 */

export interface APIError {
  message: string
  status?: number
  code?: string
  retryable: boolean
}

/**
 * Categorizes errors and provides user-friendly messages
 */
export function handleAPIError(error: any): APIError {
  // Network errors (no connection)
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      message: "Can't connect right now. Check your internet connection and try again.",
      code: 'NETWORK_ERROR',
      retryable: true
    }
  }

  // Timeout errors
  if (error.name === 'AbortError') {
    return {
      message: "Request timed out. This might take a moment - try again.",
      code: 'TIMEOUT',
      retryable: true
    }
  }

  // HTTP errors
  if (error.status) {
    switch (error.status) {
      case 400:
        return {
          message: "Invalid request. Try rephrasing your message.",
          status: 400,
          code: 'BAD_REQUEST',
          retryable: false
        }
      case 401:
        return {
          message: "Session expired. Please log in again.",
          status: 401,
          code: 'UNAUTHORIZED',
          retryable: false
        }
      case 429:
        return {
          message: "Too many requests. Wait a moment and try again.",
          status: 429,
          code: 'RATE_LIMIT',
          retryable: true
        }
      case 500:
      case 502:
      case 503:
        return {
          message: "Server error. We're working on it - try again in a moment.",
          status: error.status,
          code: 'SERVER_ERROR',
          retryable: true
        }
      default:
        return {
          message: "Something went wrong. Try again?",
          status: error.status,
          code: 'UNKNOWN_ERROR',
          retryable: true
        }
    }
  }

  // OpenAI specific errors
  if (error.message?.includes('API key')) {
    return {
      message: "Configuration error. Please contact support.",
      code: 'CONFIG_ERROR',
      retryable: false
    }
  }

  // Default fallback
  return {
    message: "Unexpected error. Try again or refresh the page.",
    code: 'UNKNOWN',
    retryable: true
  }
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      const apiError = handleAPIError(error)
      
      // Don't retry if error is not retryable
      if (!apiError.retryable) {
        throw error
      }

      // Don't retry on last attempt
      if (attempt === maxRetries - 1) {
        throw error
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, attempt)
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`)
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Fetch with timeout and error handling
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = 30000
): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })

    clearTimeout(id)

    if (!response.ok) {
      throw {
        status: response.status,
        statusText: response.statusText,
        message: `HTTP ${response.status}: ${response.statusText}`
      }
    }

    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

/**
 * Safe JSON parse with error handling
 */
export function safeJSONParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text)
  } catch (error) {
    console.error('JSON parse error:', error)
    return fallback
  }
}

/**
 * Log errors appropriately based on environment
 */
export function logError(context: string, error: any, metadata?: Record<string, any>) {
  const errorInfo = {
    context,
    message: error?.message || 'Unknown error',
    stack: error?.stack,
    timestamp: new Date().toISOString(),
    ...metadata
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, errorInfo)
  } else {
    // In production, log to error tracking service
    console.error('[Error]', context, error?.message)
    // TODO: Send to analytics/error tracking service
  }
}

/**
 * Displays error toast notification
 */
export function showErrorToast(message: string, duration: number = 5000) {
  // This would integrate with a toast library in a real app
  console.warn('Error Toast:', message)
  
  // For now, we'll return a simple notification object
  return {
    message,
    type: 'error' as const,
    duration
  }
}
