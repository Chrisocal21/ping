# Testing Guide for Ping

## Pre-Testing Setup

### Environment
- [ ] `.env.local` file contains valid `OPENAI_API_KEY`
- [ ] Run `npm install` to install dependencies
- [ ] Run `npm run dev` to start development server
- [ ] Open `http://localhost:3000` in browser

### Test Accounts
Create test users during testing:
- `testuser1` / `password123`
- `testuser2` / `password123`

---

## Core Feature Testing

### 1. Authentication Flow
- [ ] Landing page loads correctly
- [ ] Can create new account
- [ ] Can log in with existing account
- [ ] Can log out
- [ ] Session persists on page refresh
- [ ] Redirect to login when accessing protected routes

### 2. First-Time User Experience
- [ ] Onboarding modal appears for new users
- [ ] Can select personality (Max, Jamie, Sage, Riley)
- [ ] Modal doesn't appear on subsequent visits
- [ ] Welcome message appears in chat after onboarding

### 3. Personality System
**Test each personality:**

**Max (Thoughtful Listener)**
- [ ] Greeting feels thoughtful and gentle
- [ ] Responses are warm but not overly enthusiastic
- [ ] Questions feel curious and exploratory
- [ ] Tone matches: "I'm here to help"

**Jamie (Warm Encourager)**
- [ ] Greeting is energetic and encouraging
- [ ] Responses include supportive language
- [ ] Uses phrases like "You've got this!"
- [ ] Tone matches: Cheerleader energy

**Sage (Calm Guide)**
- [ ] Greeting is peaceful and centered
- [ ] Responses feel wise and measured
- [ ] Uses reflective language
- [ ] Tone matches: Meditation instructor vibe

**Riley (Direct Ally)**
- [ ] Greeting is straightforward and honest
- [ ] Responses are punchy and practical
- [ ] No fluff, gets to the point
- [ ] Tone matches: Straight-shooting friend

### 4. Conversation Modes

**Chat Mode**
- [ ] Default mode works
- [ ] Casual conversation flows naturally
- [ ] AI asks follow-up questions
- [ ] Can talk about any topic

**Practice Mode**
- [ ] Can request practice scenarios
- [ ] Scenario card displays with options
- [ ] Can select different response tones
- [ ] Receives feedback after selection
- [ ] Can request another scenario

**Vent Mode**
- [ ] AI listens and validates feelings
- [ ] Empathetic responses
- [ ] Doesn't try to "fix" immediately
- [ ] Asks supportive questions

**Coaching Mode**
- [ ] AI helps think through decisions
- [ ] Suggests frameworks when appropriate
- [ ] Asks clarifying questions
- [ ] Helps explore options

### 5. Intent Classification (Automatic)
- [ ] Typing about interview → Auto-detects practice intent
- [ ] Typing "I'm so frustrated" → Auto-detects vent intent
- [ ] Typing "should I quit?" → Auto-detects coaching intent
- [ ] Console shows detected intent with confidence

### 6. Follow-Up Questions
- [ ] After AI response, 2-3 follow-up questions appear
- [ ] Questions are relevant to conversation
- [ ] Can click to auto-send
- [ ] Questions disappear when typing own message
- [ ] Questions adapt to personality style

### 7. Response Length Control
- [ ] Can change setting in Settings page
- [ ] Brief mode: 1-2 sentences
- [ ] Normal mode: 1-3 sentences (default)
- [ ] Detailed mode: 3-5 sentences
- [ ] Setting persists across sessions

### 8. Fallback Responses
Test with these inputs:
- [ ] Empty message → Gets fallback
- [ ] "k" → Gets fallback (too short)
- [ ] "asdfghjkl" → Gets fallback (gibberish)
- [ ] "test" → Gets fallback (testing)
- [ ] "how do you work?" → Gets fallback (meta question)
- [ ] Sending same message 3 times → Gets fallback (repetition)

### 9. Crisis Detection & Validation

**High-Risk Keywords** (test carefully, use hypotheticals):
- [ ] "I want to hurt myself" → Crisis detected
- [ ] AI responds with empathy FIRST
- [ ] Resources shown after meaningful engagement
- [ ] Multiple crisis resources listed
- [ ] Crisis detection logged in console

**Medium-Risk Scenarios:**
- [ ] "I'm having a panic attack" → Detects severe distress
- [ ] AI validates before resources
- [ ] Resource offer appears (not forced)

**Validation System:**
- [ ] First crisis message gets validated response
- [ ] Resources only show after AI engages properly
- [ ] Generic responses don't trigger resource display

### 10. Context Window Optimization
Test with long conversations (20+ messages):
- [ ] Conversation doesn't crash
- [ ] AI maintains context of recent messages
- [ ] Console shows optimization logs for 3500+ tokens
- [ ] Important facts preserved in summaries

### 11. Conversation History
- [ ] Messages persist after page refresh
- [ ] Can view past conversations in sidebar
- [ ] Conversations grouped by date (Today, Yesterday, This Week, Older)
- [ ] Can switch between conversations
- [ ] Each personality has separate conversation history
- [ ] Starting new chat creates new conversation

### 12. Insights Dashboard
Navigate to `/insights`:
- [ ] Overview stats display (conversations, facts, streak, scenarios)
- [ ] Emotional patterns chart shows data
- [ ] Top recurring themes listed
- [ ] Skills practice breakdown
- [ ] Coaching frameworks used
- [ ] Facts remembered displayed
- [ ] Growth milestones shown
- [ ] Loading spinner appears briefly

### 13. Settings Page
Navigate to `/settings`:
- [ ] Can change response length (Brief, Normal, Detailed)
- [ ] Setting saves immediately
- [ ] Personality preference displayed
- [ ] User info displayed correctly

### 14. About Page
Navigate to `/about`:
- [ ] Page loads without errors
- [ ] All sections display correctly
- [ ] SVG icons render properly
- [ ] Crisis resources listed clearly
- [ ] No emoji inconsistencies

---

## Error Handling Testing

### API Errors
**Simulate by disconnecting internet:**
- [ ] Shows user-friendly error message
- [ ] Error message has "Try Again" button
- [ ] Retry works when connection restored
- [ ] No console errors beyond expected

**Simulate by entering invalid API key:**
- [ ] Shows configuration error
- [ ] Doesn't expose API key info
- [ ] Error logged in console

### Network Issues
- [ ] Slow connection: Shows typing indicator
- [ ] Timeout: Shows timeout error after 30 seconds
- [ ] Connection lost mid-message: Graceful error

### React Errors
**Trigger by:**
- [ ] Error boundary catches and displays fallback UI
- [ ] "Go to Chat" button works
- [ ] "Reload Page" button works
- [ ] Error details shown in dev mode only

---

## Performance Testing

### Load Time
- [ ] Initial page load < 2 seconds (on fast connection)
- [ ] Chat page loads quickly
- [ ] Insights page loads quickly
- [ ] No janky animations or lag

### Message Rendering
- [ ] Sending message feels instant
- [ ] AI typing indicator appears smoothly
- [ ] Long conversations (50+ messages) don't lag
- [ ] Scroll to bottom works smoothly

### Memory
- [ ] Open dev tools → Performance tab
- [ ] Use app for 5+ minutes
- [ ] No memory leaks detected
- [ ] Console warnings minimal

---

## Mobile Responsiveness

Test on mobile viewport (Chrome DevTools → Toggle Device Toolbar):

### iPhone SE (375px)
- [ ] Header displays correctly
- [ ] Messages readable and properly sized
- [ ] Input area accessible
- [ ] Onboarding modal fits screen
- [ ] Settings page usable
- [ ] Insights page scrollable

### iPad (768px)
- [ ] Layout adapts properly
- [ ] Sidebar displays correctly
- [ ] All functionality works
- [ ] Touch interactions smooth

---

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Can tab through all interactive elements
- [ ] Enter key sends message
- [ ] Escape key closes modals
- [ ] Focus indicators visible

### Screen Reader (Basic)
- [ ] Turn on screen reader (VoiceOver, NVDA)
- [ ] Navigate through chat interface
- [ ] Messages announced clearly
- [ ] Buttons have proper labels

### Color Contrast
- [ ] Text readable on all backgrounds
- [ ] Brand gradient text legible (dark text on gradient)
- [ ] Error messages clearly visible

---

## Edge Cases

### Unusual Inputs
- [ ] Very long message (1000+ words) → Handles gracefully
- [ ] Emoji spam (😀😀😀😀😀) → Fallback response
- [ ] Special characters (@#$%^&*) → Processes normally
- [ ] URL in message → Displays correctly
- [ ] Code block in message → Preserves formatting

### Multiple Bubbles
- [ ] AI response with double line breaks → Shows as separate bubbles
- [ ] Max 2 bubbles displayed
- [ ] Timing between bubbles feels natural

### Rapid Actions
- [ ] Sending multiple messages quickly → Queues and processes
- [ ] Switching personalities mid-conversation → Clears and restarts
- [ ] Clicking follow-up question multiple times → Only sends once

---

## Data Persistence

### LocalStorage
- [ ] Open DevTools → Application → Local Storage
- [ ] Verify user data saved correctly
- [ ] Verify conversation history saved
- [ ] Verify preferences saved

### Clear Data Test
- [ ] Clear localStorage
- [ ] Refresh page
- [ ] Onboarding appears again
- [ ] New conversation starts fresh

---

## Console Errors

Throughout all testing:
- [ ] No unexpected console errors
- [ ] No React warnings in production build
- [ ] Expected logs only (intent detection, optimization, crisis detection)

---

## Production Build Testing

```bash
npm run build
npm start
```

- [ ] Build completes without errors
- [ ] Production build runs correctly
- [ ] Console logs removed (except errors/warnings)
- [ ] Performance improved over dev mode
- [ ] All features work in production

---

## Beta Tester Checklist

### Pre-Beta
- [ ] All critical bugs fixed
- [ ] Performance acceptable
- [ ] No crash-causing errors
- [ ] Core features stable

### Beta Instructions for Testers
1. Create account
2. Complete onboarding
3. Try each personality
4. Have at least 3 conversations
5. Test crisis detection (carefully)
6. Report any issues

### Feedback Collection
- [ ] Create feedback form (Google Forms, Typeform)
- [ ] Ask about: usability, AI quality, performance, bugs
- [ ] Track: completion rate, session length, feature usage

---

## Known Issues / Future Work

Document any issues found during testing:
- [ ] List known bugs that aren't critical
- [ ] List planned features not yet implemented
- [ ] List browser/device specific issues
- [ ] List performance bottlenecks

---

## Sign-Off Checklist

Before marking "Internal Team Testing" complete:
- [ ] All critical features tested
- [ ] No crash-causing bugs
- [ ] Performance acceptable
- [ ] Mobile experience acceptable
- [ ] Error handling works
- [ ] Ready for beta testers

Before marking "Friends & Family Beta" complete:
- [ ] 5+ people tested the app
- [ ] Feedback collected and reviewed
- [ ] Critical issues from beta fixed
- [ ] Ready for wider release
