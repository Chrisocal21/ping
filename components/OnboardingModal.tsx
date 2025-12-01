'use client'

import { useState } from 'react'
import { PersonalityAvatar } from '@/components/PersonalityAvatar'
import { getAllPersonalities } from '@/lib/personalities'

interface OnboardingModalProps {
  onComplete: (selectedPersonality: string) => void
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<'welcome' | 'personalities' | 'features'>('welcome')
  const [selectedPersonality, setSelectedPersonality] = useState<string>('max')
  const personalities = getAllPersonalities()

  const handleFinish = () => {
    onComplete(selectedPersonality)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f0f1a] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        {/* Welcome Step */}
        {step === 'welcome' && (
          <div className="p-8 text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">
                Welcome to Ping
              </h1>
              <p className="text-xl text-gray-300">
                Your AI companion for life's conversations
              </p>
            </div>

            <div className="space-y-4 text-left max-w-xl mx-auto py-6">
              <p className="text-gray-300 leading-relaxed">
                Ping is here to help you practice social skills, work through decisions, 
                and talk through whatever's on your mind.
              </p>
              <p className="text-gray-300 leading-relaxed">
                No judgment. No pressure. Just a safe space to think out loud.
              </p>
            </div>

            <button
              onClick={() => setStep('personalities')}
              className="px-8 py-3 bg-gradient-to-r from-[#14F195] to-[#0EA5E9] text-gray-900 font-semibold rounded-lg hover:from-[#0EA5E9] hover:to-[#14F195] transition-all"
            >
              Let's Get Started
            </button>
          </div>
        )}

        {/* Personalities Step */}
        {step === 'personalities' && (
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">
                Choose Your AI Companion
              </h2>
              <p className="text-gray-400">
                Each personality has a unique voice and approach. You can change this anytime in settings.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {personalities.map((personality) => (
                <button
                  key={personality.id}
                  onClick={() => setSelectedPersonality(personality.id)}
                  className={`p-5 rounded-xl border-2 transition-all text-left ${
                    selectedPersonality === personality.id
                      ? 'border-[#14F195] bg-gradient-to-r from-[#14F195]/10 to-[#0EA5E9]/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <PersonalityAvatar personalityId={personality.id} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">{personality.name}</h3>
                      <p className="text-sm text-gray-400 mb-3">{personality.tagline}</p>
                      <div className="flex flex-wrap gap-2">
                        {personality.specialties.slice(0, 2).map((specialty, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-300"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep('welcome')}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep('features')}
                className="px-8 py-3 bg-gradient-to-r from-[#14F195] to-[#0EA5E9] text-gray-900 font-semibold rounded-lg hover:from-[#0EA5E9] hover:to-[#14F195] transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Features Step */}
        {step === 'features' && (
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">
                How to Use Ping
              </h2>
              <p className="text-gray-400">
                Here's what you can do
              </p>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              {/* Just Talk */}
              <div className="p-5 bg-gray-800/30 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#14F195]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Just Start Talking
                </h3>
                <p className="text-sm text-gray-400">
                  Share whatever's on your mind. The AI adapts automatically to what you need—
                  whether that's practicing a conversation, working through a decision, or just venting.
                </p>
              </div>

              {/* Your Progress */}
              <div className="p-5 bg-gray-800/30 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#14F195]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Track Your Growth
                </h3>
                <p className="text-sm text-gray-400">
                  Ping remembers what you talk about and tracks your progress. 
                  Check your insights dashboard anytime to see your journey.
                </p>
              </div>

              {/* Privacy */}
              <div className="p-5 bg-gray-800/30 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#14F195]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Your Privacy Matters
                </h3>
                <p className="text-sm text-gray-400">
                  All your conversations are stored locally in your browser. 
                  You can export or delete your data anytime from settings.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-4">
                  Start with a simple message—just say what's on your mind
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <span className="text-xs px-3 py-1.5 bg-gray-800 rounded-full text-gray-300">
                    "I have a job interview tomorrow"
                  </span>
                  <span className="text-xs px-3 py-1.5 bg-gray-800 rounded-full text-gray-300">
                    "Can we practice small talk?"
                  </span>
                  <span className="text-xs px-3 py-1.5 bg-gray-800 rounded-full text-gray-300">
                    "I need to make a decision"
                  </span>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('personalities')}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  className="px-8 py-3 bg-gradient-to-r from-[#14F195] to-[#0EA5E9] text-gray-900 font-semibold rounded-lg hover:from-[#0EA5E9] hover:to-[#14F195] transition-all"
                >
                  Start Chatting
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
