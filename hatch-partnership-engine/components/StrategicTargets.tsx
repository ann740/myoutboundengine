'use client'
import { useState } from 'react'
import { STRATEGIC_TARGETS } from '@/lib/types'
import { Prospect } from '@/lib/types'

const EXAMPLE_CONTACTS: Record<string, { title: string; email: string }> = {
  'ResMed': { title: 'CEO', email: '' },
  'Philips': { title: 'CEO, Connected Care', email: '' },
  'Garmin': { title: 'VP, Health Solutions', email: '' },
  'Peloton': { title: 'CEO', email: '' },
  'Samsung Health': { title: 'VP, Samsung Health', email: '' },
  'Sonos': { title: 'CEO', email: '' },
  'Target': { title: 'Chief Merchandising Officer', email: '' },
  'UnitedHealth Group': { title: 'President, Consumer Solutions', email: '' },
  'Calm': { title: 'CEO', email: '' },
  'Spotify': { title: 'VP, Audio Experiences', email: '' },
  'Oura': { title: 'CEO', email: '' },
  'Whoop': { title: 'CEO', email: '' },
}

export default function StrategicTargets({ onAddProspects }: {
  onAddProspects: (prospects: Prospect[]) => void
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [contacts, setContacts] = useState<Record<string, { firstName: string; lastName: string; email: string; title: string }>>(
    Object.fromEntries(STRATEGIC_TARGETS.map(t => [t.company, {
      firstName: '',
      lastName: '',
      email: '',
      title: EXAMPLE_CONTACTS[t.company]?.title || 'CEO',
    }]))
  )
  const [adding, setAdding] = useState(false)

  const toggle = (company: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(company) ? next.delete(company) : next.add(company)
      return next
    })
  }

  const handleAdd = async () => {
    setAdding(true)
    const toAdd = STRATEGIC_TARGETS
      .filter(t => selected.has(t.company) && contacts[t.company]?.email)
      .map(t => {
        const c = contacts[t.company]
        return {
          email: c.email,
          firstName: c.firstName,
          lastName: c.lastName,
          title: c.title,
          company: t.company,
          industry: t.industry,
          notes: t.angle,
        }
      })

    if (toAdd.length === 0) {
      alert('Add at least one email address for a selected company.')
      setAdding(false)
      return
    }

    const res = await fetch('/api/prospects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prospects: toAdd }),
    })
    const data = await res.json()
    onAddProspects(data.prospects || [])
    setAdding(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="label mb-2">Strategic Universe</div>
        <h1 className="text-2xl font-display font-semibold text-white mb-2">Partnership Targets</h1>
        <p className="text-white/50 text-sm">
          Companies strategically aligned with Hatch's family + sleep + wellness positioning.
          Add contact details for the targets you want to reach.
        </p>
      </div>

      <div className="space-y-3">
        {STRATEGIC_TARGETS.map(target => {
          const isSelected = selected.has(target.company)
          const c = contacts[target.company]
          return (
            <div key={target.company} className={`card transition-all cursor-pointer ${isSelected ? 'border-hatch-teal/40 bg-hatch-teal/5' : ''}`}>
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggle(target.company)}
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-hatch-teal border-hatch-teal' : 'border-white/20'
                  }`}
                >
                  {isSelected && <span className="text-hatch-dark text-xs font-bold">✓</span>}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-white">{target.company}</span>
                    {target.note && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-hatch-teal/10 text-hatch-teal">{target.note}</span>
                    )}
                  </div>
                  <p className="text-white/40 text-sm mb-3">{target.angle}</p>

                  {isSelected && (
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                      <input
                        className="input text-xs"
                        placeholder="First name"
                        value={c.firstName}
                        onChange={e => setContacts(prev => ({ ...prev, [target.company]: { ...prev[target.company], firstName: e.target.value } }))}
                        onClick={e => e.stopPropagation()}
                      />
                      <input
                        className="input text-xs"
                        placeholder="Last name"
                        value={c.lastName}
                        onChange={e => setContacts(prev => ({ ...prev, [target.company]: { ...prev[target.company], lastName: e.target.value } }))}
                        onClick={e => e.stopPropagation()}
                      />
                      <input
                        className="input text-xs"
                        placeholder="Email address *"
                        value={c.email}
                        onChange={e => setContacts(prev => ({ ...prev, [target.company]: { ...prev[target.company], email: e.target.value } }))}
                        onClick={e => e.stopPropagation()}
                      />
                      <input
                        className="input text-xs"
                        placeholder="Title"
                        value={c.title}
                        onChange={e => setContacts(prev => ({ ...prev, [target.company]: { ...prev[target.company], title: e.target.value } }))}
                        onClick={e => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selected.size > 0 && (
        <button
          onClick={handleAdd}
          disabled={adding}
          className="btn-primary"
        >
          {adding ? 'Adding...' : `Add ${selected.size} target${selected.size > 1 ? 's' : ''} to prospects`}
        </button>
      )}
    </div>
  )
}
