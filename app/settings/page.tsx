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
import { PersonalityAvatar } from '@/components/PersonalityAvatar'
import { 
  getUserMemory, 
  exportUserData, 
  importUserData, 
  clearMemoryCategory,
  saveUserMemory,
  type UserMemory
} from '@/lib/memory'

export default function SettingsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedPersonality, setSelectedPersonality] = useState<string>('max')
  const [responseLength, setResponseLength] = useState<'brief' | 'normal' | 'detailed'>('normal')
  const [showDataPreview, setShowDataPreview] = useState(false)
  const [dataStats, setDataStats] = useState<any>(null)
  const [showMemoryBank, setShowMemoryBank] = useState(false)
  const [userMemory, setUserMemory] = useState<UserMemory | null>(null)
  const [editingFactId, setEditingFactId] = useState<number | null>(null)
  const [editingFactText, setEditingFactText] = useState('')
  const [showAddFact, setShowAddFact] = useState(false)
  const [newFactText, setNewFactText] = useState('')
  const [newFactCategory, setNewFactCategory] = useState<'personal' | 'work' | 'relationship' | 'interest' | 'struggle' | 'goal'>('personal')

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
      setUserMemory(memory)
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

  const handleDeleteFact = (index: number) => {
    if (!currentUser || !userMemory) return
    
    if (confirm('Delete this memory?')) {
      const updatedMemory = { ...userMemory }
      updatedMemory.facts.splice(index, 1)
      saveUserMemory(updatedMemory)
      setUserMemory(updatedMemory)
      
      // Update stats
      setDataStats({
        ...dataStats,
        factsCount: updatedMemory.facts.length
      })
    }
  }

  const handleEditFact = (index: number) => {
    if (!userMemory) return
    setEditingFactId(index)
    setEditingFactText(userMemory.facts[index].fact)
  }

  const handleSaveFact = (index: number) => {
    if (!currentUser || !userMemory) return
    
    const updatedMemory = { ...userMemory }
    updatedMemory.facts[index].fact = editingFactText
    updatedMemory.facts[index].date = new Date().toISOString()
    saveUserMemory(updatedMemory)
    setUserMemory(updatedMemory)
    setEditingFactId(null)
    setEditingFactText('')
  }

  const handleCancelEdit = () => {
    setEditingFactId(null)
    setEditingFactText('')
  }

  const handleDeleteConversation = (index: number) => {
    if (!currentUser || !userMemory) return
    
    if (confirm('Delete this conversation record?')) {
      const updatedMemory = { ...userMemory }
      updatedMemory.pastConversations.splice(index, 1)
      saveUserMemory(updatedMemory)
      setUserMemory(updatedMemory)
      
      // Update stats
      setDataStats({
        ...dataStats,
        conversationsCount: updatedMemory.pastConversations.length
      })
    }
  }

  const handleAddFact = () => {
    if (!currentUser || !userMemory || !newFactText.trim()) return
    
    const updatedMemory = { ...userMemory }
    updatedMemory.facts.push({
      fact: newFactText.trim(),
      date: new Date().toISOString(),
      category: newFactCategory
    })
    saveUserMemory(updatedMemory)
    setUserMemory(updatedMemory)
    
    // Update stats
    setDataStats({
      ...dataStats,
      factsCount: updatedMemory.facts.length
    })
    
    // Reset form
    setNewFactText('')
    setNewFactCategory('personal')
    setShowAddFact(false)
  }

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
              className="text-gray-400 hover:bg-gradient-to-r hover:from-[#14F195] hover:to-[#0EA5E9] hover:bg-clip-text hover:text-transparent transition-all"
            >
              ← Back
            </button>
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
          <button
            onClick={handleExportData}
            className="text-sm px-4 py-2 bg-gradient-to-r from-[#14F195] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#14F195] rounded-lg transition-all text-gray-900"
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
                      ? 'border-[#14F195] bg-gradient-to-r from-[#14F195]/10 to-[#0EA5E9]/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <PersonalityAvatar personalityId={personality.id} size="lg" />
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold">{personality.name}</p>
                      {selectedPersonality === personality.id && (
                        <span className="text-xs px-2 py-1 bg-gradient-to-r from-[#14F195] to-[#0EA5E9] rounded-full text-gray-900">Active</span>
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
                { value: 'normal', label: 'Normal', desc: '1-3 sentences' },
                { value: 'detailed', label: 'Detailed', desc: '3-5 sentences' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleResponseLengthChange(option.value as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    responseLength === option.value
                      ? 'border-[#14F195] bg-gradient-to-r from-[#14F195]/10 to-[#0EA5E9]/10'
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
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">{dataStats.factsCount}</p>
                  <p className="text-xs text-gray-400 mt-1">Facts Learned</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">{dataStats.conversationsCount}</p>
                  <p className="text-xs text-gray-400 mt-1">Conversations</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">{dataStats.scenariosCompleted}</p>
                  <p className="text-xs text-gray-400 mt-1">Scenarios</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">{dataStats.currentStreak}</p>
                  <p className="text-xs text-gray-400 mt-1">Current Streak</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">{dataStats.longestStreak}</p>
                  <p className="text-xs text-gray-400 mt-1">Longest Streak</p>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">{dataStats.totalDays}</p>
                  <p className="text-xs text-gray-400 mt-1">Total Days</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowMemoryBank(!showMemoryBank)}
                className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-[#14F195] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#14F195] rounded-lg text-sm font-medium transition-all flex items-center justify-between text-gray-900"
              >
                <span>{showMemoryBank ? 'Hide Memory Bank' : 'View & Edit Memory Bank'}</span>
                <svg className={`w-5 h-5 transition-transform ${showMemoryBank ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}

          {/* Memory Bank - Expanded View */}
          {showMemoryBank && userMemory && (
            <div className="bg-[#1a1a24] rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Memory Bank</h3>
                <span className="text-xs text-gray-400">All memories stored locally on your device</span>
              </div>

              {/* Facts Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-300">Facts About You ({userMemory.facts.length})</h4>
                  <button
                    onClick={() => setShowAddFact(!showAddFact)}
                    className="text-xs px-3 py-1.5 bg-[#14F195] hover:bg-[#0EA5E9] text-gray-900 rounded transition-colors font-medium"
                  >
                    {showAddFact ? 'Cancel' : '+ Add Fact'}
                  </button>
                </div>
                
                {/* Add New Fact Form */}
                {showAddFact && (
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Category</label>
                      <select
                        value={newFactCategory}
                        onChange={(e) => setNewFactCategory(e.target.value as any)}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#14F195]"
                      >
                        <option value="personal">Personal</option>
                        <option value="relationship">Relationship</option>
                        <option value="work">Work</option>
                        <option value="interest">Interest</option>
                        <option value="struggle">Struggle</option>
                        <option value="goal">Goal</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Fact</label>
                      <textarea
                        value={newFactText}
                        onChange={(e) => setNewFactText(e.target.value)}
                        placeholder="e.g., I have a girlfriend, I work as a developer, I love playing guitar..."
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-[#14F195]"
                        rows={2}
                      />
                    </div>
                    <button
                      onClick={handleAddFact}
                      disabled={!newFactText.trim()}
                      className="w-full px-4 py-2 bg-gradient-to-r from-[#14F195] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#14F195] rounded text-sm font-medium transition-all text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Memory Bank
                    </button>
                  </div>
                )}
                
                {userMemory.facts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <p>No facts stored yet.</p>
                    <p className="text-xs mt-2">Start chatting and the AI will learn about you!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userMemory.facts.map((fact, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            {editingFactId === index ? (
                              <textarea
                                value={editingFactText}
                                onChange={(e) => setEditingFactText(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-[#14F195]"
                                rows={2}
                                autoFocus
                              />
                            ) : (
                              <>
                                <p className="text-sm">{fact.fact}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                  <span className="px-2 py-0.5 bg-gray-700 rounded">{fact.category}</span>
                                  <span>{new Date(fact.date).toLocaleDateString()}</span>
                                </div>
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {editingFactId === index ? (
                              <>
                                <button
                                  onClick={() => handleSaveFact(index)}
                                  className="p-1.5 bg-green-600 hover:bg-green-500 rounded transition-colors"
                                  title="Save"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-1.5 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                                  title="Cancel"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditFact(index)}
                                  className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                                  title="Edit"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteFact(index)}
                                  className="p-1.5 bg-red-900/50 hover:bg-red-900 rounded transition-colors"
                                  title="Delete"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Conversations Section */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-300">Recent Conversations ({userMemory.pastConversations.length})</h4>
                </div>
                
                {userMemory.pastConversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <p>No conversations recorded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userMemory.pastConversations.slice().reverse().map((conv, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm">{conv.topic}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span className="px-2 py-0.5 bg-gray-700 rounded">{conv.mode}</span>
                              {conv.emotion && <span className="px-2 py-0.5 bg-gray-700 rounded">{conv.emotion}</span>}
                              {conv.outcome && <span className="px-2 py-0.5 bg-gray-700 rounded">{conv.outcome}</span>}
                              <span>{new Date(conv.date).toLocaleDateString()} {new Date(conv.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteConversation(userMemory.pastConversations.length - 1 - index)}
                            className="p-1.5 bg-red-900/50 hover:bg-red-900 rounded transition-colors flex-shrink-0"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
              className="w-full px-4 py-3 bg-gradient-to-r from-[#14F195] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#14F195] rounded-lg text-sm font-medium transition-all flex items-center justify-between text-gray-900"
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
