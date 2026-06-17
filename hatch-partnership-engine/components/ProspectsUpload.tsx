'use client'
import { useState, useRef } from 'react'
import Papa from 'papaparse'
import { Prospect, Sequence, ProductContext } from '@/lib/types'

export default function ProspectsUpload({ prospects, context, onUpdate, onSequencesGenerated }: {
  prospects: Prospect[]
  context: ProductContext | null
  onUpdate: (p: Prospect[]) => void
  onSequencesGenerated: (s: Sequence[]) => void
}) {
  const [generating, setGenerating] = useState<Set<string>>(new Set())
  const [generatingAll, setGeneratingAll] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const res = await fetch('/api/prospects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prospects: results.data }),
        })
        const data = await res.json()
        onUpdate([...prospects, ...(data.prospects || [])])
      }
    })
  }

  const generateOne = async (prospect: Prospect) => {
    if (!context) { alert('Set up product context first.'); return }
    setGenerating(prev => new Set(prev).add(prospect.id))
    try {
      const res = await fetch('/api/generate-sequences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospectId: prospect.id }),
      })
      const data = await res.json()
      if (data.sequence) {
        onSequencesGenerated([data.sequence])
        onUpdate(prospects.map(p => p.id === prospect.id ? { ...p, status: 'generated' } : p))
      }
    } finally {
      setGenerating(prev => { const next = new Set(prev); next.delete(prospect.id); return next })
    }
  }

  const generateAll = async () => {
    if (!context) { alert('Set up product context first.'); return }
    const pending = prospects.filter(p => p.status === 'pending')
    setGeneratingAll(true)
    const generated: Sequence[] = []
    for (const p of pending) {
      setGenerating(prev => new Set(prev).add(p.id))
      try {
        const res = await fetch('/api/generate-sequences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prospectId: p.id }),
        })
        const data = await res.json()
        if (data.sequence) {
          generated.push(data.sequence)
          onUpdate(prospects.map(pr => pr.id === p.id ? { ...pr, status: 'generated' } : pr))
        }
      } finally {
        setGenerating(prev => { const next = new Set(prev); next.delete(p.id); return next })
      }
      await new Promise(r => setTimeout(r, 500)) // rate limit buffer
    }
    onSequencesGenerated(generated)
    setGeneratingAll(false)
  }

  const statusColor = (s: Prospect['status']) => {
    if (s === 'generated') return 'text-hatch-teal'
    if (s === 'replied_positive') return 'text-green-400'
    if (s === 'replied_negative') return 'text-red-400'
    return 'text-white/30'
  }

  const pendingCount = prospects.filter(p => p.status === 'pending').length

  return (
    <div className="space-y-8">
      <div>
        <div className="label mb-2">Step 3 of 4</div>
        <h1 className="text-2xl font-display font-semibold text-white mb-2">Prospects</h1>
        <p className="text-white/50 text-sm">Upload a CSV or add from the Strategic Targets tab. Required columns: email, firstName, lastName, title, company, industry.</p>
      </div>

      {/* Upload zone */}
      <div
        className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-hatch-teal/40 transition-colors cursor-pointer"
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          if (file) handleCSV(file)
        }}
      >
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => { if (e.target.files?.[0]) handleCSV(e.target.files[0]) }} />
        <div className="text-white/30 text-sm">Drop CSV here or click to upload</div>
        <div className="text-white/20 text-xs mt-1">Supports Apollo, LinkedIn, or any CSV with email + name columns</div>
      </div>

      {/* Prospects list */}
      {prospects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">{prospects.length} prospects · {pendingCount} pending</span>
            {pendingCount > 0 && (
              <button
                onClick={generateAll}
                disabled={generatingAll || !context}
                className="btn-primary text-xs"
              >
                {generatingAll ? `Generating...` : `Generate all ${pendingCount} sequences`}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {prospects.map(p => (
              <div key={p.id} className="card flex items-center justify-between py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-white text-sm">{p.firstName} {p.lastName}</span>
                    <span className={`text-xs ${statusColor(p.status)}`}>{p.status}</span>
                  </div>
                  <div className="text-white/40 text-xs mt-0.5">{p.title} · {p.company} · {p.industry}</div>
                  <div className="text-white/25 text-xs">{p.email}</div>
                </div>
                {p.status === 'pending' && (
                  <button
                    onClick={() => generateOne(p)}
                    disabled={generating.has(p.id) || !context}
                    className="btn-ghost text-xs ml-4 flex-shrink-0"
                  >
                    {generating.has(p.id) ? 'Generating...' : 'Generate'}
                  </button>
                )}
                {p.status === 'generated' && (
                  <span className="text-hatch-teal text-xs ml-4">✓ Sequence ready</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {prospects.length === 0 && (
        <div className="text-center py-12 text-white/20 text-sm">
          No prospects yet. Upload a CSV or use Strategic Targets to add contacts.
        </div>
      )}
    </div>
  )
}
