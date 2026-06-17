import { NextRequest, NextResponse } from 'next/server'
import { getSequences } from '@/lib/store'
import { Sequence } from '@/lib/types'

function toInstantlyFormat(sequences: Sequence[]) {
  return sequences.map(seq => ({
    email: seq.prospect.email,
    first_name: seq.prospect.firstName,
    last_name: seq.prospect.lastName,
    company: seq.prospect.company,
    custom_variables: {
      title: seq.prospect.title,
      industry: seq.prospect.industry,
      partnership_angle: seq.partnershipAngle,
      landing_page: seq.landingPageSlug ? `/for/${seq.landingPageSlug}` : '',
    },
    sequences: seq.steps.map(step => ({
      subject: step.subject,
      body: step.body,
      delay_days: step.delayDays,
    })),
    ab_group: seq.abGroup,
  }))
}

function toLemlistFormat(sequences: Sequence[]) {
  const rows: string[] = []
  const headers = ['email', 'firstName', 'lastName', 'companyName', 'title', 'industry', 'ab_group', 'landing_page',
    ...sequences[0]?.steps.flatMap((_, i) => [`step${i+1}_subject`, `step${i+1}_body`, `step${i+1}_delay`]) || []
  ]
  rows.push(headers.join(','))

  for (const seq of sequences) {
    const base = [
      seq.prospect.email,
      seq.prospect.firstName,
      seq.prospect.lastName,
      seq.prospect.company,
      seq.prospect.title,
      seq.prospect.industry,
      seq.abGroup,
      seq.landingPageSlug ? `/for/${seq.landingPageSlug}` : '',
    ]
    const stepCols = seq.steps.flatMap(s => [
      `"${s.subject.replace(/"/g, '""')}"`,
      `"${s.body.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      s.delayDays.toString()
    ])
    rows.push([...base, ...stepCols].join(','))
  }
  return rows.join('\n')
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const format = searchParams.get('format') || 'instantly'
  const sequences = getSequences().filter(s => s.steps.length > 0)

  if (format === 'lemlist') {
    const csv = toLemlistFormat(sequences)
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="hatch-sequences-lemlist.csv"',
      }
    })
  }

  const json = toInstantlyFormat(sequences)
  return new NextResponse(JSON.stringify(json, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="hatch-sequences-instantly.json"',
    }
  })
}
