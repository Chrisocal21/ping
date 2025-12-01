'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const user = login(username, password)
    if (user) {
      router.push('/chat')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-6xl font-bold tracking-tight">Ping</h1>
          <p className="text-gray-400">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Login/Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-ai-bubble text-white rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-user-bubble placeholder-gray-500"
              placeholder="Username"
            />

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-ai-bubble text-white rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-user-bubble placeholder-gray-500"
              placeholder="Password"
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-user-bubble hover:bg-blue-600 transition-colors px-8 py-4 rounded-full text-lg font-semibold"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Sign Up/Sign In */}
        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        {/* Show info only on sign up */}
        {isSignUp && (
          <div className="pt-6 space-y-4">
            <div className="text-center space-y-2">
              <p className="text-gray-400 text-sm">
                Practice conversations • Process emotions • Get unstuck
              </p>
            </div>
            
            <div className="bg-ai-bubble/50 rounded-xl p-5 space-y-2">
              <p className="text-sm text-gray-300">
                Ping is your AI companion that helps you navigate social situations, 
                work through feelings, and figure things out.
              </p>
              <p className="text-xs text-gray-500">
                No therapy vibes. Just real talk when you need it.
              </p>
            </div>
          </div>
        )}

        {/* Simple description for sign in */}
        {!isSignUp && (
          <div className="pt-8 text-center">
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Your AI companion for conversations, emotions, and getting unstuck.
            </p>
          </div>
        )}

        {/* About & Back Links */}
        <div className="flex items-center justify-center gap-6 pt-4">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-500 transition-colors">
            ← Back
          </Link>
          <span className="text-gray-700">•</span>
          <Link href="/about" className="text-sm text-gray-600 hover:text-gray-500 transition-colors">
            How It Works
          </Link>
        </div>
      </div>
    </div>
  )
}
