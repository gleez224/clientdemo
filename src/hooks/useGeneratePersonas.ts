import { useState } from 'react'
import type { BusinessContext, Persona } from '@/types'
import { SPEECH_RULES, OUTCOME_RULES } from '@/data/personas'

function buildPrompt(ctx: BusinessContext): string {
  return `Generate 5 client personas for someone practicing sales pitches for this business:

What they sell: ${ctx.whatYouSell}
Target client: ${ctx.targetClient}
Their pitch: ${ctx.pitch}
Pricing: ${ctx.pricing}

Generate 5 personas that represent realistic prospects for THIS specific business. Include these archetypes:
1. The Skeptic — burned before, needs proof
2. The Ghoster — interested but avoids commitment
3. The Negotiator — analytical, questions every number
4. Already Taken — working with someone else
5. The Operator — already successful, needs a strong reason to switch

Each persona must:
- Be a realistic prospect for THIS specific business (not generic)
- Have objections specific to THIS offer and pricing
- Have a realistic audience or follower count that makes them a valid prospect
- Have a corePrompt that puts them in character with specific knowledge of this offer

Return this exact JSON structure with no other text:
{
  "personas": [
    {
      "id": "skeptic",
      "name": "string (full name)",
      "archetype": "string (e.g. The Skeptic)",
      "followers": number,
      "following": number,
      "description": "string (one line, under 10 words)",
      "imageQuery": "string (3 words for image search e.g. serious male fitness)",
      "corePrompt": "string (2-4 sentences: who they are, what platform/audience they have, why they are a prospect for this specific offer, and their specific objections to the pricing and pitch)"
    }
  ]
}`
}

export function useGeneratePersonas() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async (ctx: BusinessContext): Promise<Persona[] | null> => {
    setIsGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system:
            'You are a sales training app that generates realistic client personas for practice pitches. Always respond with valid JSON only. No other text. No markdown. No code fences.',
          messages: [{ role: 'user', content: buildPrompt(ctx) }],
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const raw: string = data.content[0].text
      const jsonText = raw
        .replace(/^```(?:json)?\n?/, '')
        .replace(/\n?```$/, '')
        .trim()
      const parsed = JSON.parse(jsonText) as {
        personas: Array<{
          id: string
          name: string
          archetype: string
          followers: number
          following: number
          description: string
          imageQuery: string
          corePrompt: string
        }>
      }

      const personas: Persona[] = parsed.personas.map((p) => ({
        id: p.id,
        name: p.name,
        archetype: p.archetype,
        followers: Number(p.followers),
        following: Number(p.following),
        description: p.description,
        image: `https://source.unsplash.com/800x800/?${encodeURIComponent(p.imageQuery)},portrait`,
        systemPrompt: `${p.corePrompt}\n\n${SPEECH_RULES}\n\n${OUTCOME_RULES}`,
      }))

      return personas
    } catch (err) {
      console.error('Persona generation failed:', err)
      setError('Failed to generate personas. Check your connection and try again.')
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  return { generate, isGenerating, error }
}
