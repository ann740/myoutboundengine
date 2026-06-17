'use client'
import { useState } from 'react'
import { ProductContext } from '@/lib/types'

const DEFAULT_CONTEXT: ProductContext = {
  companyName: 'Hatch',
  description: 'Hatch is a $200M revenue, profitable sleep technology company helping every member of the family get better sleep. We make connected bedside devices and premium sleep content for babies, kids, and adults. Nearly 1 in 4 US homes with a baby uses Hatch. We combine hardware, software, and subscription content into a single daily habit at the most intimate moment of people\'s day.',
  products: 'Rest (baby/toddler sound machine + light + content), Restore (adult sleep clock with sleep tracking, sound, light), Hatch Sleep Membership (premium audio content, sleep coaching, bedtime stories), Hatch Sleep Clock (HSC) — contactless radar-based sleep tracker launching Q3 2025',
  targetCustomers: 'Families with young children (primary), adults 25-45 who prioritize sleep and wellness (growing segment)',
  keyMetrics: '$200M gross revenue, $65M subscription revenue at 100% gross margin growing 60% YoY, $8.5M EBITDA, nearly 1 in 4 US homes with a baby, 150 employees',
  differentiators: 'The only company with deep sleep data across every member of the family (baby, child, adult) from a single trusted bedside device. Daily habit — people use Hatch every night. Combination of hardware + content + coaching creates an engagement layer no wearable can match. Trusted brand with massive organic penetration in young families.',
  partnershipGoals: 'Build strategic partnerships with large consumer, health, wellness, and tech companies that share our mission of helping families thrive. Looking for distribution, integration, co-marketing, and data partnerships that expand our reach and create mutual value.',
  senderName: 'Ann Crady Weiss',
  senderTitle: 'CEO & Co-founder',
  calendarLink: '',
  rawContext: '',
}

export default function ContextSetup({ context, onSave }: {
  context: ProductContext | null
  onSave: (ctx: ProductContext) => void
}) {
  const [form, setForm] = useState<ProductContext>(context || DEFAULT_CONTEXT)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/analyze-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      onSave(data.context)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const Field = ({ label, field, multiline = false, rows = 3 }: {
    label: string
    field: keyof ProductContext
    multiline?: boolean
    rows?: number
  }) => (
    <div className="space-y-2">
      <label className="label block">{label}</label>
      {multiline ? (
        <textarea
          className="input resize-none"
          rows={rows}
          value={form[field] as string}
          onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
        />
      ) : (
        <input
          className="input"
          value={form[field] as string}
          onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
        />
      )}
    </div>
  )

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <div className="label mb-2">Step 1 of 4</div>
        <h1 className="text-2xl font-display font-semibold text-white mb-2">Product & Partnership Context</h1>
        <p className="text-white/50 text-sm">This is the brain behind every sequence. The more specific, the better the personalization.</p>
      </div>

      <div className="card space-y-6">
        <div className="label text-white/40">SENDER</div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Your Name" field="senderName" />
          <Field label="Your Title" field="senderTitle" />
        </div>
        <Field label="Calendar / Booking Link" field="calendarLink" />
      </div>

      <div className="card space-y-6">
        <div className="label text-white/40">COMPANY</div>
        <Field label="Company Description" field="description" multiline rows={4} />
        <Field label="Products" field="products" multiline rows={3} />
        <Field label="Key Metrics (the numbers that impress)" field="keyMetrics" multiline rows={2} />
        <Field label="Differentiators" field="differentiators" multiline rows={3} />
      </div>

      <div className="card space-y-6">
        <div className="label text-white/40">PARTNERSHIP GOALS</div>
        <Field label="What kind of partnerships are you seeking?" field="partnershipGoals" multiline rows={3} />
        <Field label="Target Customers / ICP" field="targetCustomers" multiline rows={2} />
      </div>

      <div className="card space-y-4">
        <div className="label text-white/40">ADDITIONAL CONTEXT (optional)</div>
        <p className="text-white/40 text-xs">Paste any additional context — press releases, one-pagers, talking points — that should inform the sequences.</p>
        <textarea
          className="input resize-none"
          rows={5}
          placeholder="Paste additional context here..."
          value={form.rawContext}
          onChange={e => setForm(prev => ({ ...prev, rawContext: e.target.value }))}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary w-full justify-center"
      >
        {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Context'}
      </button>
    </div>
  )
}
