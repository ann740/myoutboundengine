'use client'
import { useState } from 'react'
import { Sequence } from '@/lib/types'

export default function SequenceViewer({ sequences }: { sequences: Sequence[] }) {
  const [selected, setSelected] = useState<string | null>(sequences[0]?.id || null)
  const [activeStep, setActiveStep] = useState(0)

  const seq = sequences.find(s => s.id === selected)

  if (sequences.length === 0) {
    return (
      <div className="text-center py-16 text-white/20 text-sm">
        No sequences generated yet. Add prospects and click Generate.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="label mb-2">Generated Sequences</div>
        <h1 className="text-2xl font-display font-semibold text-white mb-2">Review & Export</h1>
        <p className="text-white/50 text-sm">Review each sequence before exporting to Instantly or Lemlist.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Prospect list */}
        <div className="space-y-2">
          {sequences.map(s => (
            <button
              key={s.id}
              onClick={() => { setSelected(s.id); setActiveStep(0) }}
              className={`w-full text-left card py-3 px-4 transition-all ${
                selected === s.id ? 'border-hatch-teal/40 bg-hatch-teal/5' : 'hover:border-white/20'
              }`}
            >
              <div className="font-medium text-white text-sm">{s.prospect.firstName} {s.prospect.lastName}</div>
              <div className="text-white/40 text-xs mt-0.5">{s.prospect.company}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                  s.abGroup === 'A' ? 'bg-blue-500/10 text-blue-400' :
                  s.abGroup === 'B' ? 'bg-purple-500/10 text-purple-400' :
                  'bg-orange-500/10 text-orange-400'
                }`}>
                  Group {s.abGroup}
                </span>
                <span className="text-white/20 text-xs">{s.steps.length} steps</span>
              </div>
            </button>
          ))}
        </div>

        {/* Sequence detail */}
        {seq && (
          <div className="col-span-2 space-y-4">
            {/* Partnership angle */}
            {seq.partnershipAngle && (
              <div className="card bg-hatch-teal/5 border-hatch-teal/20">
                <div className="label mb-1">Partnership Angle</div>
                <p className="text-white/70 text-sm">{seq.partnershipAngle}</p>
                {seq.sharedOKRs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {seq.sharedOKRs.map((okr, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/40">{okr}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step tabs */}
            <div className="flex gap-1 border-b border-white/10 pb-0">
              {seq.steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`px-4 py-2.5 text-sm transition-all ${
                    activeStep === i ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  Email {i + 1}
                  {i > 0 && <span className="ml-1 text-xs text-white/30">+{step.delayDays}d</span>}
                </button>
              ))}
            </div>

            {/* Email detail */}
            {seq.steps[activeStep] && (
              <div className="card space-y-4">
                <div>
                  <div className="label mb-1">Subject</div>
                  <div className="text-white font-medium">{seq.steps[activeStep].subject}</div>
                </div>
                <div>
                  <div className="label mb-2">Body</div>
                  <div className="text-white/70 text-sm whitespace-pre-wrap leading-relaxed bg-white/3 rounded-lg p-4 border border-white/5">
                    {seq.steps[activeStep].body}
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-white/30 pt-2 border-t border-white/10">
                  <span>Group {seq.steps[activeStep].variant}</span>
                  <span>{seq.steps[activeStep].bodyLength} body</span>
                  <span>{seq.steps[activeStep].ctaStyle} CTA</span>
                  <span>Send day +{seq.steps[activeStep].delayDays}</span>
                </div>
              </div>
            )}

            {/* Landing page link */}
            {seq.landingPageSlug && (
              <div className="card flex items-center justify-between">
                <div>
                  <div className="label mb-1">Personalized Landing Page</div>
                  <div className="text-white/40 text-xs font-mono">/for/{seq.landingPageSlug}</div>
                </div>
                <a
                  href={`/for/${seq.landingPageSlug}`}
                  target="_blank"
                  className="btn-ghost text-xs"
                >
                  Preview →
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Export bar */}
      <div className="card flex items-center justify-between bg-white/3">
        <div className="text-white/50 text-sm">{sequences.length} sequences ready to export</div>
        <div className="flex gap-3">
          <a href="/api/export?format=instantly" download className="btn-primary text-xs">Export for Instantly</a>
          <a href="/api/export?format=lemlist" download className="btn-ghost text-xs">Export for Lemlist</a>
        </div>
      </div>
    </div>
  )
}
