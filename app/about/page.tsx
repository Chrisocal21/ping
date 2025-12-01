'use client'

import { useRouter } from 'next/navigation'
import { PersonalityAvatar } from '@/components/PersonalityAvatar'

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:bg-gradient-to-r hover:from-[#14F195] hover:to-[#0EA5E9] hover:bg-clip-text hover:text-transparent transition-all"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold">How It Works</h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-4">
            <svg className="w-full h-full text-[#14F195]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">Your AI companion for real-life moments</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Practice social skills, vent safely, and think through decisions—without judgment.
          </p>
        </section>

        {/* What is Ping? */}
        <section className="bg-[#1a1a24] rounded-lg p-8 space-y-4">
          <h3 className="text-2xl font-semibold mb-4">What is Ping?</h3>
          <p className="text-gray-300 leading-relaxed">
            Ping is an AI-powered companion designed to help you navigate social situations, 
            process emotions, and make better decisions. Think of it as a judgment-free friend 
            who's always available to practice conversations, listen when you need to vent, 
            or help you think through tough choices.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Unlike traditional chatbots, Ping learns from every interaction. It remembers what 
            you've talked about, understands your communication style, and adapts to your needs 
            over time—all while keeping your data completely private on your device.
          </p>
        </section>

        {/* Meet Your AI Team */}
        <section className="space-y-6">
          <h3 className="text-2xl font-semibold">Meet Your AI Team</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#1a1a24] rounded-lg p-6 space-y-3">
              <div className="flex items-center space-x-3 mb-2">
                <PersonalityAvatar personalityId="max" size="xl" />
                <h4 className="text-xl font-semibold">Max</h4>
              </div>
              <p className="text-sm text-gray-400 mb-3">The Thoughtful Guide</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Max is your go-to for structured thinking and social practice. Warm and 
                supportive, Max guides you through scenarios, helps you make decisions, 
                and validates your emotions without toxic positivity.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs px-2 py-1 bg-gray-800 rounded">Social practice</span>
                <span className="text-xs px-2 py-1 bg-gray-800 rounded">Decision-making</span>
                <span className="text-xs px-2 py-1 bg-gray-800 rounded">Coaching</span>
              </div>
            </div>

            <div className="bg-[#1a1a24] rounded-lg p-6 space-y-3">
              <div className="flex items-center space-x-3 mb-2">
                <PersonalityAvatar personalityId="jamie" size="xl" />
                <h4 className="text-xl font-semibold">Jamie</h4>
              </div>
              <p className="text-sm text-gray-400 mb-3">The Energetic Hype Person</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Jamie brings the energy! When you're doubting yourself or need a confidence 
                boost, Jamie's your hype person. Enthusiastic and action-oriented, Jamie 
                helps you reframe setbacks and take that first scary step.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs px-2 py-1 bg-gray-800 rounded">Motivation</span>
                <span className="text-xs px-2 py-1 bg-gray-800 rounded">Confidence</span>
                <span className="text-xs px-2 py-1 bg-gray-800 rounded">Action</span>
              </div>
            </div>

            <div className="bg-[#1a1a24] rounded-lg p-6 space-y-3">
              <div className="flex items-center space-x-3 mb-2">
                <PersonalityAvatar personalityId="sage" size="xl" />
                <h4 className="text-xl font-semibold">Sage</h4>
              </div>
              <p className="text-sm text-gray-400 mb-3">The Calm Companion</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Sage offers a calm, grounding presence when emotions run high. Perfect for 
                anxiety management and deep reflection, Sage helps you process feelings, 
                find perspective, and practice self-compassion.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs px-2 py-1 bg-gray-800 rounded">Mindfulness</span>
                <span className="text-xs px-2 py-1 bg-gray-800 rounded">Anxiety relief</span>
                <span className="text-xs px-2 py-1 bg-gray-800 rounded">Reflection</span>
              </div>
            </div>

            <div className="bg-[#1a1a24] rounded-lg p-6 space-y-3">
              <div className="flex items-center space-x-3 mb-2">
                <PersonalityAvatar personalityId="riley" size="xl" />
                <h4 className="text-xl font-semibold">Riley</h4>
              </div>
              <p className="text-sm text-gray-400 mb-3">The Witty Realist</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Riley keeps it real. When you're spiraling or overthinking, Riley cuts 
                through the BS with honest perspective and humor. Direct but caring, 
                Riley helps you see situations clearly and laugh at yourself.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs px-2 py-1 bg-gray-800 rounded">Reality checks</span>
                <span className="text-xs px-2 py-1 bg-gray-800 rounded">Humor</span>
                <span className="text-xs px-2 py-1 bg-gray-800 rounded">Honesty</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-[#1a1a24] rounded-lg p-8 space-y-6">
          <h3 className="text-2xl font-semibold mb-4">How It Works</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#14F195] to-[#0EA5E9] rounded-full flex items-center justify-center font-semibold text-sm text-gray-900">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Choose Your AI Companion</h4>
                <p className="text-sm text-gray-400">
                  Pick Max, Jamie, Sage, or Riley based on what you need right now. 
                  You can switch anytime during your conversation.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#14F195] to-[#0EA5E9] rounded-full flex items-center justify-center font-semibold text-sm text-gray-900">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Start Talking</h4>
                <p className="text-sm text-gray-400">
                  Just share what's on your mind. The AI automatically detects your emotional 
                  state and adapts its responses—you don't need to select anything.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#14F195] to-[#0EA5E9] rounded-full flex items-center justify-center font-semibold text-sm text-gray-900">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">AI Learns & Adapts</h4>
                <p className="text-sm text-gray-400">
                  Ping detects if you're venting, anxious, making a decision, or just chatting. 
                  It responds accordingly and remembers your patterns over time.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#14F195] to-[#0EA5E9] rounded-full flex items-center justify-center font-semibold text-sm text-gray-900">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">Track Your Growth</h4>
                <p className="text-sm text-gray-400">
                  Ping tracks your progress, identifies patterns, and adapts scenarios 
                  to your skill level. Type "how am I doing" anytime for a progress report.
                </p>
              </div>
            </div>
          </div>
        </section>



        {/* Key Features */}
        <section className="bg-[#1a1a24] rounded-lg p-8 space-y-4">
          <h3 className="text-2xl font-semibold mb-4">What Makes Ping Different</h3>
          
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div className="flex items-start space-x-3">
              <span className="text-xl bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">✓</span>
              <div>
                <p className="font-semibold mb-1">Learns Your Style</p>
                <p className="text-gray-400">AI adapts to your communication preferences and emotional patterns over time</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-xl bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">✓</span>
              <div>
                <p className="font-semibold mb-1">Completely Private</p>
                <p className="text-gray-400">All data stored locally on your device—no cloud storage, no tracking</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-xl bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">✓</span>
              <div>
                <p className="font-semibold mb-1">Infinite Scenarios</p>
                <p className="text-gray-400">AI generates unlimited variations of practice scenarios based on your needs</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-xl bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">✓</span>
              <div>
                <p className="font-semibold mb-1">Evidence-Based</p>
                <p className="text-gray-400">Built on real coaching frameworks and emotional support best practices</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-xl bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">✓</span>
              <div>
                <p className="font-semibold mb-1">Crisis Support</p>
                <p className="text-gray-400">Automatic detection with immediate resources for crisis situations</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-xl bg-gradient-to-r from-[#14F195] to-[#0EA5E9] bg-clip-text text-transparent">✓</span>
              <div>
                <p className="font-semibold mb-1">Your Data, Your Control</p>
                <p className="text-gray-400">Export, import, or delete your data anytime—you're in complete control</p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Safety */}
        <section className="bg-[#1a1a24] rounded-lg p-8 space-y-6">
          <h3 className="text-2xl font-semibold mb-4">Privacy & Safety</h3>
          
          <div className="space-y-6 text-gray-300">
            {/* Our Mission */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <h4 className="font-semibold text-white mb-3 text-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-[#14F195]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                Our Mission
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed mb-3">
                Ping exists for people who need support but might not have anyone to turn to—or 
                who simply find it hard to let people in. We're here for those moments when you 
                need to talk but don't feel comfortable reaching out to friends or family yet.
              </p>
              <p className="text-sm text-gray-300 leading-relaxed mb-3">
                <strong className="text-white">We're not here to cause harm.</strong> Our goal 
                is to provide a safe, judgment-free space for you to practice social skills, 
                process emotions, and work through decisions at your own pace.
              </p>
              <p className="text-sm text-gray-400 italic">
                Sometimes you just need someone (or something) to listen without judgment. That's us.
              </p>
            </div>

            {/* Privacy */}
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#14F195]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Your Privacy Matters
              </h4>
              <ul className="space-y-2 text-sm list-disc list-inside text-gray-400">
                <li>All data is stored locally on your device using localStorage</li>
                <li>No data is sent to external servers (except OpenAI for AI responses)</li>
                <li>OpenAI does not store conversation data per their API policy</li>
                <li>No tracking, analytics, or third-party scripts</li>
                <li>You can export or delete your data at any time from Settings</li>
                <li>No account required beyond a username/password (stored locally)</li>
                <li>We never sell or share your data—we don't even collect it</li>
              </ul>
            </div>

            {/* Crisis Detection */}
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Crisis Detection & Resources
              </h4>
              <p className="text-sm text-gray-400 mb-4">
                Ping includes automatic crisis detection for suicidal ideation, self-harm, 
                abuse, and severe distress. If detected, you'll immediately receive crisis 
                resources including hotline numbers and support links.
              </p>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 space-y-3">
                <p className="text-sm text-red-200 font-semibold">If you're in crisis right now:</p>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-white font-medium mb-1">National Suicide Prevention Lifeline</p>
                    <p className="text-gray-300">Call or text: <a href="tel:988" className="text-red-300 hover:text-red-200 underline">988</a></p>
                    <p className="text-gray-400 text-xs">24/7 support in English and Spanish</p>
                  </div>

                  <div>
                    <p className="text-white font-medium mb-1">Crisis Text Line</p>
                    <p className="text-gray-300">Text HOME to <a href="sms:741741" className="text-red-300 hover:text-red-200 underline">741741</a></p>
                    <p className="text-gray-400 text-xs">Free, 24/7 support via text message</p>
                  </div>

                  <div>
                    <p className="text-white font-medium mb-1">International Association for Suicide Prevention</p>
                    <p className="text-gray-300">
                      <a href="https://www.iasp.info/resources/Crisis_Centres/" target="_blank" rel="noopener noreferrer" className="text-red-300 hover:text-red-200 underline">
                        Find crisis centers worldwide
                      </a>
                    </p>
                  </div>

                  <div>
                    <p className="text-white font-medium mb-1">SAMHSA National Helpline</p>
                    <p className="text-gray-300">Call: <a href="tel:1-800-662-4357" className="text-red-300 hover:text-red-200 underline">1-800-662-HELP (4357)</a></p>
                    <p className="text-gray-400 text-xs">Treatment referral and information (substance abuse & mental health)</p>
                  </div>

                  <div>
                    <p className="text-white font-medium mb-1">Emergency</p>
                    <p className="text-gray-300">Call <a href="tel:911" className="text-red-300 hover:text-red-200 underline">911</a> or go to your nearest emergency room</p>
                    <p className="text-gray-400 text-xs">If you or someone else is in immediate danger</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Finding Professional Help */}
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#14F195]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Finding Professional Help
              </h4>
              <p className="text-sm text-gray-400 mb-4">
                While Ping can provide support and practice, it's not a substitute for 
                professional mental health care. If you're struggling with serious mental 
                health issues, please consider reaching out to a licensed therapist or counselor.
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <p className="text-white font-medium mb-2">Find a Therapist</p>
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <a href="https://www.psychologytoday.com/us/therapists" target="_blank" rel="noopener noreferrer" className="text-user-bubble hover:bg-gradient-to-r hover:from-[#14F195] hover:to-[#0EA5E9] hover:bg-clip-text hover:text-transparent underline transition-all">
                        Psychology Today Therapist Finder
                      </a> - Search by location, insurance, and specialty
                    </li>
                    <li>
                      <a href="https://www.betterhelp.com" target="_blank" rel="noopener noreferrer" className="text-user-bubble hover:bg-gradient-to-r hover:from-[#14F195] hover:to-[#0EA5E9] hover:bg-clip-text hover:text-transparent underline transition-all">
                        BetterHelp
                      </a> - Online therapy (text, video, or phone)
                    </li>
                    <li>
                      <a href="https://www.talkspace.com" target="_blank" rel="noopener noreferrer" className="text-user-bubble hover:bg-gradient-to-r hover:from-[#14F195] hover:to-[#0EA5E9] hover:bg-clip-text hover:text-transparent underline transition-all">
                        Talkspace
                      </a> - Affordable online therapy platform
                    </li>
                    <li>
                      <a href="https://openpathcollective.org" target="_blank" rel="noopener noreferrer" className="text-user-bubble hover:bg-gradient-to-r hover:from-[#14F195] hover:to-[#0EA5E9] hover:bg-clip-text hover:text-transparent underline transition-all">
                        Open Path Collective
                      </a> - In-person therapy $30-$80 per session
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4">
                  <p className="text-white font-medium mb-2">Free & Low-Cost Resources</p>
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <a href="https://www.nami.org/help" target="_blank" rel="noopener noreferrer" className="text-user-bubble hover:bg-gradient-to-r hover:from-[#14F195] hover:to-[#0EA5E9] hover:bg-clip-text hover:text-transparent underline transition-all">
                        NAMI
                      </a> - Free support groups and education programs
                    </li>
                    <li>
                      <a href="https://www.7cups.com" target="_blank" rel="noopener noreferrer" className="text-user-bubble hover:bg-gradient-to-r hover:from-[#14F195] hover:to-[#0EA5E9] hover:bg-clip-text hover:text-transparent underline transition-all">
                        7 Cups
                      </a> - Free emotional support from trained listeners
                    </li>
                    <li>
                      <strong>Your insurance</strong> - Many plans cover mental health with low copays
                    </li>
                    <li>
                      <strong>Community health centers</strong> - Sliding scale fees based on income
                    </li>
                    <li>
                      <strong>University counseling centers</strong> - Often offer low-cost services to the public
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4">
                  <p className="text-white font-medium mb-2">Specific Support</p>
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <a href="https://www.thehotline.org" target="_blank" rel="noopener noreferrer" className="text-user-bubble hover:bg-gradient-to-r hover:from-[#14F195] hover:to-[#0EA5E9] hover:bg-clip-text hover:text-transparent underline transition-all">
                        National Domestic Violence Hotline
                      </a> - Call 1-800-799-7233 or text START to 88788
                    </li>
                    <li>
                      <a href="https://www.rainn.org" target="_blank" rel="noopener noreferrer" className="text-user-bubble hover:bg-gradient-to-r hover:from-[#14F195] hover:to-[#0EA5E9] hover:bg-clip-text hover:text-transparent underline transition-all">
                        RAINN
                      </a> - Sexual assault support, call 1-800-656-4673
                    </li>
                    <li>
                      <a href="https://www.thetrevorproject.org" target="_blank" rel="noopener noreferrer" className="text-user-bubble hover:bg-gradient-to-r hover:from-[#14F195] hover:to-[#0EA5E9] hover:bg-clip-text hover:text-transparent underline transition-all">
                        The Trevor Project
                      </a> - LGBTQ+ youth support, call 1-866-488-7386
                    </li>
                    <li>
                      <a href="https://www.veteranscrisisline.net" target="_blank" rel="noopener noreferrer" className="text-user-bubble hover:bg-gradient-to-r hover:from-[#14F195] hover:to-[#0EA5E9] hover:bg-clip-text hover:text-transparent underline transition-all">
                        Veterans Crisis Line
                      </a> - Call 988 and press 1, or text 838255
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* When to Seek Help */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-200 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                When to Seek Professional Help
              </h4>
              <p className="text-sm text-gray-300 mb-3">Consider reaching out to a professional if you're experiencing:</p>
              <ul className="space-y-1 text-sm text-gray-400 list-disc list-inside">
                <li>Persistent feelings of sadness, hopelessness, or emptiness lasting more than 2 weeks</li>
                <li>Thoughts of harming yourself or others</li>
                <li>Panic attacks, severe anxiety, or constant worry that interferes with daily life</li>
                <li>Difficulty functioning at work, school, or in relationships</li>
                <li>Trauma from abuse, violence, or other distressing events</li>
                <li>Substance use that's causing problems in your life</li>
                <li>Eating patterns that feel out of control</li>
                <li>Extreme mood swings or behavior changes</li>
              </ul>
              <p className="text-sm text-gray-300 mt-3 italic">
                Ping is here for day-to-day support, but these situations need professional care. 
                There's no shame in seeking help—it's a sign of strength.
              </p>
            </div>
          </div>
        </section>

        {/* Get Started CTA */}
        <section className="text-center space-y-4 py-8">
          <h3 className="text-2xl font-semibold">Ready to Get Started?</h3>
          <p className="text-gray-400 mb-6">
            Sign in to start practicing social skills, processing emotions, and making better decisions.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-3 bg-gradient-to-r from-[#14F195] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#14F195] rounded-lg font-semibold transition-all text-gray-900"
          >
            Sign In / Sign Up
          </button>
        </section>

        {/* Footer */}
        <section className="text-center text-xs text-gray-500 pt-8 border-t border-gray-800">
          <p>Version 1.0.0 • December 2025</p>
          <p className="mt-2 flex items-center justify-center gap-1.5">
            Made with 
            <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            for people who want to grow
          </p>
        </section>
      </div>
    </div>
  )
}
