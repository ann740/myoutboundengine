import { NextRequest, NextResponse } from 'next/server'
import { getProspect, getContext, upsertSequence, upsertProspect } from '@/lib/store'
import { buildSequencePrompt, buildLandingPagePrompt } from '@/lib/prompts'
import { Sequence, EmailStep } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const { prospectId } = await req.json()
    if (!prospectId) return NextResponse.json({ error: 'prospectId required' }, { status: 400 })

    const prospect = getProspect(prospectId)
    if (!prospect) return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })

    const context = getContext()
    if (!context) return NextResponse.json({ error: 'Product context not configured' }, { status: 400 })

    const abGroup = (['A', 'B', 'C'] as const)[Math.floor(Math.random() * 3)]
    const prompt = buildSequencePrompt(prospect, context, abGroup)

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: `Claude API error: ${err}` }, { status: 500 })
    }

    const data = await response.json()
    const raw = data.content?.[0]?.text || ''

    let parsed: { steps: any[] }
    try {
      const cleaned = raw.replace(/```json|```/g, '').trim()
      parsed = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: 'Failed to parse sequence JSON', raw }, { status: 500 })
    }

    const steps: EmailStep[] = parsed.steps.map((s: any, i: number) => ({
      stepNumber: s.stepNumber || i + 1,
      subject: s.subject,
      body: s.body,
      delayDays: s.delayDays ?? [0, 3, 7, 14][i],
      variant: abGroup,
      bodyLength: abGroup === 'A' ? 'short' : abGroup === 'B' ? 'medium' : 'long',
      ctaStyle: abGroup === 'A' ? 'soft' : abGroup === 'B' ? 'direct' : 'resource',
    }))

    const firstStep = parsed.steps[0]
    const slug = `${prospect.company.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${prospect.lastName.toLowerCase()}`

    const sequence: Sequence = {
      id: `seq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      prospectId: prospect.id,
      prospect,
      steps,
      landingPageSlug: slug,
      partnershipAngle: firstStep?.partnershipAngle || '',
      sharedOKRs: firstStep?.sharedOKRs || [],
      generatedAt: new Date().toISOString(),
      abGroup,
    }

    upsertSequence(sequence)
    upsertProspect({ ...prospect, status: 'generated' })

    return NextResponse.json({ sequence })
  } catch (err: any) {
    console.error('Generate sequences error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  const { getSequences } = await import('@/lib/store')
  return NextResponse.json({ sequences: getSequences() })
}
