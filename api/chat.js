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
