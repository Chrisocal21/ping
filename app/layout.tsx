import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ping - Your AI Companion',
  description: 'A quick signal when you need one. Your smart-mouthed AI companion for conversations, emotions, and life.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
