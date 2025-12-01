/**
 * Custom personality icons - Illustrated character portraits with distinct personalities
 */

interface IconProps {
  className?: string
}

export function MaxIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="24" cy="24" r="23" fill="url(#max-bg)"/>
      
      {/* Face - smaller, less prominent */}
      <ellipse cx="24" cy="28" rx="9" ry="10" fill="#e8b896" opacity="0.95"/>
      
      {/* EMPHASIZED: Neat side-parted hair - larger and more detailed */}
      <path d="M10 22C10 14 16 6 24 6C32 6 38 14 38 22V24C38 24 35 21 29 20C25 19 21 19 17 20C12 21 10 22 10 22Z" fill="url(#max-gradient)"/>
      <path d="M24 6C24 6 21 8 19 11C18 13 17.5 16 17.5 18" stroke="url(#max-gradient)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
      <path d="M24 6C24 6 25 7 26 9" stroke="url(#max-gradient)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      
      {/* Additional hair texture */}
      <path d="M10 22C10 22 12 20 15 19" stroke="url(#max-gradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      
      {/* Glasses - prominent feature */}
      <circle cx="18" cy="26" r="3.5" fill="none" stroke="url(#max-gradient)" strokeWidth="2"/>
      <circle cx="30" cy="26" r="3.5" fill="none" stroke="url(#max-gradient)" strokeWidth="2"/>
      <line x1="21.5" y1="26" x2="26.5" y2="26" stroke="url(#max-gradient)" strokeWidth="2"/>
      
      {/* Eyes behind glasses */}
      <circle cx="18" cy="26" r="1.5" fill="#2d2d2d"/>
      <circle cx="30" cy="26" r="1.5" fill="#2d2d2d"/>
      <circle cx="18.5" cy="25.5" r="0.6" fill="white"/>
      <circle cx="30.5" cy="25.5" r="0.6" fill="white"/>
      
      {/* Minimal smile */}
      <path d="M19 33C19 33 21 34 24 34C27 34 29 33 29 33" stroke="#d4a574" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      
      <defs>
        <linearGradient id="max-gradient" x1="10" y1="6" x2="38" y2="38">
          <stop offset="0%" stopColor="#14F195"/>
          <stop offset="100%" stopColor="#0EA5E9"/>
        </linearGradient>
        <linearGradient id="max-bg" x1="1" y1="1" x2="47" y2="47">
          <stop offset="0%" stopColor="#14F195" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.12"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

export function JamieIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="24" cy="24" r="23" fill="url(#jamie-bg)"/>
      
      {/* Face - smaller */}
      <ellipse cx="24" cy="28" rx="9" ry="10" fill="#daa076" opacity="0.95"/>
      
      {/* EMPHASIZED: Bold spiky hair - larger, more dramatic */}
      <path d="M14 23L12 10M17 22L16 8M20 22L19.5 5M24 22L24 4M28 22L28.5 5M31 22L32 8M34 23L36 10" stroke="url(#jamie-gradient)" strokeWidth="4" strokeLinecap="round"/>
      <path d="M14 23L13 14" stroke="url(#jamie-gradient)" strokeWidth="3.5" strokeLinecap="round" opacity="0.6"/>
      <path d="M34 23L35 14" stroke="url(#jamie-gradient)" strokeWidth="3.5" strokeLinecap="round" opacity="0.6"/>
      
      {/* Hair base fill for volume */}
      <path d="M12 23C12 16 17 8 24 8C31 8 36 16 36 23" fill="url(#jamie-gradient)" opacity="0.3"/>
      
      {/* Excited eyes */}
      <circle cx="18" cy="27" r="2" fill="#2d2d2d"/>
      <circle cx="30" cy="27" r="2" fill="#2d2d2d"/>
      <circle cx="18.7" cy="26.3" r="0.8" fill="white"/>
      <circle cx="30.7" cy="26.3" r="0.8" fill="white"/>
      
      {/* Big smile */}
      <path d="M16 33C16 33 19 36 24 36C29 36 32 33 32 33" stroke="#c89968" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      
      {/* Raised eyebrows */}
      <path d="M15 24C15 24 16.5 22.5 19 22.5M29 24C29 24 27.5 22.5 25 22.5" stroke="url(#jamie-gradient)" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
      
      <defs>
        <linearGradient id="jamie-gradient" x1="12" y1="4" x2="36" y2="36">
          <stop offset="0%" stopColor="#F59E0B"/>
          <stop offset="100%" stopColor="#EF4444"/>
        </linearGradient>
        <linearGradient id="jamie-bg" x1="1" y1="1" x2="47" y2="47">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.12"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

export function SageIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="24" cy="24" r="23" fill="url(#sage-bg)"/>
      
      {/* Face - smaller */}
      <ellipse cx="24" cy="28" rx="9" ry="10" fill="#d4a076" opacity="0.95"/>
      
      {/* EMPHASIZED: Large top bun - prominent feature */}
      <circle cx="24" cy="8" r="5" fill="url(#sage-gradient)"/>
      <circle cx="24" cy="8" r="4" fill="url(#sage-gradient)" opacity="0.7"/>
      <path d="M22 10C22 10 23 11 24 11C25 11 26 10 26 10" stroke="url(#sage-gradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      
      {/* EMPHASIZED: Long flowing hair - larger and more prominent */}
      <path d="M10 22C10 22 10 17 13 13C16 9 21 8 24 8C27 8 32 9 35 13C38 17 38 22 38 22C38 22 35 20 28 19C24 18.5 20 18.5 16 19C10 20 10 22 10 22Z" fill="url(#sage-gradient)"/>
      <path d="M13 22C13 22 12 27 12 31C12 34 13 38 16 39M35 22C35 22 36 27 36 31C36 34 35 38 32 39" stroke="url(#sage-gradient)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M15 23C15 23 14 28 14 32M33 23C33 23 34 28 34 32" stroke="url(#sage-gradient)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      
      {/* Calm eyes */}
      <ellipse cx="19" cy="27" rx="1.5" ry="1.8" fill="#2d2d2d"/>
      <ellipse cx="29" cy="27" rx="1.5" ry="1.8" fill="#2d2d2d"/>
      <circle cx="19.3" cy="26.5" r="0.6" fill="white"/>
      <circle cx="29.3" cy="26.5" r="0.6" fill="white"/>
      
      {/* Peaceful smile */}
      <path d="M19 33C19 33 21 33.5 24 33.5C27 33.5 29 33 29 33" stroke="#b8856a" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      
      {/* Zen detail */}
      <circle cx="24" cy="23" r="1.2" fill="url(#sage-gradient)" opacity="0.7"/>
      
      <defs>
        <linearGradient id="sage-gradient" x1="10" y1="8" x2="38" y2="39">
          <stop offset="0%" stopColor="#10B981"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
        <linearGradient id="sage-bg" x1="1" y1="1" x2="47" y2="47">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#059669" stopOpacity="0.12"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

export function RileyIcon({ className = "w-8 h-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="24" cy="24" r="23" fill="url(#riley-bg)"/>
      
      {/* Face - smaller */}
      <ellipse cx="24" cy="28" rx="9" ry="10" fill="#dea37b" opacity="0.95"/>
      
      {/* EMPHASIZED: Bold asymmetric hair - larger sweep */}
      <path d="M38 22C38 22 38 17 35 11C32 6 27 4 24 4C21 4 16 6 13 11C11 14 10 18 10 22C10 22 13 19 18 17C21 16 25 16 25 16L38 22Z" fill="url(#riley-gradient)"/>
      <path d="M25 16C25 16 28 12 31 10C33 8.5 35.5 8 38 9" stroke="url(#riley-gradient)" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M27 17C27 17 29 14 31 12" stroke="url(#riley-gradient)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
      
      {/* Side shaved detail */}
      <path d="M10 22C10 22 10 25 10 28M11.5 23C11.5 23 11.5 26 11.5 29" stroke="url(#riley-gradient)" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      
      {/* Sharp knowing eyes */}
      <path d="M14 26L20 27.5L16 29Z" fill="#2d2d2d"/>
      <path d="M34 26L28 27.5L32 29Z" fill="#2d2d2d"/>
      <circle cx="17" cy="27.5" r="0.7" fill="white"/>
      <circle cx="31" cy="27.5" r="0.7" fill="white"/>
      
      {/* Smirk */}
      <path d="M19 33C19 33 21 32.5 24 32.5C26.5 32.5 28 33 28 33" stroke="#c4936f" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      <path d="M28 33C28 33 29 33.8 30 34" stroke="#c4936f" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      
      {/* Confident eyebrows */}
      <path d="M13 24C13 24 15 22 19 22M35 24C35 24 32 21 29 21" stroke="url(#riley-gradient)" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
      
      <defs>
        <linearGradient id="riley-gradient" x1="10" y1="4" x2="38" y2="34">
          <stop offset="0%" stopColor="#8B5CF6"/>
          <stop offset="100%" stopColor="#6366F1"/>
        </linearGradient>
        <linearGradient id="riley-bg" x1="1" y1="1" x2="47" y2="47">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.12"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

export function ConversationIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function SettingsIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

export function NewChatIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
