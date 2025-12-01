'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getUserMemory } from '@/lib/memory'
import { PersonalityAvatar } from '@/components/PersonalityAvatar'

export default function InsightsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [memory, setMemory] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    setCurrentUser(user)
    const userMemory = getUserMemory(user.username)
    setMemory(userMemory)
    setLoading(false)
  }, [router])

  // Memoize computed insights to avoid recalculation on every render
  const insights = useMemo(() => {
    if (!memory) return null
    
    return {
      totalConversations: memory.pastConversations?.length || 0,
      totalFacts: memory.facts?.length || 0,
      currentStreak: memory.growth?.streakDays || 0,
      scenariosCompleted: memory.growth?.scenariosCompleted || 0,
      topThemes: memory.growth?.recurringThemes 
        ? Object.entries(memory.growth.recurringThemes)
            .sort((a: any, b: any) => b[1] - a[1])
            .slice(0, 5)
        : []
    }
  }, [memory])

  if (loading || !memory || !insights) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14F195]"></div>
          <div className="text-gray-400">Loading insights...</div>
        </div>
      </div>
    )
  }

  const { totalConversations, totalFacts, currentStreak, scenariosCompleted, topThemes } = insights

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/chat')}
              className="text-gray-400 hover:bg-gradient-to-r hover:from-[#14F195] hover:to-[#0EA5E9] hover:bg-clip-text hover:text-transparent transition-all"
            >
              ← Back
            </button>
            <h1 className="text-xl font-semibold">Your Insights</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Overview Stats */}
        <section>
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">
            Your Journey
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#1a1a24] rounded-lg p-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent mb-2">
                {totalConversations}
              </div>
              <div className="text-sm text-gray-400">Conversations</div>
            </div>

            <div className="bg-[#1a1a24] rounded-lg p-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent mb-2">
                {currentStreak}
              </div>
              <div className="text-sm text-gray-400">Day Streak</div>
            </div>

            <div className="bg-[#1a1a24] rounded-lg p-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent mb-2">
                {scenariosCompleted}
              </div>
              <div className="text-sm text-gray-400">Scenarios</div>
            </div>

            <div className="bg-[#1a1a24] rounded-lg p-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent mb-2">
                {totalFacts}
              </div>
              <div className="text-sm text-gray-400">Things Learned</div>
            </div>
          </div>
        </section>

        {/* Emotional Patterns */}
        {memory.emotionalPatterns && typeof memory.emotionalPatterns === 'object' && Object.keys(memory.emotionalPatterns).length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Emotional Patterns</h2>
            <div className="bg-[#1a1a24] rounded-lg p-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(memory.emotionalPatterns).map(([emotion, count]: any) => (
                  <div key={emotion} className="text-center">
                    <div className="text-2xl font-bold text-gray-300 mb-1">{count}</div>
                    <div className="text-xs text-gray-500 capitalize">{emotion}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recurring Themes */}
        {topThemes.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Top Themes</h2>
            <div className="bg-[#1a1a24] rounded-lg p-6">
              <div className="space-y-3">
                {topThemes.map(([theme, count]: any, index) => (
                  <div key={theme} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#14F195] to-[#0EA5E9] rounded-full flex items-center justify-center text-sm font-semibold text-gray-900">
                        {index + 1}
                      </div>
                      <span className="text-gray-300 capitalize">{theme}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{count} times</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Scenario Performance */}
        {memory.scenarioLearning?.categoryPerformance && Object.keys(memory.scenarioLearning.categoryPerformance).length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Skills Practice</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(memory.scenarioLearning.categoryPerformance).map(([category, data]: any) => (
                <div key={category} className="bg-[#1a1a24] rounded-lg p-6">
                  <h3 className="font-semibold mb-3 capitalize">{category}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Attempts:</span>
                      <span className="text-gray-300">{data.attempts}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Success Rate:</span>
                      <span className="text-gray-300">
                        {data.attempts > 0 ? Math.round((data.successful / data.attempts) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Preferred Tone:</span>
                      <span className="text-gray-300 capitalize">{data.preferredTone || 'None yet'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Preferred Frameworks */}
        {memory.preferredFrameworks && memory.preferredFrameworks.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Coaching Styles You Like</h2>
            <div className="bg-[#1a1a24] rounded-lg p-6">
              <div className="flex flex-wrap gap-2">
                {memory.preferredFrameworks.slice(0, 10).map((framework: string) => (
                  <span 
                    key={framework}
                    className="px-3 py-1 bg-gradient-to-r from-[#14F195]/10 to-[#0EA5E9]/10 border border-[#14F195]/30 rounded-full text-sm text-gray-300"
                  >
                    {framework}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recent Facts */}
        {memory.facts && memory.facts.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Things I've Learned About You</h2>
            <div className="bg-[#1a1a24] rounded-lg p-6 space-y-3">
              {memory.facts.slice(-10).reverse().map((fact: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-800 last:border-0">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#14F195] to-[#0EA5E9] rounded-full mt-2"></div>
                  <p className="text-gray-300 text-sm flex-1">{fact}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Milestones */}
        {memory.growth?.milestones && memory.growth.milestones.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Milestones Unlocked</h2>
            <div className="bg-[#1a1a24] rounded-lg p-6">
              <div className="space-y-3">
                {memory.growth.milestones.slice().reverse().map((milestone: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{milestone.icon}</span>
                      <div>
                        <div className="font-medium text-gray-300">{milestone.title}</div>
                        <div className="text-xs text-gray-500">{milestone.message}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(milestone.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
