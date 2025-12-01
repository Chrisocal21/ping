// Social practice scenario types and data

export type ToneType = 'safe' | 'curious' | 'playful' | 'bold'
export type ScenarioCategory = 'everyday' | 'professional' | 'relationships' | 'difficult' | 'anxiety_friendly'

export interface ScenarioOption {
  text: string
  tone: ToneType
  response: string
  insight?: string // Optional micro-lesson
  skill: string // Hidden skill being practiced
}

export interface Scenario {
  id: string
  category: ScenarioCategory
  setup: string
  aiPrompt: string
  options: ScenarioOption[]
  difficulty: number // 1-5
}

// Get tone color for UI
export function getToneColor(tone: ToneType): string {
  const colors = {
    safe: '#30d158',      // Soft green
    curious: '#0b84fe',   // Blue
    playful: '#ff9f0a',   // Orange
    bold: '#ff375f',      // Red
  }
  return colors[tone]
}

// Get tone description
export function getToneDescription(tone: ToneType): string {
  const descriptions = {
    safe: 'Conservative, low-risk, reliable',
    curious: 'Asks questions, shows interest, engages deeper',
    playful: 'Light, fun, slightly cheeky',
    bold: 'Direct, confident, higher risk/reward',
  }
  return descriptions[tone]
}

// Sample scenarios (we'll expand this to 50+)
export const SCENARIOS: Scenario[] = [
  {
    id: 'everyday_001',
    category: 'everyday',
    setup: 'Coffee shop encounter',
    aiPrompt: "You're waiting for your order and someone next to you says 'The line was insane today, right?' Your move:",
    options: [
      {
        text: "Yeah, totally wild",
        tone: 'safe',
        response: "Simple agreement. Gets the job done. Nothing wrong with matching their energy.",
        insight: "Agreeing is underrated. It's connection without pressure.",
        skill: 'basic_rapport',
      },
      {
        text: "Worth it for the coffee though. What did you get?",
        tone: 'curious',
        response: "Oh nice, you flipped it into an actual conversation. That's how connections start.",
        insight: "Questions turn small talk into real talk.",
        skill: 'follow_up_questions',
      },
      {
        text: "I've seen shorter lines at theme parks",
        tone: 'playful',
        response: "Ha! Humor. If they laugh, you're basically friends now.",
        skill: 'humor_deployment',
      },
      {
        text: "Honestly, I just stare at my phone and pretend I didn't hear anyone",
        tone: 'bold',
        response: "The avoidance strategy. Honestly? Sometimes valid. But you miss potential connections.",
        skill: 'awareness_building',
      },
    ],
    difficulty: 1,
  },
  {
    id: 'everyday_002',
    category: 'everyday',
    setup: 'Elevator small talk',
    aiPrompt: "You're in an elevator with a neighbor you've seen but never talked to. They say 'How's it going?' Your response:",
    options: [
      {
        text: "Good, thanks. You?",
        tone: 'safe',
        response: "Classic. Safe. Gets you through the interaction without awkwardness.",
        skill: 'basic_rapport',
      },
      {
        text: "Pretty good! How about you? Been up to anything interesting?",
        tone: 'curious',
        response: "You opened a door there. People appreciate genuine interest.",
        insight: "Adding one extra question shows you actually care.",
        skill: 'conversation_extension',
      },
      {
        text: "Surviving. You know, the usual chaos",
        tone: 'playful',
        response: "Relatable humor. Makes you memorable without being too much.",
        skill: 'humor_deployment',
      },
      {
        text: "Honestly? This week has been rough. But we're here.",
        tone: 'bold',
        response: "Real talk. That's either very connecting or slightly intense for an elevator. But hey, authenticity.",
        skill: 'vulnerability',
      },
    ],
    difficulty: 1,
  },
  {
    id: 'everyday_003',
    category: 'everyday',
    setup: 'Someone compliments you',
    aiPrompt: "A coworker says 'I really like your [shirt/style/whatever].' How do you respond?",
    options: [
      {
        text: "Oh, thanks!",
        tone: 'safe',
        response: "Simple, clean. Nothing wrong with that. You accepted it without being weird.",
        skill: 'accepting_compliments',
      },
      {
        text: "Thanks! I appreciate that. Where'd you get yours?",
        tone: 'curious',
        response: "Nice. You took the compliment and turned it into a conversation.",
        insight: "Compliments are conversation starters, not dead ends.",
        skill: 'compliment_extension',
      },
      {
        text: "Thanks! Got it on sale, so I'm basically a genius",
        tone: 'playful',
        response: "Self-deprecating humor. Makes you likeable without deflecting the compliment entirely.",
        skill: 'humor_deployment',
      },
      {
        text: "This old thing? Nah, it's nothing special",
        tone: 'bold',
        response: "You just rejected their compliment. That's the 'bold' move here—it pushes people away. Try not doing that.",
        insight: "Deflecting compliments tells people their opinion doesn't matter to you.",
        skill: 'awareness_building',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'professional_001',
    category: 'professional',
    setup: 'Meeting small talk',
    aiPrompt: "You're early to a meeting. One other person is there. They say 'Ready for this?' Your response:",
    options: [
      {
        text: "Yeah, I think so",
        tone: 'safe',
        response: "Neutral. Safe. Gets you through without stress.",
        skill: 'basic_rapport',
      },
      {
        text: "I think so. How are you feeling about it?",
        tone: 'curious',
        response: "You just made an ally. Asking how they feel builds connection fast.",
        insight: "In work settings, asking others about their experience builds trust.",
        skill: 'empathy_building',
      },
      {
        text: "As ready as anyone can be for a Monday meeting",
        tone: 'playful',
        response: "Light, relatable humor. Works in most professional settings.",
        skill: 'professional_humor',
      },
      {
        text: "Not really, but here we are",
        tone: 'bold',
        response: "Honest. A little risky for work, but it can create real connection if they feel the same.",
        skill: 'authentic_vulnerability',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'anxiety_friendly_001',
    category: 'anxiety_friendly',
    setup: 'Low-pressure greeting',
    aiPrompt: "Someone waves at you from across the room. You're not sure if you know them. What do you do?",
    options: [
      {
        text: "Wave back with a smile",
        tone: 'safe',
        response: "Perfect. You acknowledged them without committing to anything. If you don't know them, no harm. If you do, you were friendly.",
        insight: "A wave and smile is the universal 'I see you' without pressure.",
        skill: 'low_pressure_acknowledgment',
      },
      {
        text: "Walk over and say 'Hey! How's it going?'",
        tone: 'curious',
        response: "Brave move. If you don't know them, it'll be a little awkward, but they'll probably clarify. If you do, you just made their day.",
        skill: 'conversation_initiation',
      },
      {
        text: "Give a quick nod and keep walking",
        tone: 'playful',
        response: "The 'I'm busy but I see you' move. Totally fine, especially if you're not sure who they are.",
        skill: 'boundary_setting',
      },
      {
        text: "Pretend I didn't see them and look at my phone",
        tone: 'bold',
        response: "The avoidance play. Listen, sometimes that's what you need. But if you do this a lot, you're training yourself to be afraid of connection.",
        insight: "Avoiding small interactions makes bigger ones scarier.",
        skill: 'awareness_building',
      },
    ],
    difficulty: 1,
  },
  // EVERYDAY SOCIAL - 7 more (10 total)
  {
    id: 'everyday_004',
    category: 'everyday',
    setup: 'Grocery store chat',
    aiPrompt: "You reach for the same item as someone else. They laugh and say 'Great minds think alike!' Your response:",
    options: [
      {
        text: "Ha, yeah! All yours",
        tone: 'safe',
        response: "Friendly and easy. You acknowledged the moment without making it weird.",
        skill: 'basic_rapport',
      },
      {
        text: "Right? Have you tried this brand before? Is it good?",
        tone: 'curious',
        response: "Nice! You turned an awkward moment into actual conversation.",
        insight: "Product recommendations are great neutral conversation territory.",
        skill: 'conversation_extension',
      },
      {
        text: "Looks like we both have excellent taste",
        tone: 'playful',
        response: "Playful confidence. Makes you memorable in a good way.",
        skill: 'humor_deployment',
      },
      {
        text: "We should probably fight for it, right?",
        tone: 'bold',
        response: "Bold humor. Could land really well or be slightly awkward. Depends on their vibe.",
        skill: 'humor_risk_taking',
      },
    ],
    difficulty: 1,
  },
  {
    id: 'everyday_005',
    category: 'everyday',
    setup: 'Dog park introduction',
    aiPrompt: "Your dog starts playing with someone else's dog. The owner says 'They're having fun!' What do you say?",
    options: [
      {
        text: "Yeah, they really are!",
        tone: 'safe',
        response: "Simple agreement. Keeps it light and easy.",
        skill: 'basic_rapport',
      },
      {
        text: "They are! How old is yours?",
        tone: 'curious',
        response: "Perfect. Dog people love talking about their dogs. You just opened a conversation.",
        insight: "Pet questions are social cheat codes.",
        skill: 'follow_up_questions',
      },
      {
        text: "Better social life than me, honestly",
        tone: 'playful',
        response: "Self-deprecating humor. Relatable and charming.",
        skill: 'humor_deployment',
      },
      {
        text: "Yeah, mine's friendly with everyone. Little social butterfly",
        tone: 'bold',
        response: "You just bragged about your dog. Honestly? That's allowed at dog parks.",
        skill: 'confident_sharing',
      },
    ],
    difficulty: 1,
  },
  {
    id: 'everyday_006',
    category: 'everyday',
    setup: 'Waiting room small talk',
    aiPrompt: "You're in a waiting room and someone says 'Running late as usual,' referring to the appointment. Your response:",
    options: [
      {
        text: "Yeah, always seems to happen",
        tone: 'safe',
        response: "Safe commiseration. Gets you through the interaction smoothly.",
        skill: 'basic_rapport',
      },
      {
        text: "Right? Do you come here often?",
        tone: 'curious',
        response: "You extended the conversation naturally. Shows interest without being intrusive.",
        skill: 'conversation_extension',
      },
      {
        text: "I've accepted my fate at this point",
        tone: 'playful',
        response: "Funny and relatable. Makes the waiting more bearable for both of you.",
        skill: 'humor_deployment',
      },
      {
        text: "I brought a book just in case. Learned my lesson",
        tone: 'bold',
        response: "You shared personal strategy. Can feel a bit like advice-giving, but also relatable.",
        skill: 'personal_sharing',
      },
    ],
    difficulty: 1,
  },
  {
    id: 'everyday_007',
    category: 'everyday',
    setup: 'Gym equipment sharing',
    aiPrompt: "Someone asks 'Are you using this?' pointing to equipment near you. How do you respond?",
    options: [
      {
        text: "Nope, all yours!",
        tone: 'safe',
        response: "Clear and friendly. Perfect gym etiquette.",
        skill: 'basic_rapport',
      },
      {
        text: "Not anymore! Are you working on [body part]?",
        tone: 'curious',
        response: "You offered the equipment and opened conversation. Gym buddies start like this.",
        insight: "Gym small talk is easier than you think—everyone's already in a good mood.",
        skill: 'gym_conversation',
      },
      {
        text: "It's yours. I was just keeping it warm for you",
        tone: 'playful',
        response: "Light humor. Makes you approachable at the gym.",
        skill: 'humor_deployment',
      },
      {
        text: "Yeah, I've got two more sets. Want to work in?",
        tone: 'bold',
        response: "Assertive but collaborative. Shows confidence and gym knowledge.",
        skill: 'assertive_boundary_setting',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'everyday_008',
    category: 'everyday',
    setup: 'Restaurant mix-up',
    aiPrompt: "The server brings your food to the wrong person's table. They laugh and say 'Not mine, but it looks good!' Your move:",
    options: [
      {
        text: "Ha, thanks! Hope yours is good too",
        tone: 'safe',
        response: "Friendly acknowledgment. Keeps it light and moves on.",
        skill: 'basic_rapport',
      },
      {
        text: "Right? What did you order?",
        tone: 'curious',
        response: "You turned an awkward moment into conversation. Nice.",
        skill: 'conversation_opportunity',
      },
      {
        text: "Want to trade? No? Okay, worth a shot",
        tone: 'playful',
        response: "Playful humor. Makes a forgettable moment memorable.",
        skill: 'humor_deployment',
      },
      {
        text: "Yeah, I have good taste. Clearly.",
        tone: 'bold',
        response: "Confident, maybe a bit cocky. Could be charming or slightly much—depends on delivery.",
        skill: 'confident_humor',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'everyday_009',
    category: 'everyday',
    setup: 'Parking lot encounter',
    aiPrompt: "You're getting into your car and someone parked next to you says 'Nice car!' What do you say?",
    options: [
      {
        text: "Thanks! I appreciate it",
        tone: 'safe',
        response: "Clean acceptance of the compliment. No overthinking.",
        skill: 'accepting_compliments',
      },
      {
        text: "Thanks! Yours looks great too. How long have you had it?",
        tone: 'curious',
        response: "You took the compliment and turned it into a mutual conversation. That's skill.",
        insight: "Returning compliments + questions = instant connection.",
        skill: 'reciprocal_conversation',
      },
      {
        text: "Thanks! It gets me places. Sometimes.",
        tone: 'playful',
        response: "Self-deprecating car humor. Relatable and charming.",
        skill: 'humor_deployment',
      },
      {
        text: "Thanks! Just got it. Super happy with it",
        tone: 'bold',
        response: "Enthusiastic sharing. Shows you're proud without being obnoxious.",
        skill: 'positive_sharing',
      },
    ],
    difficulty: 1,
  },
  {
    id: 'everyday_010',
    category: 'everyday',
    setup: 'Bus stop weather talk',
    aiPrompt: "Waiting for the bus, someone says 'Can't believe this weather!' It's raining. Your response:",
    options: [
      {
        text: "I know, right?",
        tone: 'safe',
        response: "Simple agreement. Classic small talk survival.",
        skill: 'basic_rapport',
      },
      {
        text: "Right? Were you expecting sun too?",
        tone: 'curious',
        response: "You validated their comment and invited more conversation. That's how strangers become acquaintances.",
        skill: 'conversation_extension',
      },
      {
        text: "At least it makes staying inside guilt-free",
        tone: 'playful',
        response: "Silver lining humor. Makes you seem optimistic and fun.",
        skill: 'reframing_humor',
      },
      {
        text: "I actually love rain. Makes everything feel cozy",
        tone: 'bold',
        response: "Contrarian opinion. Could start a real conversation or make them think you're weird. High risk, high reward.",
        skill: 'opinion_sharing',
      },
    ],
    difficulty: 1,
  },

  // PROFESSIONAL - 9 more (10 total)
  {
    id: 'professional_002',
    category: 'professional',
    setup: 'Conference networking',
    aiPrompt: "At a conference, someone approaches and says 'First time here?' Your response:",
    options: [
      {
        text: "Yeah, first time. You?",
        tone: 'safe',
        response: "Standard networking response. Gets the conversation started.",
        skill: 'basic_rapport',
      },
      {
        text: "Yes! Any tips on what sessions to hit?",
        tone: 'curious',
        response: "Smart. You positioned them as the expert and invited helpful conversation.",
        insight: "Asking for advice is one of the best networking strategies.",
        skill: 'strategic_questioning',
      },
      {
        text: "First time, but I'm determined to get my money's worth",
        tone: 'playful',
        response: "Light humor. Shows personality while staying professional.",
        skill: 'professional_humor',
      },
      {
        text: "Yeah. Honestly, a bit overwhelming but excited",
        tone: 'bold',
        response: "Vulnerable honesty. Can create instant connection at networking events.",
        skill: 'authentic_vulnerability',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'professional_003',
    category: 'professional',
    setup: 'Lunch break invitation',
    aiPrompt: "A coworker you don't know well says 'We're grabbing lunch. Want to come?' Your response:",
    options: [
      {
        text: "Sure, sounds good!",
        tone: 'safe',
        response: "Easy acceptance. Opens door to workplace relationships.",
        skill: 'accepting_invitations',
      },
      {
        text: "Yeah, I'd love to! Where are you thinking?",
        tone: 'curious',
        response: "Enthusiastic and engaged. Shows you're interested in connecting.",
        skill: 'enthusiastic_acceptance',
      },
      {
        text: "Only if you promise good conversation",
        tone: 'playful',
        response: "Playful acceptance. Shows confidence and humor.",
        skill: 'playful_engagement',
      },
      {
        text: "I usually eat alone, but... okay, why not?",
        tone: 'bold',
        response: "Honest but slightly awkward. They might find it endearing or off-putting.",
        insight: "You can be honest without highlighting your isolation habits.",
        skill: 'awareness_building',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'professional_004',
    category: 'professional',
    setup: 'Project collaboration',
    aiPrompt: "Someone says 'Want to collaborate on this project?' and you're not sure if you have time. What do you say?",
    options: [
      {
        text: "Let me check my schedule and get back to you?",
        tone: 'safe',
        response: "Professional boundary. Gives you time to think without committing.",
        skill: 'professional_boundaries',
      },
      {
        text: "Maybe! Tell me more about what you're thinking?",
        tone: 'curious',
        response: "You're gathering info before deciding. Smart and engaged.",
        insight: "Asking for details before committing shows interest and intelligence.",
        skill: 'information_gathering',
      },
      {
        text: "Depends—are you a good collaborator or a nightmare? Kidding!",
        tone: 'playful',
        response: "Humor to deflect while you figure it out. Can build rapport.",
        skill: 'humor_deployment',
      },
      {
        text: "I'm pretty slammed, but I could maybe make it work",
        tone: 'bold',
        response: "Honest about capacity but open. Sets realistic expectations.",
        skill: 'honest_boundary_setting',
      },
    ],
    difficulty: 3,
  },
  {
    id: 'professional_005',
    category: 'professional',
    setup: 'Coffee machine chat',
    aiPrompt: "You're making coffee and someone says 'Can't function without this stuff.' Your response:",
    options: [
      {
        text: "Same here!",
        tone: 'safe',
        response: "Universal workplace bonding. Coffee = common ground.",
        skill: 'basic_rapport',
      },
      {
        text: "Right? What's your usual order?",
        tone: 'curious',
        response: "You turned coffee chat into getting-to-know-you chat. Smooth.",
        skill: 'small_talk_extension',
      },
      {
        text: "It's basically a survival tool at this point",
        tone: 'playful',
        response: "Relatable humor. Makes you approachable.",
        skill: 'humor_deployment',
      },
      {
        text: "I've tried to quit like five times. Always come back",
        tone: 'bold',
        response: "Personal sharing. Can spark real conversation about habits and health.",
        skill: 'personal_sharing',
      },
    ],
    difficulty: 1,
  },
  {
    id: 'professional_006',
    category: 'professional',
    setup: 'Presentation feedback',
    aiPrompt: "After presenting, someone says 'That was really interesting!' How do you respond?",
    options: [
      {
        text: "Thank you! I appreciate that",
        tone: 'safe',
        response: "Gracious acceptance. Professional and clean.",
        skill: 'accepting_compliments',
      },
      {
        text: "Thanks! Was there a part that stood out to you?",
        tone: 'curious',
        response: "You accepted the compliment and invited more detailed feedback. Smart networking.",
        insight: "Follow-up questions turn compliments into conversations.",
        skill: 'feedback_gathering',
      },
      {
        text: "Thanks! I only panicked internally three times",
        tone: 'playful',
        response: "Self-deprecating humor. Makes you relatable and likeable.",
        skill: 'humor_deployment',
      },
      {
        text: "Really? I felt like I rushed the end. But thank you",
        tone: 'bold',
        response: "You self-critiqued while accepting. Shows you're reflective but could diminish the compliment.",
        skill: 'reflective_acceptance',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'professional_007',
    category: 'professional',
    setup: 'Email miscommunication',
    aiPrompt: "Someone says 'Hey, I think there was some confusion about that email.' How do you respond in person?",
    options: [
      {
        text: "Oh, let's sort it out. What happened?",
        tone: 'safe',
        response: "Professional and solution-focused. De-escalates potential tension.",
        skill: 'conflict_de_escalation',
      },
      {
        text: "No worries! Can you walk me through what you understood?",
        tone: 'curious',
        response: "You stayed calm and collaborative. That's leadership energy.",
        insight: "In miscommunications, seek to understand before being understood.",
        skill: 'collaborative_problem_solving',
      },
      {
        text: "Ah, the classic email mystery. Let's decode it together",
        tone: 'playful',
        response: "Light humor to ease tension. Can make problem-solving feel less stressful.",
        skill: 'tension_reduction',
      },
      {
        text: "Yeah, I could have been clearer. My bad. Let's fix it",
        tone: 'bold',
        response: "You took responsibility immediately. That's respected in professional settings.",
        skill: 'accountability',
      },
    ],
    difficulty: 3,
  },
  {
    id: 'professional_008',
    category: 'professional',
    setup: 'Elevator pitch moment',
    aiPrompt: "At a networking event, someone asks 'So what do you do?' How do you respond?",
    options: [
      {
        text: "I work in [field]. What about you?",
        tone: 'safe',
        response: "Basic but functional. Gets the job done without stress.",
        skill: 'basic_networking',
      },
      {
        text: "I [specific role]—basically I help [outcome]. How about you?",
        tone: 'curious',
        response: "You gave a clear, outcome-focused answer and invited reciprocation. Textbook networking.",
        insight: "People remember what you help with, not your job title.",
        skill: 'outcome_focused_pitch',
      },
      {
        text: "I [job], which sounds boring but is actually kind of interesting",
        tone: 'playful',
        response: "Self-aware humor. Makes you memorable.",
        skill: 'memorable_introduction',
      },
      {
        text: "Honestly? Still figuring that out. But I [current role]",
        tone: 'bold',
        response: "Vulnerable honesty. Can create deeper connection but might not inspire confidence.",
        skill: 'authentic_vulnerability',
      },
    ],
    difficulty: 3,
  },
  {
    id: 'professional_009',
    category: 'professional',
    setup: 'Awkward silence in meeting',
    aiPrompt: "There's an awkward silence after someone asks 'Any other thoughts?' No one's speaking. What do you do?",
    options: [
      {
        text: "Stay quiet and wait for someone else to speak",
        tone: 'safe',
        response: "Sometimes silence is fine. Not every moment needs filling.",
        skill: 'comfortable_silence',
      },
      {
        text: "I have a question about [relevant topic]",
        tone: 'curious',
        response: "You broke the silence productively. That's valuable in meetings.",
        insight: "Questions are safer than statements when breaking silence.",
        skill: 'meeting_contribution',
      },
      {
        text: "I think we've covered everything... unless someone has secret thoughts?",
        tone: 'playful',
        response: "Light humor to ease tension. Can help people feel comfortable speaking up.",
        skill: 'tension_reduction',
      },
      {
        text: "Actually, yeah—[share your opinion]",
        tone: 'bold',
        response: "You filled the void with substance. Shows confidence and initiative.",
        skill: 'assertive_contribution',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'professional_010',
    category: 'professional',
    setup: 'LinkedIn connection request',
    aiPrompt: "You met someone briefly at an event. Do you send a LinkedIn request? If so, what message?",
    options: [
      {
        text: "Send request with no message",
        tone: 'safe',
        response: "Totally acceptable. They'll likely remember if the conversation was good.",
        skill: 'digital_networking',
      },
      {
        text: "'Great meeting you at [event]! Would love to stay connected'",
        tone: 'curious',
        response: "Personal and specific. Shows you remember them and valued the interaction.",
        insight: "Mentioning where you met jogs their memory and shows intentionality.",
        skill: 'personalized_outreach',
      },
      {
        text: "'Adding you to my collection of interesting people'",
        tone: 'playful',
        response: "Playful and memorable. Could be charming or slightly weird—depends on your vibe in person.",
        skill: 'memorable_messaging',
      },
      {
        text: "Don't send request—they probably don't remember you",
        tone: 'bold',
        response: "That's the anxiety talking. If you talked for more than 30 seconds, send it. Worst case? They don't accept.",
        insight: "Most people are flattered by connection requests, not annoyed.",
        skill: 'overcoming_self_doubt',
      },
    ],
    difficulty: 2,
  },

  // RELATIONSHIPS - 10 new
  {
    id: 'relationships_001',
    category: 'relationships',
    setup: 'Friend cancels plans',
    aiPrompt: "A friend texts 'Hey, I'm so sorry but I need to cancel tonight.' How do you respond?",
    options: [
      {
        text: "'No worries! Let's reschedule soon'",
        tone: 'safe',
        response: "Understanding and flexible. Maintains friendship without pressure.",
        skill: 'gracious_acceptance',
      },
      {
        text: "'All good! Is everything okay?'",
        tone: 'curious',
        response: "You showed concern without being pushy. That's good friend energy.",
        insight: "Checking in shows you care about them, not just the plans.",
        skill: 'caring_check_in',
      },
      {
        text: "'Ugh, I was so ready to do nothing with you. Rain check?'",
        tone: 'playful',
        response: "Light humor shows you're not mad and keeps the vibe positive.",
        skill: 'humor_deployment',
      },
      {
        text: "'Honestly, kind of relieved. I'm exhausted too'",
        tone: 'bold',
        response: "Honest. Could be bonding or could make them feel less bad. Context matters.",
        skill: 'mutual_honesty',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'relationships_002',
    category: 'relationships',
    setup: 'Friend venting repeatedly',
    aiPrompt: "A friend vents about the same problem for the third time. You're supportive but drained. What do you say?",
    options: [
      {
        text: "'I hear you. That sounds really hard'",
        tone: 'safe',
        response: "Validating without solving. Sometimes that's all you can do.",
        skill: 'emotional_validation',
      },
      {
        text: "'I'm here for you. Have you thought about [gentle suggestion]?'",
        tone: 'curious',
        response: "You balanced support with gentle guidance. That's tough to do well.",
        insight: "Suggesting actions works best after validating feelings first.",
        skill: 'supportive_guidance',
      },
      {
        text: "'Okay, we're solving this today. What's step one?'",
        tone: 'playful',
        response: "Direct but caring. Can help someone stuck in complaint mode move forward.",
        skill: 'playful_redirection',
      },
      {
        text: "'I love you, but I think you need to talk to someone professional about this'",
        tone: 'bold',
        response: "Honest boundary-setting. Hard to say but sometimes necessary.",
        skill: 'honest_boundaries',
      },
    ],
    difficulty: 4,
  },
  {
    id: 'relationships_003',
    category: 'relationships',
    setup: 'Roommate issue',
    aiPrompt: "Your roommate keeps leaving dishes in the sink. How do you bring it up?",
    options: [
      {
        text: "Don't say anything, just keep cleaning them",
        tone: 'safe',
        response: "Avoids conflict but builds resentment. Not sustainable long-term.",
        insight: "Small unspoken frustrations become big problems.",
        skill: 'awareness_building',
      },
      {
        text: "'Hey, can we chat about the kitchen situation?'",
        tone: 'curious',
        response: "Non-accusatory and solution-focused. Good roommate communication.",
        skill: 'conflict_initiation',
      },
      {
        text: "'Dude, the dish situation is getting wild. Can we figure this out?'",
        tone: 'playful',
        response: "Light but direct. Works if you have good rapport already.",
        skill: 'casual_confrontation',
      },
      {
        text: "'I'm going to be real: the dishes are driving me crazy'",
        tone: 'bold',
        response: "Direct honesty. Can be effective but might feel confrontational.",
        skill: 'direct_communication',
      },
    ],
    difficulty: 3,
  },
  {
    id: 'relationships_004',
    category: 'relationships',
    setup: 'Making new friends',
    aiPrompt: "You've hung out with someone a few times. You want to move from acquaintance to friend. What do you do?",
    options: [
      {
        text: "Keep waiting for them to initiate plans",
        tone: 'safe',
        response: "Passive approach. Friendships need someone to take initiative.",
        insight: "If you wait for the other person to reach out, you might wait forever.",
        skill: 'awareness_building',
      },
      {
        text: "'Hey, want to grab coffee/do [activity] sometime?'",
        tone: 'curious',
        response: "Direct invitation. That's how friendships deepen. Most people say yes.",
        skill: 'friendship_initiation',
      },
      {
        text: "'We should hang out more. I enjoy your company'",
        tone: 'playful',
        response: "Explicitly stating you like them. Surprisingly effective and not weird.",
        skill: 'expressing_appreciation',
      },
      {
        text: "'Can I be honest? I'm trying to make more friends and I like you'",
        tone: 'bold',
        response: "Vulnerable and direct. Might feel intense but often appreciated.",
        skill: 'vulnerable_honesty',
      },
    ],
    difficulty: 3,
  },
  {
    id: 'relationships_005',
    category: 'relationships',
    setup: 'Group chat overwhelm',
    aiPrompt: "Your group chat is blowing up with messages. You're overwhelmed. What do you do?",
    options: [
      {
        text: "Mute it and check in later",
        tone: 'safe',
        response: "Healthy boundary. You can engage when you have capacity.",
        skill: 'digital_boundaries',
      },
      {
        text: "Skim through and respond to what seems important",
        tone: 'curious',
        response: "Balanced approach. Stays connected without drowning in every message.",
        skill: 'selective_engagement',
      },
      {
        text: "Send a gif and call it participation",
        tone: 'playful',
        response: "Low-effort engagement. Honestly? Sometimes that's perfect.",
        skill: 'minimal_participation',
      },
      {
        text: "'Y'all, I love you but I'm muting this for my sanity'",
        tone: 'bold',
        response: "Honest and clear. Sets boundaries without leaving the group.",
        skill: 'transparent_boundaries',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'relationships_006',
    category: 'relationships',
    setup: 'Friend forgets your birthday',
    aiPrompt: "A close friend forgets your birthday. Do you say something?",
    options: [
      {
        text: "Let it go and don't mention it",
        tone: 'safe',
        response: "Avoids awkwardness but might leave you feeling hurt.",
        insight: "Unexpressed hurt doesn't disappear—it just goes underground.",
        skill: 'awareness_building',
      },
      {
        text: "'Hey, just so you know, yesterday was my birthday'",
        tone: 'curious',
        response: "Neutral statement. Gives them a chance to acknowledge without blame.",
        skill: 'gentle_correction',
      },
      {
        text: "'You forgot my birthday! I'm only a little offended'",
        tone: 'playful',
        response: "Light humor to bring it up without being heavy. Usually goes well.",
        skill: 'humorous_address',
      },
      {
        text: "'It hurt that you forgot my birthday'",
        tone: 'bold',
        response: "Direct emotional honesty. Can deepen friendship if received well.",
        skill: 'emotional_honesty',
      },
    ],
    difficulty: 3,
  },
  {
    id: 'relationships_007',
    category: 'relationships',
    setup: 'Declining an invitation',
    aiPrompt: "A friend invites you to something you genuinely don't want to do. How do you decline?",
    options: [
      {
        text: "'I can't make it, but thanks for the invite!'",
        tone: 'safe',
        response: "Simple and polite. No explanation needed.",
        skill: 'polite_declining',
      },
      {
        text: "'I'm going to skip this one, but let's plan something soon?'",
        tone: 'curious',
        response: "You declined but showed you still want to connect. Maintains relationship.",
        insight: "Suggesting alternative plans shows the relationship matters.",
        skill: 'counterproposal',
      },
      {
        text: "'Not my scene, but hope it's fun!'",
        tone: 'playful',
        response: "Honest without being apologetic. Respects your preferences and their event.",
        skill: 'honest_declining',
      },
      {
        text: "'I'm not going to enjoy that, so I'll pass'",
        tone: 'bold',
        response: "Brutally honest. Can be refreshing or slightly harsh depending on delivery.",
        skill: 'direct_honesty',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'relationships_008',
    category: 'relationships',
    setup: 'Friend sharing good news',
    aiPrompt: "A friend got something you've been trying to get (job, relationship, etc.). They're excited to tell you. Your response:",
    options: [
      {
        text: "'That's awesome! Congrats!'",
        tone: 'safe',
        response: "Genuinely happy for them. That's good friendship.",
        skill: 'celebrating_others',
      },
      {
        text: "'Amazing! Tell me everything—how did it happen?'",
        tone: 'curious',
        response: "You showed excitement and genuine interest. That's real support.",
        insight: "Asking for details shows authentic happiness, not just surface congratulations.",
        skill: 'genuine_celebration',
      },
      {
        text: "'You did it! Now teach me your ways'",
        tone: 'playful',
        response: "Happy for them, playful about yourself. Balanced and light.",
        skill: 'humor_deployment',
      },
      {
        text: "'Congrats. I'm happy for you' (but you're not really)",
        tone: 'bold',
        response: "Envy is human. Acknowledge it to yourself, then choose to be supportive anyway.",
        insight: "You can feel jealous AND be happy for someone. Both are allowed.",
        skill: 'emotional_awareness',
      },
    ],
    difficulty: 3,
  },
  {
    id: 'relationships_009',
    category: 'relationships',
    setup: 'Ending a friendship',
    aiPrompt: "You've realized a friendship isn't healthy. How do you handle it?",
    options: [
      {
        text: "Slow fade—gradually become less available",
        tone: 'safe',
        response: "Common approach. Less confrontational but can leave things unclear.",
        skill: 'gradual_distancing',
      },
      {
        text: "Set boundaries and see if it improves",
        tone: 'curious',
        response: "Mature approach. Gives the relationship a chance before ending it.",
        insight: "Sometimes friendships just need better boundaries, not endings.",
        skill: 'boundary_setting',
      },
      {
        text: "'I need some space to figure things out'",
        tone: 'playful',
        response: "Honest without being harsh. Leaves door cracked for future.",
        skill: 'gentle_distancing',
      },
      {
        text: "'This friendship isn't working for me anymore'",
        tone: 'bold',
        response: "Direct and clear. Harder conversation but provides closure.",
        skill: 'direct_ending',
      },
    ],
    difficulty: 5,
  },
  {
    id: 'relationships_010',
    category: 'relationships',
    setup: 'Friend asks to borrow money',
    aiPrompt: "A friend asks to borrow money. You can afford it but you're uncomfortable. What do you say?",
    options: [
      {
        text: "'Sorry, I can't help with that right now'",
        tone: 'safe',
        response: "Clean boundary. You don't owe an explanation.",
        skill: 'financial_boundaries',
      },
      {
        text: "'I have a rule about not lending money. Can I help another way?'",
        tone: 'curious',
        response: "Boundary with alternative support. Shows you care without compromising yourself.",
        insight: "You can say no to money and still be supportive.",
        skill: 'alternative_support',
      },
      {
        text: "'Money and friendship don't mix well. I've learned that the hard way'",
        tone: 'playful',
        response: "Light but firm. Uses personal experience to soften the no.",
        skill: 'experience_based_boundaries',
      },
      {
        text: "Lend it with clear terms or give it as a gift you don't expect back",
        tone: 'bold',
        response: "If you do lend money, assume you won't get it back. Avoids resentment.",
        skill: 'financial_clarity',
      },
    ],
    difficulty: 4,
  },

  // DIFFICULT CONVERSATIONS - 10 new
  {
    id: 'difficult_001',
    category: 'difficult',
    setup: 'Uncomfortable question',
    aiPrompt: "Someone asks a personal question you don't want to answer. What do you do?",
    options: [
      {
        text: "'I'd rather not get into that'",
        tone: 'safe',
        response: "Direct boundary. Most people will respect it.",
        skill: 'boundary_setting',
      },
      {
        text: "'Why do you ask?'",
        tone: 'curious',
        response: "Deflects while gathering info about their intent. Smart move.",
        insight: "Understanding why they're asking helps you decide how to respond.",
        skill: 'clarifying_intent',
      },
      {
        text: "'That's a loaded question! Next topic?'",
        tone: 'playful',
        response: "Light deflection. Works if you want to avoid without tension.",
        skill: 'playful_deflection',
      },
      {
        text: "'That's pretty personal. I'm not comfortable answering'",
        tone: 'bold',
        response: "Crystal clear boundary. Might feel awkward but highly effective.",
        skill: 'assertive_boundaries',
      },
    ],
    difficulty: 3,
  },
  {
    id: 'difficult_002',
    category: 'difficult',
    setup: 'Called out publicly',
    aiPrompt: "Someone criticizes something you said/did in front of a group. How do you respond?",
    options: [
      {
        text: "'You might be right. Let's talk about it later'",
        tone: 'safe',
        response: "De-escalates without full agreement. Moves conversation to private.",
        skill: 'public_de_escalation',
      },
      {
        text: "'Can you explain what you mean?'",
        tone: 'curious',
        response: "Puts the ball back in their court. Makes them justify their critique.",
        insight: "Asking for clarification shifts power dynamics in your favor.",
        skill: 'clarification_request',
      },
      {
        text: "'Noted! Anyone else have thoughts?'",
        tone: 'playful',
        response: "Acknowledges without dwelling. Redirects attention away from conflict.",
        skill: 'topic_redirection',
      },
      {
        text: "'I disagree, and here's why...'",
        tone: 'bold',
        response: "Standing your ground publicly. High confidence move that can backfire or earn respect.",
        skill: 'public_disagreement',
      },
    ],
    difficulty: 4,
  },
  {
    id: 'difficult_003',
    category: 'difficult',
    setup: 'Someone takes credit',
    aiPrompt: "A coworker takes credit for your idea in a meeting. What do you do?",
    options: [
      {
        text: "Let it go this time",
        tone: 'safe',
        response: "Avoids confrontation but might let a pattern start.",
        insight: "Letting small things go is fine—until it's a pattern.",
        skill: 'awareness_building',
      },
      {
        text: "'Actually, I brought that up earlier. Glad it resonated!'",
        tone: 'curious',
        response: "Reclaims credit without attacking. Professional and effective.",
        skill: 'credit_reclaiming',
      },
      {
        text: "'Hey, that was my idea! But I'm glad you liked it'",
        tone: 'playful',
        response: "Light but clear. Makes the point without being heavy.",
        skill: 'playful_assertion',
      },
      {
        text: "Bring it up privately after: 'You took credit for my idea. Don't do that again'",
        tone: 'bold',
        response: "Direct confrontation. Necessary if it becomes a pattern.",
        skill: 'direct_confrontation',
      },
    ],
    difficulty: 4,
  },
  {
    id: 'difficult_004',
    category: 'difficult',
    setup: 'Receiving harsh feedback',
    aiPrompt: "Your manager gives you harsh critical feedback. How do you respond in the moment?",
    options: [
      {
        text: "'I understand. I'll work on that'",
        tone: 'safe',
        response: "Accepts without pushback. Sometimes that's strategic.",
        skill: 'accepting_criticism',
      },
      {
        text: "'Can you give me specific examples so I can improve?'",
        tone: 'curious',
        response: "Turns vague criticism into actionable feedback. Smart and professional.",
        insight: "Specific examples transform criticism into learning opportunities.",
        skill: 'feedback_clarification',
      },
      {
        text: "'That's tough to hear, but I appreciate the honesty'",
        tone: 'playful',
        response: "Acknowledges the difficulty while showing maturity. Well-balanced.",
        skill: 'gracious_acceptance',
      },
      {
        text: "'I disagree with that assessment. Here's why...'",
        tone: 'bold',
        response: "Pushes back on unfair criticism. Risky but sometimes necessary.",
        skill: 'professional_disagreement',
      },
    ],
    difficulty: 4,
  },
  {
    id: 'difficult_005',
    category: 'difficult',
    setup: 'Saying no at work',
    aiPrompt: "Your boss asks you to take on more work when you're already overwhelmed. What do you say?",
    options: [
      {
        text: "'Sure, I'll make it work'",
        tone: 'safe',
        response: "Avoids conflict but sets you up for burnout.",
        insight: "Saying yes to everything means saying no to your wellbeing.",
        skill: 'awareness_building',
      },
      {
        text: "'I'm at capacity. Can we prioritize what's most urgent?'",
        tone: 'curious',
        response: "Honest boundary with collaborative problem-solving. Professional and smart.",
        skill: 'workload_negotiation',
      },
      {
        text: "'I can take this on if we drop [other thing]. Your call'",
        tone: 'playful',
        response: "Puts the choice back on them. Shows you're willing but realistic.",
        skill: 'conditional_acceptance',
      },
      {
        text: "'I can't take this on without something else moving'",
        tone: 'bold',
        response: "Clear boundary. Might not be received well but protects your bandwidth.",
        skill: 'firm_boundaries',
      },
    ],
    difficulty: 4,
  },
  {
    id: 'difficult_006',
    category: 'difficult',
    setup: 'Microaggression response',
    aiPrompt: "Someone makes a comment that feels like a microaggression. Do you address it?",
    options: [
      {
        text: "Let it go to avoid conflict",
        tone: 'safe',
        response: "Common choice. Protects your energy but lets behavior continue.",
        skill: 'conflict_avoidance',
      },
      {
        text: "'What did you mean by that?'",
        tone: 'curious',
        response: "Makes them explain themselves without accusing. Often reveals intent.",
        insight: "Asking for clarification often makes people realize what they said.",
        skill: 'intent_clarification',
      },
      {
        text: "'That came across differently than you probably meant'",
        tone: 'playful',
        response: "Gives them an out while addressing the comment. Diplomatic.",
        skill: 'diplomatic_correction',
      },
      {
        text: "'That comment wasn't okay. Here's why...'",
        tone: 'bold',
        response: "Direct confrontation. Harder but sometimes necessary for change.",
        skill: 'direct_confrontation',
      },
    ],
    difficulty: 5,
  },
  {
    id: 'difficult_007',
    category: 'difficult',
    setup: 'Apologizing when defensive',
    aiPrompt: "You need to apologize but you feel defensive because they were wrong too. What do you do?",
    options: [
      {
        text: "Wait until you're less defensive to apologize",
        tone: 'safe',
        response: "Smart. Defensive apologies don't land well.",
        skill: 'emotional_timing',
      },
      {
        text: "'I'm sorry for my part. Can we talk about what happened?'",
        tone: 'curious',
        response: "Apologizes for your piece without excusing theirs. Mature approach.",
        insight: "You can own your part without owning everything.",
        skill: 'partial_accountability',
      },
      {
        text: "'I'm sorry. Even though we both messed up, my part wasn't okay'",
        tone: 'playful',
        response: "Acknowledges complexity while taking responsibility. Balanced.",
        skill: 'balanced_apology',
      },
      {
        text: "'I'm sorry I [specific action]. That was wrong'",
        tone: 'bold',
        response: "Clean, specific apology. Doesn't bring up their wrongdoing. Highest integrity.",
        skill: 'clean_apology',
      },
    ],
    difficulty: 4,
  },
  {
    id: 'difficult_008',
    category: 'difficult',
    setup: 'Breaking bad news',
    aiPrompt: "You have to tell someone bad news (fired, relationship ending, etc.). How do you start?",
    options: [
      {
        text: "'We need to talk. Do you have time?'",
        tone: 'safe',
        response: "Gives them heads up. Respectful but anxiety-inducing.",
        skill: 'difficult_conversation_opening',
      },
      {
        text: "'I have something difficult to talk about. Can we sit down?'",
        tone: 'curious',
        response: "Honest framing. Prepares them emotionally without dragging it out.",
        insight: "Being direct about difficulty helps people brace themselves.",
        skill: 'honest_framing',
      },
      {
        text: "'This isn't easy to say, so I'm just going to say it: [news]'",
        tone: 'playful',
        response: "Gets to the point quickly. Respectful of their time and emotions.",
        skill: 'direct_delivery',
      },
      {
        text: "Ease into it with context before delivering the news",
        tone: 'bold',
        response: "The 'compliment sandwich' approach. Can feel patronizing or softening.",
        skill: 'softened_delivery',
      },
    ],
    difficulty: 5,
  },
  {
    id: 'difficult_009',
    category: 'difficult',
    setup: 'Someone crying in front of you',
    aiPrompt: "Someone starts crying during a conversation. What do you do?",
    options: [
      {
        text: "Sit quietly and let them cry",
        tone: 'safe',
        response: "Sometimes silence is the most supportive thing. No need to fill space.",
        skill: 'comfortable_silence',
      },
      {
        text: "'Take your time. I'm here'",
        tone: 'curious',
        response: "Reassuring without dismissing their emotion. Perfect supportive response.",
        insight: "Acknowledging emotions without trying to fix them is powerful.",
        skill: 'emotional_presence',
      },
      {
        text: "Offer tissue and a light 'Let it out'",
        tone: 'playful',
        response: "Practical care with gentle encouragement. Can be comforting.",
        skill: 'practical_support',
      },
      {
        text: "'It's okay to cry. No need to apologize'",
        tone: 'bold',
        response: "Gives permission for emotion. Can be deeply validating.",
        skill: 'emotion_validation',
      },
    ],
    difficulty: 3,
  },
  {
    id: 'difficult_010',
    category: 'difficult',
    setup: 'Standing up to authority',
    aiPrompt: "Someone in power (boss, parent, etc.) is asking you to do something you think is wrong. What do you say?",
    options: [
      {
        text: "Do it to avoid conflict, then regret it",
        tone: 'safe',
        response: "Self-preservation mode. Understandable but costs you respect for yourself.",
        insight: "Small compromises on values add up to big regret.",
        skill: 'awareness_building',
      },
      {
        text: "'I'm uncomfortable with that. Can we talk about why?'",
        tone: 'curious',
        response: "Opens dialogue without outright refusing. Diplomatic and brave.",
        skill: 'diplomatic_pushback',
      },
      {
        text: "'That doesn't sit right with me. Can we find another way?'",
        tone: 'playful',
        response: "Honest but solution-focused. Respects authority while maintaining values.",
        skill: 'values_based_negotiation',
      },
      {
        text: "'I'm not doing that. It's not okay'",
        tone: 'bold',
        response: "Hard boundary with authority. High risk, high integrity.",
        skill: 'moral_courage',
      },
    ],
    difficulty: 5,
  },

  // ANXIETY-FRIENDLY - 9 more (10 total)
  {
    id: 'anxiety_friendly_002',
    category: 'anxiety_friendly',
    setup: 'Ordering at a restaurant',
    aiPrompt: "The server asks 'What can I get you?' and you haven't fully decided. What do you do?",
    options: [
      {
        text: "'Can I have one more minute?'",
        tone: 'safe',
        response: "Totally normal. Servers expect this. You're allowed to need time.",
        skill: 'asking_for_time',
      },
      {
        text: "'I'm between [two options]. What do you recommend?'",
        tone: 'curious',
        response: "Engages the server and makes deciding easier. Smart strategy.",
        insight: "Servers usually love giving recommendations—makes their job more fun.",
        skill: 'collaborative_deciding',
      },
      {
        text: "'I'll have the first thing I see that looks good'",
        tone: 'playful',
        response: "Reduces decision pressure. Sometimes random is fine.",
        skill: 'decision_reduction',
      },
      {
        text: "Quickly pick something even if you're not sure",
        tone: 'bold',
        response: "The anxiety move. Remember: you can change your order if needed.",
        skill: 'imperfect_action',
      },
    ],
    difficulty: 1,
  },
  {
    id: 'anxiety_friendly_003',
    category: 'anxiety_friendly',
    setup: 'Phone call anxiety',
    aiPrompt: "You need to make a phone call but you're anxious. What do you do?",
    options: [
      {
        text: "Write out what you want to say first",
        tone: 'safe',
        response: "Classic anxiety coping tool. Having notes helps most people.",
        skill: 'preparation_strategy',
      },
      {
        text: "Text first: 'Is now a good time to call?'",
        tone: 'curious',
        response: "Reduces surprise anxiety. Gives both of you time to prepare.",
        insight: "Scheduled calls are less stressful than surprise calls.",
        skill: 'anxiety_reduction',
      },
      {
        text: "Just call and figure it out as you go",
        tone: 'playful',
        response: "Exposure therapy approach. Gets easier each time.",
        skill: 'exposure_practice',
      },
      {
        text: "Call and say 'I'm nervous, bear with me'",
        tone: 'bold',
        response: "Naming anxiety often reduces it. People are usually understanding.",
        skill: 'anxiety_acknowledgment',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'anxiety_friendly_004',
    category: 'anxiety_friendly',
    setup: 'Party exit strategy',
    aiPrompt: "You're at a party and feeling overwhelmed. How do you leave without being rude?",
    options: [
      {
        text: "Irish goodbye (leave without saying anything)",
        tone: 'safe',
        response: "Totally valid at big parties. Your wellbeing matters most.",
        skill: 'quiet_exit',
      },
      {
        text: "Find the host, say 'This was great but I'm heading out'",
        tone: 'curious',
        response: "Polite acknowledgment. Most hosts appreciate the goodbye.",
        insight: "You don't need an elaborate excuse to leave.",
        skill: 'graceful_exit',
      },
      {
        text: "Text the host later: 'Had to run, thanks for having me!'",
        tone: 'playful',
        response: "Compromise between Irish goodbye and formal exit. Works well.",
        skill: 'delayed_courtesy',
      },
      {
        text: "Say 'I'm socially maxed out, gotta recharge'",
        tone: 'bold',
        response: "Honest boundary. Most people respect it, especially if you're close.",
        skill: 'honest_exit',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'anxiety_friendly_005',
    category: 'anxiety_friendly',
    setup: 'Asking for help',
    aiPrompt: "You need help with something but you're anxious about asking. What do you do?",
    options: [
      {
        text: "Don't ask, just struggle through it alone",
        tone: 'safe',
        response: "The anxiety instinct. But asking for help builds connection, not burden.",
        insight: "Most people like helping—it makes them feel valued.",
        skill: 'awareness_building',
      },
      {
        text: "'Hey, do you have time to help me with [thing]?'",
        tone: 'curious',
        response: "Direct and respectful of their time. That's how you ask for help.",
        skill: 'direct_asking',
      },
      {
        text: "'I'm stuck on [thing]. Any chance you could help?'",
        tone: 'playful',
        response: "Casual and specific. Makes it easy for them to say yes or no.",
        skill: 'casual_requesting',
      },
      {
        text: "'I really need help and I'm nervous to ask, but...'",
        tone: 'bold',
        response: "Vulnerable honesty. Often makes people MORE willing to help.",
        skill: 'vulnerable_asking',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'anxiety_friendly_006',
    category: 'anxiety_friendly',
    setup: 'Text message timing',
    aiPrompt: "You want to text someone but you're worried about timing. What do you do?",
    options: [
      {
        text: "Draft it and wait for the 'perfect' time to send",
        tone: 'safe',
        response: "Overthinking move. There's rarely a perfect time. Just send it.",
        skill: 'awareness_building',
      },
      {
        text: "Send it now—they'll respond when they can",
        tone: 'curious',
        response: "Healthy mindset. Texts are asynchronous for a reason.",
        insight: "People respond when they want to. That's their choice, not your problem.",
        skill: 'healthy_texting',
      },
      {
        text: "Send it with 'No rush on responding!'",
        tone: 'playful',
        response: "Takes pressure off both of you. Can be helpful.",
        skill: 'pressure_reduction',
      },
      {
        text: "Just send it and resist checking your phone every 30 seconds",
        tone: 'bold',
        response: "Sending is easy. Not obsessing over the response is the real practice.",
        skill: 'anxiety_management',
      },
    ],
    difficulty: 1,
  },
  {
    id: 'anxiety_friendly_007',
    category: 'anxiety_friendly',
    setup: 'Saying no to plans',
    aiPrompt: "You're invited to something but you don't have energy. How do you decline without guilt?",
    options: [
      {
        text: "'I can't make it, but thanks for thinking of me!'",
        tone: 'safe',
        response: "Simple and guilt-free. You don't owe an explanation.",
        skill: 'simple_declining',
      },
      {
        text: "'I'm low on social battery right now. Rain check?'",
        tone: 'curious',
        response: "Honest and clear. Names the real reason without oversharing.",
        insight: "Social battery' is universally understood now. Use it.",
        skill: 'honest_declining',
      },
      {
        text: "'Not this time, but I appreciate the invite!'",
        tone: 'playful',
        response: "Declines without closing the door to future invites.",
        skill: 'future_openness',
      },
      {
        text: "Say yes, then regret it and feel trapped",
        tone: 'bold',
        response: "The people-pleaser trap. Saying no NOW is easier than canceling later.",
        skill: 'awareness_building',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'anxiety_friendly_008',
    category: 'anxiety_friendly',
    setup: 'Joining a conversation',
    aiPrompt: "There's a group conversation you want to join but you're not sure when to jump in. What do you do?",
    options: [
      {
        text: "Wait for a pause and make a comment related to what they're discussing",
        tone: 'safe',
        response: "Classic approach. Works well if you wait for a natural break.",
        skill: 'conversation_joining',
      },
      {
        text: "Ask a question about what they're talking about",
        tone: 'curious',
        response: "Questions are the easiest entry point. Shows interest without dominating.",
        insight: "Questions invite you in without needing a clever comment.",
        skill: 'question_entry',
      },
      {
        text: "Jump in with a joke or light comment",
        tone: 'playful',
        response: "Humor can work but timing matters. Slightly riskier.",
        skill: 'humorous_entry',
      },
      {
        text: "Stand nearby and hope someone includes you",
        tone: 'bold',
        response: "Passive strategy. Sometimes works but requires someone noticing you.",
        skill: 'passive_approach',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'anxiety_friendly_009',
    category: 'anxiety_friendly',
    setup: 'Making a mistake publicly',
    aiPrompt: "You make an obvious mistake in front of people. How do you handle it?",
    options: [
      {
        text: "Ignore it and hope no one noticed",
        tone: 'safe',
        response: "The freeze response. Sometimes fine for tiny mistakes.",
        skill: 'mistake_ignoring',
      },
      {
        text: "'Oops, my bad!' and move on",
        tone: 'curious',
        response: "Quick acknowledgment without dwelling. Healthy response.",
        insight: "Acknowledging mistakes briefly shows confidence, not weakness.",
        skill: 'quick_acknowledgment',
      },
      {
        text: "'Well, that was graceful' (laugh it off)",
        tone: 'playful',
        response: "Self-deprecating humor. Usually makes people like you more.",
        skill: 'humor_recovery',
      },
      {
        text: "Apologize profusely and keep bringing it up",
        tone: 'bold',
        response: "The anxiety spiral. Makes it bigger than it is. Try not to do this.",
        skill: 'awareness_building',
      },
    ],
    difficulty: 2,
  },
  {
    id: 'anxiety_friendly_010',
    category: 'anxiety_friendly',
    setup: 'When conversation dies',
    aiPrompt: "You're talking with someone and the conversation dies. Awkward silence. What now?",
    options: [
      {
        text: "Embrace the silence—it's not always awkward",
        tone: 'safe',
        response: "Mature approach. Not every silence needs filling.",
        skill: 'comfortable_silence',
      },
      {
        text: "'So, what have you been up to lately?'",
        tone: 'curious',
        response: "Open-ended restart. Almost always works.",
        insight: "'What have you been up to?' is the universal conversation restarter.",
        skill: 'conversation_restart',
      },
      {
        text: "'Well, this is a silence' (acknowledge it with humor)",
        tone: 'playful',
        response: "Naming the awkwardness often dissolves it. Risky but effective.",
        skill: 'awkwardness_acknowledgment',
      },
      {
        text: "Say 'I should get going' and leave",
        tone: 'bold',
        response: "Sometimes conversations just end. That's okay.",
        skill: 'natural_ending',
      },
    ],
    difficulty: 2,
  },
]

// Get a random scenario from a category
export function getRandomScenario(category?: ScenarioCategory): Scenario {
  const filtered = category 
    ? SCENARIOS.filter(s => s.category === category)
    : SCENARIOS
  
  return filtered[Math.floor(Math.random() * filtered.length)]
}

// Get scenario by ID
export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find(s => s.id === id)
}
