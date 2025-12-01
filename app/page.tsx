'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCurrentUser, logout, type User } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { PingWordmark } from '@/components/PingLogo'

export default function LandingPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-12">
        {/* User Info / Logout */}
        {user && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-3 bg-ai-bubble rounded-full px-4 py-2">
              <span className="text-sm text-gray-400">Hi, {user.username}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Logo / Name */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <PingWordmark className="scale-[2]" />
          </div>
          <p className="text-lg text-gray-400 mt-8">
            Your AI companion
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          {user ? (
            <Link
              href="/chat"
              className="block bg-gradient-to-r from-[#14F195] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#14F195] transition-all px-8 py-5 rounded-full text-xl font-semibold text-gray-900"
            >
              Continue
            </Link>
          ) : (
            <Link
              href="/login"
              className="block bg-gradient-to-r from-[#14F195] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#14F195] transition-all px-8 py-5 rounded-full text-xl font-semibold text-gray-900"
            >
              Sign In
            </Link>
          )}
          
          <Link
            href="/about"
            className="block bg-gray-800 hover:bg-gray-700 transition-colors px-8 py-4 rounded-full text-lg font-medium border border-gray-700"
          >
            How It Works
          </Link>
        </div>
      </div>
    </div>
  )
}
