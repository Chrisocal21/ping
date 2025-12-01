# AI Scenario Intelligence System

## Overview

This system makes Ping's AI **learn, adapt, and become smarter** the more you use it. Instead of 50 static scenarios, the AI now:

1. **Learns your patterns** - Tracks what works for you
2. **Uses algorithms** - Generates variations and adapts difficulty
3. **Understands context** - Interprets what you need from your messages
4. **Grows infinitely** - Can create unlimited scenario variations

---

## 🧠 How It Works

### 1. **Learning System**

The AI tracks every scenario you complete:

```typescript
ScenarioPattern {
  userPreferences: {
    difficultySweetSpot: 2        // Your comfort zone (1-5)
    preferredCategories: []        // What you practice most
    avoidedTones: []               // Tones you never pick
    successfulTones: ['curious']   // Your go-to communication style
  }
  performanceHistory: [
    { scenarioId, chosenTone, difficulty, timestamp, feltSuccessful }
  ]
  skillGaps: []       // What you haven't practiced
  masteredSkills: []  // What you're good at
}
```

**What It Learns:**
- Which communication style you prefer (safe, curious, playful, bold)
- What difficulty level challenges you without overwhelming
- Which scenario categories you gravitate toward
- How you're growing over time

**Example:**
- You complete 20 scenarios
- 15 times you choose "curious" responses
- AI learns: *"You build connections through genuine interest"*
- Next scenarios emphasize question-asking and engagement skills

---

### 2. **Scenario Variation Algorithm**

Instead of being stuck with 50 scenarios, the AI generates **unlimited variations**:

#### **Location Swapping**
```typescript
Original: "Coffee shop - someone comments on the long line"
Variation: "Bookstore - someone comments on the long line"
```

#### **Relationship Swapping**
```typescript
Original: "Your coworker takes credit for your idea"
Variation: "Your classmate takes credit for your idea"
```

#### **Context Adding**
```typescript
Original: "Elevator small talk with neighbor"
Variation: "Elevator small talk with neighbor (You're running late)"
// Adds pressure, increases difficulty
```

#### **Stakes Adjustment**
```typescript
- Lower stakes: Casual settings, low-pressure
- Higher stakes: Professional settings, authority figures
```

**Result:** Every base scenario becomes 4+ variations = **200+ scenarios** from just 50 templates

---

### 3. **Context Understanding Algorithm**

The AI **understands what you're asking for** from natural language:

#### **Keyword Detection:**
```typescript
User: "I need help with work conversations"
AI detects: 
  - Category: 'professional'
  - Keywords: ['work', 'conversations']
  - Difficulty: 2 (default for work scenarios)
```

#### **Emotion-Based Selection:**
```typescript
User: "Give me something easy, I'm anxious today"
AI detects:
  - Category: 'anxiety_friendly'
  - Difficulty: 1 (lowest)
  - Reasoning: User needs low-pressure practice
```

#### **Growth-Based Adaptation:**
```typescript
User completes 10 scenarios at difficulty 2 with success
AI adapts:
  - "You're doing great! Ready for difficulty 3?"
  - Gradually increases challenge
```

---

### 4. **Smart Recommendation System**

The AI **decides what you need next** based on:

#### **Emotional State**
```typescript
if (userIsAnxious) {
  recommend: anxiety_friendly category
  difficulty: lower than usual
  reasoning: "You seem overwhelmed. Let's practice something low-pressure."
}
```

#### **Performance Streak**
```typescript
if (lastTenScenariosWereSuccessful) {
  recommend: increase difficulty by 1
  reasoning: "You're crushing it! Want to try something harder?"
}
```

#### **Variety Balance**
```typescript
if (onlyPracticedEverydayScenarios) {
  recommend: professional or relationships
  reasoning: "Let's practice something different to build diverse skills."
}
```

#### **Tone Expansion**
```typescript
if (alwaysChoosesSafe) {
  suggest: try curious or playful
  reasoning: "Challenge yourself with a curious response sometime"
}
```

---

## 🎯 Real-World Examples

### Example 1: First-Time User

**Session 1:**
- User: "I want to practice conversations"
- AI: Shows everyday scenario, difficulty 2
- User: Chooses "safe" response
- **AI learns:** User is cautious, needs confidence building

**Session 5:**
- AI: Notices user consistently chooses "safe"
- AI: Suggests difficulty 1 to build foundation
- **AI learns:** User's sweet spot is level 1-2

**Session 20:**
- AI: Detects 15/20 choices were "curious"
- AI: "Your style: Engaged Conversationalist"
- AI: Recommends more question-based scenarios
- **AI learns:** User has shifted from cautious to engaged

---

### Example 2: Advanced User

**Session 50:**
- AI: "You've completed 50 scenarios!"
- AI: Shows intelligence report:
  ```
  Your Style: Lighthearted Connector (playful responses 60%)
  Sweet Spot: Level 3-4 difficulty
  Growth: Increasing confidence
  Recommendation: Try some difficult conversations
  ```

**Session 75:**
- User: "Give me something with confrontation"
- AI detects: difficult category requested
- AI: Loads "difficult_003" with higher stakes variation
- **AI learns:** User is ready for challenging scenarios

---

### Example 3: Context Understanding

**User Messages:**

```typescript
"I have a work meeting tomorrow" 
→ AI loads professional scenario

"Something about making friends"
→ AI loads relationships/everyday mix

"Easy one please, rough day"
→ AI loads anxiety_friendly, difficulty 1

"How am I doing?"
→ AI shows personalized intelligence report
```

---

## 📊 Intelligence Report

Users can ask **"How am I doing?"** to see:

```
📊 Scenario Intelligence Report

Scenarios Completed: 42
Your Style: Engaged Conversationalist - You build connections through genuine interest
Growth: Increasing confidence - you're tackling harder scenarios
Sweet Spot Difficulty: Level 3/5

Your Go-To Tones: curious, playful

Recommendations:
• Try experimenting with bold responses
• Challenge yourself with difficult conversations
• Keep up the great work!
```

---

## 🔬 Algorithms in Detail

### **Difficulty Adaptation Algorithm**

```typescript
function adaptScenarioDifficulty(userId, lastChoices) {
  const lastFive = getLastFiveChoices(userId)
  
  if (80% are 'safe') {
    return currentDifficulty - 1  // Make it easier
  }
  
  if (80% are 'bold' or 'playful') {
    return currentDifficulty + 1  // Make it harder
  }
  
  return currentDifficulty  // Keep steady
}
```

### **Pattern Recognition Algorithm**

```typescript
function identifyPatterns(userId) {
  const history = getUserHistory(userId)
  
  // Analyze tone distribution
  toneCount = countEachTone(history)
  dominantTone = mostFrequentTone(toneCount)
  
  // Analyze growth trajectory
  firstHalf = history[0...50%]
  secondHalf = history[50%...100%]
  
  if (secondHalf.avgDifficulty > firstHalf.avgDifficulty) {
    return "Increasing confidence"
  } else {
    return "Focusing on fundamentals"
  }
}
```

### **Smart Recommendation Algorithm**

```typescript
function recommendNextScenario(userId) {
  learning = getUserLearning(userId)
  emotionalState = getCurrentEmotionalState(userId)
  
  // Priority 1: Emotional state
  if (emotionalState === 'anxious') {
    return { 
      category: 'anxiety_friendly', 
      difficulty: low,
      reasoning: "Low-pressure practice for today"
    }
  }
  
  // Priority 2: Performance streak
  recentSuccesses = countRecentSuccesses(10)
  if (recentSuccesses >= 8) {
    return { 
      category: preferredCategory,
      difficulty: current + 1,
      reasoning: "You're crushing it! Try something harder?"
    }
  }
  
  // Priority 3: Variety
  recentCategories = getRecentCategories(10)
  underPracticed = findUnderPracticedCategories(recentCategories)
  
  return {
    category: underPracticed[0],
    difficulty: sweetSpot,
    reasoning: "Let's practice something different"
  }
}
```

---

## 💾 Data Tracking

### **localStorage Keys:**

```typescript
`ping_scenario_learning_${userId}`  // Main learning data
{
  userPreferences: {...},
  performanceHistory: [...],
  skillGaps: [...],
  masteredSkills: [...]
}
```

### **What's Tracked:**

✅ Every scenario you complete
✅ Which response tone you chose
✅ Difficulty level of scenario
✅ Timestamp of completion
✅ Your preferred categories
✅ Your avoided tones
✅ Your communication style evolution

### **Privacy:**

- All data stored locally (no server)
- Last 100 scenarios kept (auto-cleanup)
- Can clear data anytime
- Portable via export/import

---

## 🚀 How To Use

### **See Your Intelligence Report:**

In chat, type:
- `"How am I doing?"`
- `"Show my progress"`
- `"My stats"`

### **Request Specific Scenarios:**

```
"Give me a work scenario"          → professional category
"Something about making friends"   → relationships category
"Easy practice please"             → difficulty 1
"Challenge me"                     → difficulty increases
"Something with confrontation"     → difficult category
```

### **Natural Conversation:**

```
User: "I have a job interview tomorrow"
AI: Detects 'job interview' → loads professional scenario
AI: "Want to practice interview conversations?"
```

---

## 📈 Growth Tracking

### **Beginner (0-10 scenarios)**
- Learning your style
- Building comfort with practice
- Starting at difficulty 1-2

### **Developing (10-30 scenarios)**
- AI identifies your communication style
- Recommendations become personalized
- Difficulty adapts to your growth

### **Confident (30-50 scenarios)**
- Clear pattern recognition
- Smart category suggestions
- Variety and challenge balance

### **Advanced (50+ scenarios)**
- Mastered skills tracked
- Difficult scenarios recommended
- Growth trajectory analysis

---

## 🎮 Future Enhancements

### **Phase 1 (Current):** ✅
- Learning system tracking
- Scenario variation generation
- Context understanding
- Smart recommendations

### **Phase 2 (Next):**
- AI-generated custom scenarios from user's real situations
- Voice-based scenario practice
- Multiplayer practice with friends
- Scenario replay with different choices

### **Phase 3 (Future):**
- Situation-specific training (e.g., "I have a party Friday")
- Post-interaction debriefs (analyze real conversations)
- Video scenario demonstrations
- AR practice in real environments

---

## 🧪 Testing The System

### **Test Learning:**
1. Complete 5 scenarios, always choose "safe"
2. Ask "How am I doing?"
3. See: "Cautious Communicator" style
4. Complete 5 more, choose "curious"
5. Ask again
6. See: Style shifts to "Engaged Conversationalist"

### **Test Context Understanding:**
1. Type: "Give me something about work"
2. Get professional scenario
3. Type: "Something easier"
4. Get lower difficulty scenario
5. Type: "How's my progress?"
6. Get personalized intelligence report

### **Test Adaptation:**
1. Complete 10 scenarios at difficulty 2
2. Choose bold/playful responses
3. Next scenario: difficulty automatically increases to 3
4. AI: "You're crushing it! Try this harder one"

---

## 📁 Files Created

### **lib/scenario-intelligence.ts** (531 lines)
- Learning system
- Variation algorithms
- Context understanding
- Smart recommendations
- Pattern recognition
- Intelligence reporting

### **Updated: app/chat/page.tsx**
- Integrated learning tracking
- Smart scenario selection
- Context-aware responses
- Progress commands

---

## 🎯 Impact

**Before:** 50 static scenarios, random selection, no learning

**After:**
- ♾️ Infinite scenario variations
- 🧠 Learns your communication style
- 🎯 Adapts difficulty to your growth
- 💬 Understands natural language requests
- 📊 Tracks progress and patterns
- 🚀 Gets smarter with every interaction

---

*Built: December 1, 2025*
*Status: ✅ Complete and integrated*
*"An AI that actually learns from you"*
