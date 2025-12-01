'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo / Name */}
        <div className="space-y-3">
          <h1 className="text-6xl font-bold tracking-tight">Ping</h1>
          <p className="text-xl text-gray-400">
            A quick signal when you need one.
          </p>
        </div>

        {/* Main Description */}
        <div className="space-y-4 py-8">
          <p className="text-2xl font-medium text-white">
            Your smart-mouthed AI companion for conversations, emotions, and life.
          </p>
          <p className="text-lg text-gray-300">
            Without the therapy vibes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 py-8">
          <div className="bg-ai-bubble rounded-2xl p-6 space-y-3">
            <h3 className="text-lg font-semibold">Practice Conversations</h3>
            <p className="text-sm text-gray-400">
              Get better at talking to people through low-pressure practice.
            </p>
          </div>
          <div className="bg-ai-bubble rounded-2xl p-6 space-y-3">
            <h3 className="text-lg font-semibold">Process Emotions</h3>
            <p className="text-sm text-gray-400">
              A safe space to vent and untangle feelings without judgment.
            </p>
          </div>
          <div className="bg-ai-bubble rounded-2xl p-6 space-y-3">
            <h3 className="text-lg font-semibold">Get Unstuck</h3>
            <p className="text-sm text-gray-400">
              Make decisions, find motivation, and break through stuck points.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4 pt-8">
          <Link
            href="/chat"
            className="inline-block bg-user-bubble hover:bg-blue-600 transition-colors px-8 py-4 rounded-full text-lg font-semibold"
          >
            Start Talking
          </Link>
          <p className="text-sm text-gray-500">
            No account required. Just chat.
          </p>
        </div>

        {/* Personalities Preview */}
        <div className="pt-12 space-y-4">
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            Choose your companion
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-ai-bubble rounded-xl p-4 space-y-1">
              <p className="font-semibold">Max</p>
              <p className="text-xs text-gray-400">Witty Realist</p>
            </div>
            <div className="bg-ai-bubble rounded-xl p-4 space-y-1">
              <p className="font-semibold">Jamie</p>
              <p className="text-xs text-gray-400">Warm Encourager</p>
            </div>
            <div className="bg-ai-bubble rounded-xl p-4 space-y-1">
              <p className="font-semibold">Sage</p>
              <p className="text-xs text-gray-400">Calm Guide</p>
            </div>
            <div className="bg-ai-bubble rounded-xl p-4 space-y-1">
              <p className="font-semibold">Riley</p>
              <p className="text-xs text-gray-400">Energetic Ally</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
