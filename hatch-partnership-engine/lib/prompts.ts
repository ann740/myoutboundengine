import { Prospect, EmailStep, Sequence, ProductContext, INDUSTRY_OKRS, TITLE_ANGLES } from './types'

function getIndustryKey(industry: string): string {
  const lower = industry.toLowerCase()
  if (lower.includes('health') || lower.includes('wellness') || lower.includes('medical') || lower.includes('pharma') || lower.includes('sleep')) return 'health_wellness'
  if (lower.includes('tech') || lower.includes('software') || lower.includes('device') || lower.includes('consumer electronics')) return 'consumer_tech'
  if (lower.includes('retail') || lower.includes('ecommerce') || lower.includes('commerce')) return 'retail'
  if (lower.includes('insurance') || lower.includes('benefits') || lower.includes('payer')) return 'insurance'
  if (lower.includes('media') || lower.includes('entertainment') || lower.includes('content') || lower.includes('audio') || lower.includes('streaming')) return 'media_entertainment'
  return 'default'
}

function getTitleAngle(title: string): string {
  const upper = title.toUpperCase()
  if (upper.includes('CEO') || upper.includes('CHIEF EXECUTIVE')) return TITLE_ANGLES['CEO']
  if (upper.includes('PRESIDENT')) return TITLE_ANGLES['President']
  if (upper.includes('CPO') || upper.includes('CHIEF PRODUCT')) return TITLE_ANGLES['Chief Product Officer']
  if (upper.includes('CMO') || upper.includes('CHIEF MARKETING')) return TITLE_ANGLES['Chief Marketing Officer']
  if (upper.includes('CRO') || upper.includes('CHIEF REVENUE')) return TITLE_ANGLES['Chief Revenue Officer']
  if (upper.includes('VP') && upper.includes('PARTNER')) return TITLE_ANGLES['VP Partnerships']
  if (upper.includes('SVP') || upper.includes('SENIOR VP')) return TITLE_ANGLES['SVP']
  return TITLE_ANGLES['default']
}

export function buildSequencePrompt(prospect: Prospect, context: ProductContext, abGroup: 'A' | 'B' | 'C'): string {
  const industryKey = getIndustryKey(prospect.industry)
  const okrs = INDUSTRY_OKRS[industryKey] || INDUSTRY_OKRS['default']
  const titleAngle = getTitleAngle(prospect.title)

  const bodyLengthMap = { A: 'short (3-4 sentences)', B: 'medium (5-7 sentences)', C: 'long (8-10 sentences)' }
  const ctaMap = { A: 'soft (curious/exploratory)', B: 'direct (specific ask for a call)', C: 'resource (offer a report or insight)' }
  const subjectStyleMap = {
    A: 'question-based subject lines',
    B: 'bold declarative subject lines',
    C: 'mutual-connection or reference-based subject lines'
  }

  return `You are writing a 4-step cold partnership outreach email sequence on behalf of ${context.senderName}, ${context.senderTitle} at Hatch.

ABOUT HATCH:
${context.description}

PRODUCTS:
${context.products}

KEY METRICS:
${context.keyMetrics}

DIFFERENTIATORS:
${context.differentiators}

PARTNERSHIP GOALS:
${context.partnershipGoals}

PROSPECT:
- Name: ${prospect.firstName} ${prospect.lastName}
- Title: ${prospect.title}
- Company: ${prospect.company}
- Industry: ${prospect.industry}
- Revenue/Size: ${prospect.revenue || 'large enterprise'}

PERSONALIZATION ANGLE:
${titleAngle}

LIKELY OKRs for this person's industry/title:
${okrs.map((o, i) => `${i + 1}. ${o}`).join('\n')}

A/B GROUP ${abGroup} RULES:
- Subject line style: ${subjectStyleMap[abGroup]}
- Body length: ${bodyLengthMap[abGroup]}
- CTA style: ${ctaMap[abGroup]}

Write exactly 4 email steps. For each step, respond ONLY in this JSON format (no markdown, no preamble):
{
  "steps": [
    {
      "stepNumber": 1,
      "delayDays": 0,
      "subject": "...",
      "body": "...",
      "partnershipAngle": "one sentence on why this partnership makes sense",
      "sharedOKRs": ["okr1", "okr2"]
    },
    {
      "stepNumber": 2,
      "delayDays": 3,
      "subject": "...",
      "body": "..."
    },
    {
      "stepNumber": 3,
      "delayDays": 7,
      "subject": "...",
      "body": "..."
    },
    {
      "stepNumber": 4,
      "delayDays": 14,
      "subject": "...",
      "body": "..."
    }
  ]
}

WRITING RULES:
- Write as ${context.senderName} — first person, warm but direct
- NEVER mention acquisition, investment, or M&A
- Focus purely on partnership value and shared goals
- Reference ${prospect.company}'s likely priorities naturally — don't be obvious about it
- Email 1: Hook with a specific, relevant insight about their space. Light ask.
- Email 2: Add a data point or proof (nearly 1 in 4 US homes with a baby uses Hatch). Reframe the opportunity.
- Email 3: Address a specific OKR they likely have. Show how Hatch solves it.
- Email 4: Short, honest, final follow-up. Low pressure. Leave the door open.
- Sign off each email: ${context.senderName}, ${context.senderTitle}, Hatch
- ${context.calendarLink ? `Include calendar link ${context.calendarLink} in email 2 or 3` : ''}
- No buzzwords, no "synergy", no "excited to connect"
- Sound like a smart peer, not a sales rep`
}

export function buildLandingPagePrompt(prospect: Prospect, context: ProductContext): string {
  const industryKey = getIndustryKey(prospect.industry)
  const okrs = INDUSTRY_OKRS[industryKey] || INDUSTRY_OKRS['default']

  return `Create a personalized partnership landing page for ${prospect.company} (${prospect.firstName} ${prospect.lastName}, ${prospect.title}).

This is a PARTNERSHIP PAGE — it demonstrates why Hatch and ${prospect.company} are natural partners.

HATCH CONTEXT:
${context.description}
Products: ${context.products}
Metrics: ${context.keyMetrics}

Generate a JSON object with these fields:
{
  "headline": "...",
  "subheadline": "...",
  "partnershipThesis": "2-3 sentences on why this specific partnership makes sense",
  "sharedMission": "one sentence on shared mission",
  "hatchStats": ["stat1", "stat2", "stat3"],
  "partnerBenefits": [
    {"title": "...", "description": "..."},
    {"title": "...", "description": "..."},
    {"title": "...", "description": "..."}
  ],
  "sharedOKRs": [
    {"okr": "...", "howHatchHelps": "..."},
    {"okr": "...", "howHatchHelps": "..."}
  ],
  "callToAction": "...",
  "closingNote": "personal note from ${context.senderName} to ${prospect.firstName}"
}

Tone: premium, peer-to-peer. Not salesy. Focused on shared impact.
Respond ONLY in JSON.`
}
