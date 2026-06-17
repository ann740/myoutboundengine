import { NextRequest, NextResponse } from 'next/server'
import { setContext, getContext } from '@/lib/store'
import { ProductContext } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const context: ProductContext = {
      companyName: body.companyName || 'Hatch',
      description: body.description || '',
      products: body.products || '',
      targetCustomers: body.targetCustomers || '',
      keyMetrics: body.keyMetrics || '',
      differentiators: body.differentiators || '',
      partnershipGoals: body.partnershipGoals || '',
      senderName: body.senderName || '',
      senderTitle: body.senderTitle || '',
      calendarLink: body.calendarLink || '',
      rawContext: body.rawContext || '',
    }
    setContext(context)
    return NextResponse.json({ success: true, context })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ context: getContext() })
}
