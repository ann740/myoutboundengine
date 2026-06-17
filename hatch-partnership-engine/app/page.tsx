'use client'
import { useState, useEffect } from 'react'
import ContextSetup from '@/components/ContextSetup'
import ProspectsUpload from '@/components/ProspectsUpload'
import SequenceViewer from '@/components/SequenceViewer'
import ABDashboard from '@/components/ABDashboard'
import StrategicTargets from '@/components/StrategicTargets'
import { ProductContext, Prospect, Sequence } from '@/lib/types'

type Tab = 'context' | 'prospects' | 'sequences' | 'ab' | 'targets'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('context')
  const [context, setContext] = useState<ProductContext | null>(null)
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [sequences, setSequences] = useState<Sequence[]>([])

  useEffect(() => {
    fetch('/api/analyze-context').then(r => r.json()).then(d => { if (d.context) setContext(d.context) })
    fetch('/api/prospects').then(r => r.json()).then(d => { if (d.prospects) setProspects(d.prospects) })
    fetch('/api/generate-sequences').then(r => r.json()).then(d => { if (d.sequences) setSequences(d.sequences) })
  }, [])

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: 'context', label: 'Product Context' },
    { id: 'targets', label: 'Strategic Targets' },
    { id: 'prospects', label: 'Prospects', badge: prospects.length },
    { id: 'sequences', label: 'Sequences', badge: sequences.length },
    { id: 'ab', label: 'A/B Results' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-hatch-teal flex items-center justify-center">
            <span className="text-hatch-dark font-bold text-sm">H</span>
          </div>
          <div>
            <div className="font-semibold text-white text-sm">Hatch Partnership Engine</div>
            <div className="text-white/40 text-xs">Strategic outreach · Confidential</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {sequences.length > 0 && (
            <>
              <a
                href="/api/export?format=instantly"
                className="btn-ghost text-xs"
                download
              >
                Export Instantly
              </a>
              <a
                href="/api/export?format=lemlist"
                className="btn-ghost text-xs"
                download
              >
                Export Lemlist
              </a>
            </>
          )}
          <div className="text-xs text-white/30">
            {prospects.length} prospects · {sequences.length} sequences
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="border-b border-white/10 px-8">
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-4 text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id ? 'tab-active' : 'tab-inactive'
              }`}
            >
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-hatch-teal/20 text-hatch-teal' : 'bg-white/10 text-white/40'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        {activeTab === 'context' && (
          <ContextSetup context={context} onSave={ctx => setContext(ctx)} />
        )}
        {activeTab === 'targets' && (
          <StrategicTargets onAddProspects={newProspects => {
            setProspects(prev => [...prev, ...newProspects])
            setActiveTab('prospects')
          }} />
        )}
        {activeTab === 'prospects' && (
          <ProspectsUpload
            prospects={prospects}
            context={context}
            onUpdate={setProspects}
            onSequencesGenerated={seqs => {
              setSequences(prev => [...prev, ...seqs])
              setActiveTab('sequences')
            }}
          />
        )}
        {activeTab === 'sequences' && (
          <SequenceViewer sequences={sequences} />
        )}
        {activeTab === 'ab' && (
          <ABDashboard sequences={sequences} />
        )}
      </main>
    </div>
  )
}
