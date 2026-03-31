# Client Acquisition Trainer — Project Spec

## What the app is

**Client Acquisition Trainer** — a standalone web app that teaches how to get clients through two modes: a learning mode and a live AI roleplay mode where the user practices pitching against real client personalities.

Three core sections:

1. **Root Causes** — a diagnostic panel. Eight cards explaining why a strong business still can't land clients. Each card is a specific, actionable diagnosis, not generic advice.

2. **The Framework** — Hormozi's 10-step warm outreach system pulled from transcript, laid out as a sequential step-by-step guide. Not a list, a progression.

3. **Client Demo** — the main feature. User picks a client persona (Skeptic, Ghoster, Negotiator, Already Taken, The Operator), and a live AI-powered chat starts where that persona plays a real prospect. No softballs. Practice pitching, handling objections, and closing until it clicks.

---

## Why the widget kept breaking

The widget called api.anthropic.com directly from the browser. In a real deployed web app, that fails for two reasons: **CORS blocks it**, and **the API key is exposed in the client**.

The fix is a **backend proxy** — a serverless function that sits between the frontend and the Anthropic API. Frontend calls `/api/chat`, server calls Anthropic, returns the response. Key is never exposed, CORS never triggers.

---

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Vercel serverless functions (`/api/chat.js`)
- **Hosting:** Vercel
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **API:** Anthropic `claude-sonnet-4-20250514` via backend proxy

---

## Screen Architecture

```
App (/)
├── Landing / Hero
│   └── CTA → enters the app
├── App Shell (after CTA)
│   ├── Nav tabs: Root Causes | Framework | Demo
│   ├── /causes — diagnosis cards
│   ├── /framework — 10-step progression
│   └── /demo
│       ├── Persona Select screen
│       └── Chat screen (per active persona)
```

Single-page app. No real routing needed — tab state controls the view. The only "page" transition is hero → app shell, and persona select → chat.

---

## UI/UX Description (screen by screen)

**Hero screen** — Dark background. Bold headline: *"You have a strong business. You just can't get clients."* Subline from transcript concept. Single CTA button: "Start Training." This screen slides up and fades out when clicked.

**App shell** — Clean, minimal. Dark-mode first. Fixed top nav with three tabs. Content area below. No sidebars.

**Root Causes tab** — Cards stagger-animate in on tab mount. Each card has a bold title and body copy. On hover, card lifts slightly with border accent. Clicking a card expands it to show deeper explanation (accordion behavior).

**Framework tab** — Numbered steps, laid out vertically. Each step animates in sequentially with a slight stagger. A thin vertical line connects them like a timeline. On hover, step node pulses. Clicking a step expands it to full detail.

**Demo — Persona Select** — Five persona cards in a grid using the Profile Card component (see animations doc). Each card shows name, archetype label, fake follower/like counts matching persona archetype, and description of what makes them hard. Cards animate in staggered. On hover, glow and spotlight effects activate. Clicking one triggers transition into chat screen.

**Demo — Chat screen** — Split-view feel. Top: persona identity bar (name, label, "Switch client" button) with the Voice Powered Orb showing AI state. Middle: chat window with message bubbles — client on left, user on right. Voice Powered Orb pulses when AI is generating, breathes slowly when idle. Bottom: AI Chat Input bar. On first load, client opens with their first line automatically.

---

## Persona Profile Data (for Profile Card component)

| Persona | Name | Followers | Following | Description |
|---|---|---|---|---|
| The Skeptic | Marcus Reid | 847 | 312 | Burned by agencies. Challenges everything. |
| The Ghoster | Jordan Cole | 12.4k | 891 | Busy founder. Always "almost" interested. |
| The Negotiator | Diana Walsh | 4.2k | 203 | Sharp. Interrogates every price point. |
| Already Taken | Ryan Marsh | 6.8k | 445 | Works with someone. Not looking to switch. |
| The Operator | Alex Monroe | 89.3k | 1.2k | Multi-business founder. Zero fluff tolerance. |

---

## Persona System Prompts (for API calls)

**The Skeptic (Marcus):** You are Marcus, 38, a small business owner burned by agencies multiple times. You're skeptical, direct, not rude. Challenge results. Say things like "that sounds like what everyone says" or "prove it." Only warm up if they say something specific and credible. Keep responses to 1-2 sentences.

**The Ghoster (Jordan):** You are Jordan, a busy founder, genuinely somewhat interested but chronically avoidant of decisions. Say things like "let me check my calendar," "this week is crazy," "can we do this over email?" Only commit if they make it extremely easy and specific. 1-2 sentences.

**The Negotiator (Diana):** You are Diana, interested in results but very budget-conscious. Push back on every price. Say things like "that seems expensive," "my guy does this for half," "what exactly am I paying for." Only move forward if they make a specific, compelling ROI case. 1-2 sentences.

**Already Taken (Ryan):** You are Ryan, working with an existing agency. Not looking to switch. Say things like "we already have someone for this," "switching is a headache." Only seriously engage if they ask smart questions about what's not working. 1-2 sentences.

**The Operator (Alex):** You are Alex, a successful multi-business founder. Impatient, zero tolerance for fluff. Ask things like "what's the actual mechanism?", "give me a real number," "why should I believe that?" Cut through vague claims immediately. If they're direct and sharp, engage more. 1-2 sentences.

---

## State Architecture

```
App level
├── activeTab: 'causes' | 'framework' | 'demo'
├── appEntered: boolean (hero → shell transition)

Demo level
├── activePersona: Persona | null
├── chatHistory: Message[] (must always alternate user/assistant)
├── isLoading: boolean
├── error: string | null

Message type
├── role: 'user' | 'assistant'
├── content: string
```

**Critical rule for chatHistory:** it must **always start with a user message** and **strictly alternate**. The opening client line is seeded by sending a hidden system prompt trigger as the user role — the client's response comes back as assistant. That pair gets stored before any real conversation starts.

---

## Build Order

1. **Backend proxy first** — `api/chat.js` Vercel function, tested standalone with curl before the frontend touches it
2. **App shell + routing logic** — tabs, transitions, state setup
3. **Root Causes tab** — static content, stagger animation
4. **Framework tab** — static content, timeline animation
5. **Persona select screen** — Profile Card components, grid, click transition
6. **Chat screen** — Chat Bubble + Chat Message List + AI Chat Input, Voice Powered Orb
7. **API integration** — hook chat to `/api/chat`, seed opening message, full conversation loop
8. **Polish** — hero screen, page transitions, mobile layout

---

## Known Risks

- Chat history must start user → assistant, never assistant → user. Any deviation breaks the API call silently.
- The backend must strip and re-attach the API key server-side. Never in `.env` on the client.
- Stale closures in the send handler — `chatHistory` state used inside an async function needs a ref alongside state or you'll send stale history after the second message.
- Mobile keyboard push — on iOS the chat input needs to account for the virtual keyboard pushing the layout up.
- Voice Powered Orb requires microphone permission — handle the denied/unavailable case gracefully.

---

## Animation Components Reference

See `docs/animations.md` for all 12 component prompts with full code.
