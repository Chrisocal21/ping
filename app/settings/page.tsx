'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, logout } from '@/lib/auth'
import { 
  getAllPersonalities, 
  getPersonality, 
  savePersonalityPreference, 
  getPersonalityPreference 
} from '@/lib/personalities'
import { 
  getUserMemory, 
  exportUserData, 
  importUserData, 
  clearMemoryCategory 
} from '@/lib/memory'

export default function SettingsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedPersonality, setSelectedPersonality] = useState<string>('max')
  const [responseLength, setResponseLength] = useState<'brief' | 'normal' | 'detailed'>('normal')
  const [showDataPreview, setShowDataPreview] = useState(false)
  const [dataStats, setDataStats] = useState<any>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    setCurrentUser(user)
    
    // Load preferences
    const preferredPersonality = getPersonalityPreference(user.username)
    setSelectedPersonality(preferredPersonality)
    
    const storedLength = localStorage.getItem(`ping_responseLength_${user.username}`)
    if (storedLength) {
      setResponseLength(storedLength as 'brief' | 'normal' | 'detailed')
    }
    
    // Load data stats
    const memory = getUserMemory(user.username)
    if (memory) {
      setDataStats({
        factsCount: memory.facts.length,
        conversationsCount: memory.pastConversations.length,
        scenariosCompleted: memory.growth.scenariosCompleted,
        currentStreak: memory.growth.streakDays,
        longestStreak: memory.growth.streakDays, // Using same for now
        totalDays: memory.pastConversations.length,
      })
    }
  }, [router])

  const handlePersonalityChange = (personalityId: string) => {
    setSelectedPersonality(personalityId)
    if (currentUser) {
      savePersonalityPreference(currentUser.username, personalityId)
    }
  }

  const handleResponseLengthChange = (length: 'brief' | 'normal' | 'detailed') => {
    setResponseLength(length)
    if (currentUser) {
      localStorage.setItem(`ping_responseLength_${currentUser.username}`, length)
    }
  }

  const handleExportData = () => {
    if (!currentUser) return
    
    const data = exportUserData(currentUser.username)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ping-data-${currentUser.username}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser) return
    
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const success = importUserData(currentUser.username, content)
      if (success) {
        alert('Data imported successfully!')
        window.location.reload()
      } else {
        alert('Failed to import data. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  const handleClearCategory = (category: 'facts' | 'conversations' | 'all') => {
    if (!currentUser) return
    
    const confirmMsg = `Are you sure you want to clear all ${category}? This cannot be undone.`
    if (confirm(confirmMsg)) {
      clearMemoryCategory(currentUser.username, category)
      alert(`${category} cleared successfully.`)
      window.location.reload()
    }
  }

  const handleClearAllData = () => {
    if (!currentUser) return
    
    const confirmMsg = 'Are you ABSOLUTELY sure you want to delete ALL your data? This cannot be undone.'
    if (confirm(confirmMsg)) {
      // Clear all localStorage keys for this user
      const keysToDelete = [
        `ping_memory_${currentUser.username}`,
        `ping_emotions_${currentUser.username}`,
        `ping_frameworks_${currentUser.username}`,
        `ping_scenario_learning_${currentUser.username}`,
        `ping_sessions_${currentUser.username}`,
        `ping_personality_${currentUser.username}`,
        `ping_responseLength_${currentUser.username}`,
      ]
      
      keysToDelete.forEach(key => localStorage.removeItem(key))
      alert('All data deleted. You will be logged out.')
      logout()
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/chat')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
          <button
            onClick={handleExportData}
            className="text-sm px-4 py-2 bg-user-bubble hover:bg-user-bubble/80 rounded-lg transition-colors"
          >
            Export Data
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* AI Preferences Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-300">AI Preferences</h2>
          
          {/* Personality Selection */}
          <div className="bg-[#1a1a24] rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-medium mb-2">Preferred AI Personality</h3>
              <p className="text-sm text-gray-400 mb-4">
                Choose which AI companion you'd like to chat with by default.
              </p>
            </div>
            
            <div className="space-y-3">
              {getAllPersonalities().map((personality) => (
                <button
                  key={personality.id}
                  onClick={() => handlePersonalityChange(personality.id)}
                  className={`w-full flex items-start space-x-4 p-4 rounded-lg border-2 transition-all ${
                    selectedPersonality === personality.id
                      ? 'border-user-bubble bg-user-bubble/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="text-3xl flex-shrink-0">{personality.emoji}</div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold">{personality.name}</p>
                      {selectedPersonality === personality.id && (
                        <span className="text-xs px-2 py-1 bg-user-bubble rounded-full">Active</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{personality.tagline}</p>
                    <div className="flex flex-wrap gap-2">
                      {personality.specialties.map((specialty, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-300">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Response Length */}
          <div className="bg-[#1a1a24] rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-medium mb-2">Response Length</h3>
              <p className="text-sm text-gray-400 mb-4">
                How detailed should AI responses be?
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'brief', label: 'Brief', desc: '1-2 sentences' },
                { value: 'normal', label: 'Normal', desc: '2-4 sentences' },
                { value: 'detailed', label: 'Detailed', desc: '4-6 sentences' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleResponseLengthChange(option.value as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    responseLength === option.value
                      ? 'border-user-bubble bg-user-bubble/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <p className="font-medium mb-1">{option.label}</p>
                  <p className="text-xs text-gray-400">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy & Data Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-300">Privacy & Data</h2>
          
          {/* Data Overview */}
          {dataStats && (
            <div className="bg-[#1a1a24] rounded-lg p-6 space-y-4">
              <h3 className="font-medium mb-4">Your Data</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-user-bubble">{dataStats.factsCount}</p>
                  <p className="text-xs text-gray-400 mt-1">Facts Learned</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-user-bubble">{dataStats.conversationsCount}</p>
                  <p className="text-xs text-gray-400 mt-1">Conversations</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-user-bubble">{dataStats.scenariosCompleted}</p>
                  <p className="text-xs text-gray-400 mt-1">Scenarios</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-user-bubble">{dataStats.currentStreak}</p>
                  <p className="text-xs text-gray-400 mt-1">Current Streak</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-user-bubble">{dataStats.longestStreak}</p>
                  <p className="text-xs text-gray-400 mt-1">Longest Streak</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-user-bubble">{dataStats.totalDays}</p>
                  <p className="text-xs text-gray-400 mt-1">Total Days</p>
                </div>
              </div>
            </div>
          )}

          {/* Data Management */}
          <div className="bg-[#1a1a24] rounded-lg p-6 space-y-4">
            <h3 className="font-medium mb-4">Data Management</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Export Your Data</p>
                  <p className="text-xs text-gray-400 mt-1">Download all your data as JSON</p>
                </div>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                >
                  Download
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Import Data</p>
                  <p className="text-xs text-gray-400 mt-1">Restore from a previous export</p>
                </div>
                <label className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors cursor-pointer">
                  Upload
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Clear Facts</p>
                  <p className="text-xs text-gray-400 mt-1">Remove all learned facts about you</p>
                </div>
                <button
                  onClick={() => handleClearCategory('facts')}
                  className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg text-sm transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Clear Conversations</p>
                  <p className="text-xs text-gray-400 mt-1">Delete conversation history</p>
                </div>
                <button
                  onClick={() => handleClearCategory('conversations')}
                  className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg text-sm transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-red-300">Delete All Data</p>
                  <p className="text-xs text-gray-400 mt-1">Permanently delete everything (cannot be undone)</p>
                </div>
                <button
                  onClick={handleClearAllData}
                  className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded-lg text-sm transition-colors"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Info */}
          <div className="bg-[#1a1a24] rounded-lg p-6">
            <h3 className="font-medium mb-3">Privacy Information</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• All data is stored locally on your device</p>
              <p>• No data is sent to external servers (except OpenAI for AI responses)</p>
              <p>• OpenAI does not store conversation data per their API policy</p>
              <p>• You can export or delete your data at any time</p>
              <p>• No tracking, analytics, or third-party scripts</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-300">About This App</h2>
          
          <div className="bg-[#1a1a24] rounded-lg p-6 space-y-4">
            <div className="space-y-3 text-sm text-gray-400">
              <p>
                <strong className="text-white">Ping</strong> is your AI companion for practicing social skills, 
                venting safely, and thinking through decisions without judgment.
              </p>
              <p>
                Built with privacy-first design, all your data stays on your device. 
                The AI learns from your conversations to provide personalized support.
              </p>
            </div>
            
            <button
              onClick={() => router.push('/about')}
              className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-between"
            >
              <span>How It Works</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <p className="text-xs pt-2 border-t border-gray-700 text-gray-500">
              Version 1.0.0 • December 2025 • Made with ❤️
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
