import { Prospect, Sequence, ProductContext, ABResult } from './types'

// In-memory store — replaced with Postgres/KV in production
// Data persists per serverless instance; use Vercel KV or Postgres for persistence

declare global {
  var __store: {
    prospects: Map<string, Prospect>
    sequences: Map<string, Sequence>
    context: ProductContext | null
    abResults: ABResult[]
  }
}

if (!global.__store) {
  global.__store = {
    prospects: new Map(),
    sequences: new Map(),
    context: null,
    abResults: [],
  }
}

export const store = global.__store

export function getProspects(): Prospect[] {
  return Array.from(store.prospects.values())
}

export function getProspect(id: string): Prospect | undefined {
  return store.prospects.get(id)
}

export function upsertProspect(prospect: Prospect): void {
  store.prospects.set(prospect.id, prospect)
}

export function getSequences(): Sequence[] {
  return Array.from(store.sequences.values())
}

export function getSequence(id: string): Sequence | undefined {
  return store.sequences.get(id)
}

export function upsertSequence(seq: Sequence): void {
  store.sequences.set(seq.id, seq)
}

export function getContext(): ProductContext | null {
  return store.context
}

export function setContext(ctx: ProductContext): void {
  store.context = ctx
}

export function getABResults(): ABResult[] {
  return store.abResults
}

export function addABResult(result: ABResult): void {
  store.abResults.push(result)
}
