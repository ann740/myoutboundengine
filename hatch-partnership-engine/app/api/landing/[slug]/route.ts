import { NextRequest, NextResponse } from 'next/server'
import { getSequences, getContext } from '@/lib/store'
import { buildLandingPagePrompt } from '@/lib/prompts'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const sequences = getSequences()
  const seq = sequences.find(s => s.landingPageSlug === params.slug)
  if (!seq) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const context = getContext()
  if (!context) return NextResponse.json({ error: 'No context' }, { status: 400 })

  const prompt = buildLandingPagePrompt(seq.prospect, context)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  const raw = data.content?.[0]?.text || '{}'
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const pageData = JSON.parse(cleaned)
    return NextResponse.json({ pageData, prospect: seq.prospect, partnershipAngle: seq.partnershipAngle })
  } catch {
    return NextResponse.json({ error: 'Parse error', raw }, { status: 500 })
  }
}
