'use client'
import { Sequence } from '@/lib/types'

export default function ABDashboard({ sequences }: { sequences: Sequence[] }) {
  const groups = ['A', 'B', 'C'] as const

  const stats = groups.map(g => {
    const seqs = sequences.filter(s => s.abGroup === g)
    return {
      group: g,
      count: seqs.length,
      bodyLength: g === 'A' ? 'Short (3-4 sentences)' : g === 'B' ? 'Medium (5-7 sentences)' : 'Long (8-10 sentences)',
      subjectStyle: g === 'A' ? 'Question-based' : g === 'B' ? 'Bold declarative' : 'Reference-based',
      ctaStyle: g === 'A' ? 'Soft / exploratory' : g === 'B' ? 'Direct / specific ask' : 'Resource offer',
      companies: seqs.map(s => s.prospect.company).join(', ') || '—',
    }
  })

  const total = sequences.length

  return (
    <div className="space-y-8">
      <div>
        <div className="label mb-2">A/B Testing</div>
        <h1 className="text-2xl font-display font-semibold text-white mb-2">Test & Optimize</h1>
        <p className="text-white/50 text-sm">
          Each sequence is auto-assigned to a test group. As replies come in, winning variants surface.
          Connect your Instantly or Lemlist webhook to feed reply data back.
        </p>
      </div>

      {/* Group cards */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.group} className={`card ${s.count > 0 ? '' : 'opacity-50'}`}>
            <div className={`text-2xl font-bold font-mono mb-3 ${
              s.group === 'A' ? 'text-blue-400' :
              s.group === 'B' ? 'text-purple-400' : 'text-orange-400'
            }`}>
              Group {s.group}
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <div className="label mb-1">Sequences</div>
                <div className="text-white font-medium">{s.count} of {total}</div>
              </div>
              <div>
                <div className="label mb-1">Subject Style</div>
                <div className="text-white/60">{s.subjectStyle}</div>
              </div>
              <div>
                <div className="label mb-1">Body Length</div>
                <div className="text-white/60">{s.bodyLength}</div>
              </div>
              <div>
                <div className="label mb-1">CTA</div>
                <div className="text-white/60">{s.ctaStyle}</div>
              </div>
              {s.companies !== '—' && (
                <div>
                  <div className="label mb-1">Companies</div>
                  <div className="text-white/40 text-xs">{s.companies}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* How to close the loop */}
      <div className="card space-y-4">
        <div className="label">Closing the Optimization Loop</div>
        <div className="space-y-3 text-sm text-white/60">
          <p>
            Once sequences are live in Instantly or Lemlist, mark positive replies here to surface winning patterns.
            The system tracks which group, subject style, body length, and CTA is generating the most positive replies.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white text-sm font-medium mb-1">Positive reply</div>
              <div className="text-white/40 text-xs">Person expresses interest in a call or partnership</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white text-sm font-medium mb-1">Neutral reply</div>
              <div className="text-white/40 text-xs">Not now, but leave the door open</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white text-sm font-medium mb-1">Negative reply</div>
              <div className="text-white/40 text-xs">Not interested / wrong person</div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="label mb-2">Webhook endpoint</div>
          <div className="font-mono text-xs text-hatch-teal bg-white/5 rounded px-3 py-2">
            POST /api/webhooks/reply
          </div>
          <div className="text-white/30 text-xs mt-2">Configure this in Instantly → Settings → Webhooks or Lemlist → Integrations → Webhooks</div>
        </div>
      </div>

      {/* Goal tracker */}
      <div className="card">
        <div className="label mb-4">Weekly Goal Tracker</div>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-hatch-teal mb-1">10</div>
            <div className="text-white/40 text-xs">Positive replies / week target</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-1">0.5–1%</div>
            <div className="text-white/40 text-xs">Target reply-to-meeting rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white/40 mb-1">—</div>
            <div className="text-white/40 text-xs">Replies logged so far</div>
          </div>
        </div>
      </div>
    </div>
  )
}
