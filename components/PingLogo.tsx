/**
 * Ping Logo Component
 * Brand logo using the turquoise/green gradient "p"
 */

interface PingLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function PingLogo({ size = 'md', className = '' }: PingLogoProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <svg 
      className={`${sizes[size]} ${className}`}
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M8 4C8 4 8 4 8 4C8 4 4 4 4 8C4 12 4 20 4 24C4 28 8 28 8 28C12 28 20 28 24 28C28 28 28 24 28 24C28 20 28 12 28 8C28 4 24 4 24 4C20 4 12 4 8 4Z" 
        fill="url(#ping-gradient)"
      />
      <path 
        d="M12 10C12 8.89543 12.8954 8 14 8H16C18.7614 8 21 10.2386 21 13C21 15.7614 18.7614 18 16 18H14V22C14 22.5523 13.5523 23 13 23C12.4477 23 12 22.5523 12 22V10Z" 
        fill="#0A0A12"
      />
      <defs>
        <linearGradient id="ping-gradient" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14F195"/>
          <stop offset="100%" stopColor="#0EA5E9"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

interface PingWordmarkProps {
  className?: string
}

export function PingWordmark({ className = '' }: PingWordmarkProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <PingLogo size="md" />
      <span className="text-2xl font-bold bg-gradient-to-r from-[#14F195] to-[#0EA5E9] text-transparent bg-clip-text">
        Ping
      </span>
    </div>
  )
}
