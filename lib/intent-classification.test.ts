/**
 * Intent Classification Test Suite
 * 
 * Test cases to verify intent detection accuracy
 */

import { classifyIntent } from './intent-classification'

// Test messages for each intent type
const testCases = [
  // PRACTICE intent
  {
    message: "I have a job interview tomorrow and I'm not sure what to say",
    expected: 'practice',
    description: 'Job interview preparation'
  },
  {
    message: "Can we practice small talk? I'm going to a party tonight",
    expected: 'practice',
    description: 'Social practice request'
  },
  {
    message: "Help me prepare for a difficult conversation with my boss",
    expected: 'practice',
    description: 'Rehearsal request'
  },
  
  // VENT intent
  {
    message: "I'm so frustrated with my coworker!!! They never listen and it's driving me crazy",
    expected: 'vent',
    description: 'Frustration with intensity'
  },
  {
    message: "Ugh I just need to vent. My family is exhausting and I can't deal with them anymore",
    expected: 'vent',
    description: 'Explicit venting'
  },
  {
    message: "I'm so tired of everything. Work is overwhelming, my relationship is stressful, and I just feel like I can't catch a break. Everything feels like too much right now.",
    expected: 'vent',
    description: 'Long emotional message'
  },
  
  // COACHING intent
  {
    message: "Should I quit my job? I'm not sure if it's the right move",
    expected: 'coaching',
    description: 'Decision question'
  },
  {
    message: "I'm trying to decide between staying in my current relationship or ending it. I'm really confused",
    expected: 'coaching',
    description: 'Relationship decision'
  },
  {
    message: "Help me think through whether I should move to a new city for this opportunity",
    expected: 'coaching',
    description: 'Life decision'
  },
  
  // CHAT intent
  {
    message: "Hey, how's it going?",
    expected: 'chat',
    description: 'Casual greeting'
  },
  {
    message: "Just checking in. What do you think about meditation?",
    expected: 'chat',
    description: 'General conversation'
  }
]

// Run tests
console.log('🧪 INTENT CLASSIFICATION TEST SUITE\n')

let passed = 0
let failed = 0

testCases.forEach((test, index) => {
  const result = classifyIntent(test.message)
  const success = result.primaryIntent === test.expected
  
  if (success) {
    passed++
    console.log(`✅ Test ${index + 1}: ${test.description}`)
  } else {
    failed++
    console.log(`❌ Test ${index + 1}: ${test.description}`)
    console.log(`   Expected: ${test.expected}`)
    console.log(`   Got: ${result.primaryIntent} (${Math.round(result.confidence * 100)}% confidence)`)
    console.log(`   Signals: ${result.signals.join(', ')}`)
  }
})

console.log(`\n📊 Results: ${passed}/${testCases.length} passed`)
console.log(`Success rate: ${Math.round((passed / testCases.length) * 100)}%`)

// Export for use in other test files
export { testCases }
