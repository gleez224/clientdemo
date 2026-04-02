import { useState } from 'react'
import type { BusinessContext, Persona } from '@/types'
import { SPEECH_RULES, OUTCOME_RULES } from '@/data/personas'

function buildPrompt(ctx: BusinessContext): string {
  return `Generate 6 client personas for someone practicing sales pitches for this business:

What they sell: ${ctx.whatYouSell}
Target client: ${ctx.targetClient}
Their pitch: ${ctx.pitch}
Pricing: ${ctx.pricing}

Generate exactly 6 personas that represent realistic prospects for THIS specific business. Include these archetypes:
1. The Skeptic — burned before, needs proof
2. The Ghoster — interested but avoids commitment
3. The Negotiator — analytical, questions every number
4. Already Taken — working with someone else
5. The Operator — already successful, needs a strong reason to switch
6. The Open Door — genuinely interested, no current contracts, easy to close IF the pitch is personalized. Warm, calm, not a pushover.

Each persona must:
- Be a realistic prospect for THIS specific business (not generic)
- Have objections specific to THIS offer and pricing
- Have a realistic audience or follower count that makes them a valid prospect
- Have a corePrompt that puts them in character with specific knowledge of this offer

Keep each corePrompt concise — maximum 150 words.
Focus on: who they are, their unlock condition, their main objection, and the outcome tags.
Do not write lengthy paragraphs.

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
      "gender": "male" or "female" (match the name you chose),
      "corePrompt": "string (who they are, their platform/audience, their specific objection to this offer and pricing, and their unlock condition — max 150 words)"
    }
  ]
}`
}

async function fetchPortrait(gender: 'male' | 'female'): Promise<string> {
  try {
    const res = await fetch(
      `https://randomuser.me/api/?gender=${gender}&results=1&inc=picture&nat=us`
    )
    if (!res.ok) return ''
    const data = await res.json()
    return data.results[0]?.picture?.large ?? ''
  } catch {
    return ''
  }
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
          maxTokens: 4000,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const raw: string = data.content[0].text
      const jsonText = raw
        .replace(/^```(?:json)?\n?/, '')
        .replace(/\n?```$/, '')
        .trim()
      type RawPersona = {
        id: string
        name: string
        archetype: string
        followers: number
        following: number
        description: string
        gender: 'male' | 'female'
        corePrompt: string
      }
      type ParsedResult = { personas: RawPersona[] }

      let parsed: ParsedResult
      try {
        parsed = JSON.parse(jsonText) as ParsedResult
      } catch {
        // Attempt to salvage fully-written personas from a truncated response
        const lastValidIndex = jsonText.lastIndexOf('},')
        if (lastValidIndex > 0) {
          try {
            const partial = jsonText.substring(0, lastValidIndex) + '}]}'
            const salvaged = JSON.parse(partial) as ParsedResult
            if (salvaged.personas?.length > 0) {
              parsed = salvaged
            } else {
              throw new Error('empty')
            }
          } catch {
            throw new Error('Persona generation failed — response was cut off. Try again.')
          }
        } else {
          throw new Error('Persona generation failed — response was cut off. Try again.')
        }
      }

      // Fetch all portraits in parallel
      const portraits = await Promise.all(
        parsed.personas.map((p) => fetchPortrait(p.gender))
      )

      const personas: Persona[] = parsed.personas.map((p, i) => ({
        id: p.id,
        name: p.name,
        archetype: p.archetype,
        followers: Number(p.followers),
        following: Number(p.following),
        description: p.description,
        image: portraits[i],
        systemPrompt: `${p.corePrompt}\n\n${SPEECH_RULES}\n\n${OUTCOME_RULES}`,
      }))

      return personas
    } catch (err) {
      console.error('Persona generation failed:', err)
      const msg = err instanceof Error ? err.message : null
      setError(msg ?? 'Generation timed out — tap retry to try again.')
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  return { generate, isGenerating, error }
}
