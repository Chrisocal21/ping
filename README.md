# Ping - AI Companion App

A quick signal when you need one. Your smart-mouthed AI companion for conversations, emotions, and life — without the therapy vibes.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the landing page.

Navigate to [http://localhost:3000/chat](http://localhost:3000/chat) to see the chat interface.

## Project Structure

```
ping/
├── app/
│   ├── chat/
│   │   └── page.tsx          # Chat interface (text messaging UI)
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── public/                    # Static assets
├── overview.md                # Complete product specification
├── gameplan.md                # Development roadmap
└── package.json
```

## Tech Stack

- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Ready for Vercel

## Pages

### Landing Page (`/`)
- Product overview
- Feature highlights
- Personality preview
- CTA to start chatting

### Chat Page (`/chat`)
- Clean text-message-style interface
- Max personality (default)
- Message bubbles (AI and user)
- Quick action buttons
- Typing indicator
- Ready for API integration

## Deploy to Vercel

The easiest way to deploy is using the Vercel Platform:

```bash
npm run build
```

Then push to GitHub and connect with Vercel for automatic deployments.

## Next Steps

1. Integrate AI API (OpenAI/Anthropic)
2. Implement personality selection
3. Add social practice scenarios
4. Build safety system
5. Implement user state management

See `gameplan.md` for detailed development roadmap.
