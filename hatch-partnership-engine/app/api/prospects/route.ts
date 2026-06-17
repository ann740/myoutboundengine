import { NextRequest, NextResponse } from 'next/server'
import { getProspects, upsertProspect } from '@/lib/store'
import { Prospect } from '@/lib/types'

export async function GET() {
  return NextResponse.json({ prospects: getProspects() })
}

export async function POST(req: NextRequest) {
  try {
    const { prospects } = await req.json()
    const saved: Prospect[] = []

    for (const p of prospects) {
      const prospect: Prospect = {
        id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        email: p.email || p.Email || '',
        firstName: p.firstName || p['First Name'] || p.first_name || '',
        lastName: p.lastName || p['Last Name'] || p.last_name || '',
        title: p.title || p.Title || p['Job Title'] || '',
        company: p.company || p.Company || '',
        industry: p.industry || p.Industry || '',
        linkedinUrl: p.linkedinUrl || p.LinkedIn || '',
        revenue: p.revenue || p.Revenue || p['Annual Revenue'] || '',
        employees: p.employees || p.Employees || p['Employee Count'] || '',
        notes: p.notes || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      if (prospect.email) {
        upsertProspect(prospect)
        saved.push(prospect)
      }
    }

    return NextResponse.json({ saved: saved.length, prospects: saved })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
