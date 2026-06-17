import { NextRequest, NextResponse } from 'next/server'
import { getSequences, upsertSequence, upsertProspect, getProspect } from '@/lib/store'

// Receives reply webhooks from Instantly or Lemlist
// Maps replies back to sequences for A/B optimization

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Normalize across Instantly and Lemlist formats
    const email = body.email || body.lead_email || body.contact?.email || ''
    const replyType = body.reply_type || body.type || 'neutral'
    const sentiment = replyType.includes('positive') || replyType.includes('interested') ? 'replied_positive'
      : replyType.includes('negative') || replyType.includes('unsubscribe') ? 'replied_negative'
      : 'replied_neutral'

    if (!email) return NextResponse.json({ error: 'No email in payload' }, { status: 400 })

    const sequences = getSequences()
    const seq = sequences.find(s => s.prospect.email.toLowerCase() === email.toLowerCase())

    if (seq) {
      const prospect = getProspect(seq.prospectId)
      if (prospect) {
        upsertProspect({ ...prospect, status: sentiment })
      }
      upsertSequence({ ...seq, prospect: { ...seq.prospect, status: sentiment } })
    }

    return NextResponse.json({ success: true, email, sentiment })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
