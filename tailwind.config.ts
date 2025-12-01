import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#111118',
        'ai-bubble': '#2a2a35',
        'user-bubble': '#0b84fe',
        'tone-safe': '#30d158',
        'tone-curious': '#0b84fe',
        'tone-playful': '#ff9f0a',
        'tone-bold': '#ff375f',
      },
    },
  },
  plugins: [],
}
export default config
