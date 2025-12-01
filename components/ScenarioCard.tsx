'use client'

import { Scenario, ScenarioOption, getToneColor, getToneDescription } from '@/lib/scenarios'

interface ScenarioCardProps {
  scenario: Scenario
  onOptionSelect: (option: ScenarioOption) => void
}

export default function ScenarioCard({ scenario, onOptionSelect }: ScenarioCardProps) {
  return (
    <div className="bg-ai-bubble rounded-2xl p-5 space-y-4 border border-gray-700">
      {/* Scenario Setup */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
            {scenario.category.replace('_', ' ')}
          </span>
          <span className="text-xs text-gray-500">
            Difficulty: {'⭐'.repeat(scenario.difficulty)}
          </span>
        </div>
        <p className="text-white text-[15px] leading-relaxed">
          {scenario.aiPrompt}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {scenario.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onOptionSelect(option)}
            className="w-full text-left p-4 rounded-xl bg-background hover:bg-gray-800 transition-all border border-gray-700 hover:border-gray-600 group"
            style={{
              borderLeftWidth: '4px',
              borderLeftColor: getToneColor(option.tone),
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-white text-[15px] group-hover:text-blue-400 transition-colors">
                  {option.text}
                </p>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {option.tone} response
                </p>
              </div>
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                style={{ backgroundColor: getToneColor(option.tone) }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Tone Legend */}
      <div className="pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 mb-2">Response styles:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getToneColor('safe') }} />
            <span className="text-gray-400">Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getToneColor('curious') }} />
            <span className="text-gray-400">Curious</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getToneColor('playful') }} />
            <span className="text-gray-400">Playful</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getToneColor('bold') }} />
            <span className="text-gray-400">Bold</span>
          </div>
        </div>
      </div>
    </div>
  )
}
