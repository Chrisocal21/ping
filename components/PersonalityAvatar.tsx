import { memo } from 'react'
import { MaxIcon, JamieIcon, SageIcon, RileyIcon } from './icons/PersonalityIcon'

interface PersonalityAvatarProps {
  personalityId: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const PersonalityAvatar = memo(function PersonalityAvatar({ personalityId, size = 'md' }: PersonalityAvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  }

  const renderIcon = () => {
    const iconClass = iconSizeClasses[size]
    
    switch (personalityId) {
      case 'max':
        return <MaxIcon className={iconClass} />
      case 'jamie':
        return <JamieIcon className={iconClass} />
      case 'sage':
        return <SageIcon className={iconClass} />
      case 'riley':
        return <RileyIcon className={iconClass} />
      default:
        return <MaxIcon className={iconClass} />
    }
  }

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center`}>
      {renderIcon()}
    </div>
  )
})
