# Build Order — Client Acquisition Trainer

Follow this sequence exactly. Do not skip ahead. One slice fully working before the next starts.

---

## Step 1 — Backend Proxy

Build and test the Vercel serverless function before ANY frontend work.

File: `api/chat.js`

```js
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, system } = req.body;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: system,
      messages: messages,
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Anthropic API error:', error);
    return res.status(500).json({ error: 'API request failed' });
  }
}
```

Test with curl before touching the frontend:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Say hello"}],"system":"You are a test."}'
```

---

## Step 2 — App Shell + State

- React + Vite project setup
- Tailwind CSS configured
- shadcn/ui initialized
- Three-tab nav: Root Causes | Framework | Demo
- `appEntered` boolean state controlling hero → shell transition
- `activeTab` state controlling tab view
- Framer Motion installed

---

## Step 3 — Root Causes Tab

- 8 diagnosis cards with title + body copy (data below)
- Stagger fade-up animation on mount using Animated Text component
- Card Spotlight hover effect on each card
- Glowing Effect border on each card
- Accordion expand/collapse on click

Root Causes data:
1. Volume problem — Not reaching out to enough people. 100/day is the floor.
2. Broken pipeline stage — Find which stage is leaking, not the whole system.
3. Offer has hidden costs — Find what people are seeing that you aren't pricing.
4. No proof, no trust — No testimonials, no case studies, no receipts.
5. Pitching instead of asking — ACA framework converts because it never feels like a sell.
6. Generic outreach — 30 seconds of personalization is the entire difference.
7. You left the work — Know where the bodies are buried in your pipeline.
8. Truth isn't your ally yet — Own the negative, amplify the positive.

---

## Step 4 — Framework Tab

- 10-step Hormozi system laid out vertically
- Thin vertical timeline line connecting steps
- Sequential stagger animation on mount
- Step node pulses on hover
- Click to expand full detail

Framework steps:
1. Build your list — email + social + phone contacts
2. Pick one platform — start where you have the most people
3. Personalize every message — 30 seconds, reference something real
4. Reach out 100/day — everything is hard before it's easy
5. ACA when they reply — acknowledge, compliment, ask
6. Ask who they know, not if they'll buy — asking for a favor, not selling
7. Offer free with 3 conditions — use it, give feedback, leave a review
8. Cycle the list, collect referrals — from 3,000 outreaches you'll get 5 takers
9. Raise price as demand builds — free → 80% off → 60% → 40% → 20% → full
10. Keep them warm always — check in, post results, provide value

---

## Step 5 — Persona Select Screen

- 5 Profile Card components in a responsive grid
- Staggered entrance animation (40ms delay each)
- Card Spotlight + Glowing Effect on each card
- Use persona data from CLAUDE.md for names, followers, following, descriptions
- Clicking a card sets `activePersona` and transitions to chat screen
- Persona cards scale down + fade out, chat slides in from right

---

## Step 6 — Chat Screen

- Persona identity bar at top (name, label, Voice Powered Orb, "Switch client" button)
- Chat Message List (jakobhoeg) for auto-scroll container
- Chat Bubble components for messages
  - Client messages: `variant="received"` left side
  - User messages: `variant="sent"` right side
  - `isLoading={true}` bubble while API is generating
- AI Chat Input bar at bottom
- Voice Powered Orb: idle state by default, activate when `isLoading === true`

---

## Step 7 — API Integration

Critical rules:
- chatHistory MUST start with user message, strictly alternate user/assistant
- Seed opening message: send hidden trigger as `role: "user"`, store response pair before real conversation
- Use `useRef` alongside `useState` for chatHistory to prevent stale closures in async handlers
- Frontend calls `/api/chat` (never api.anthropic.com directly)
- System prompt comes from persona data in CLAUDE.md

Opening message seed pattern:
```js
const openingTrigger = 'Someone just reached out to pitch their service. Open naturally as your character — realistic, not over-the-top. 1-2 sentences max.';

// First call
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    system: activePersona.systemPrompt,
    messages: [{ role: 'user', content: openingTrigger }]
  })
});

const data = await response.json();
const clientOpener = data.content[0].text;

// Store BOTH the trigger and response in history
setChatHistory([
  { role: 'user', content: openingTrigger },
  { role: 'assistant', content: clientOpener }
]);
```

---

## Step 8 — Polish

- Hero screen: dark background, Gradient Dots, Typewriter Effect headline, Shimmer Button CTA
- Spotlight Cursor: global, add to app root
- Hero → app shell transition: hero slides up, shell fades in (Framer Motion)
- Tab switch transitions: cross-fade + slight Y slide
- Mobile layout: chat input accounts for iOS keyboard push
- Error states: visible error message if API fails
- Voice Powered Orb: handle microphone permission denied gracefully

---

## Environment Variables

```env
ANTHROPIC_API_KEY=your_key_here
```

Never expose this on the client. Only used server-side in `api/chat.js`.
