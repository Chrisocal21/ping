'use client'

import { useEffect } from 'react'

export function PWAInstaller() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration.scope)
          
          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60000) // Check every minute
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error)
        })

      // Handle updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Service Worker updated - reloading')
        window.location.reload()
      })
    }

    // Detect if app is running as PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches
    if (isPWA) {
      console.log('📱 Running as PWA')
      document.body.classList.add('pwa-mode')
    }

    // Handle install prompt
    let deferredPrompt: any = null

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt = e
      console.log('💾 Install prompt available')
      
      // Show custom install button/banner
      const installBanner = document.getElementById('pwa-install-banner')
      if (installBanner) {
        installBanner.style.display = 'block'
      }
    })

    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA installed successfully')
      deferredPrompt = null
      
      // Hide install banner
      const installBanner = document.getElementById('pwa-install-banner')
      if (installBanner) {
        installBanner.style.display = 'none'
      }
    })

    // Global handler for install button
    const handleInstallClick = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt()
        deferredPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted install')
          }
          deferredPrompt = null
        })
      }
    }

    // Attach to global scope for install buttons
    ;(window as any).installPWA = handleInstallClick

  }, [])

  return null // This is a utility component with no UI
}
