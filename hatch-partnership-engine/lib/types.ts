export interface Prospect {
  id: string
  email: string
  firstName: string
  lastName: string
  title: string
  company: string
  industry: string
  linkedinUrl?: string
  revenue?: string
  employees?: string
  notes?: string
  status: 'pending' | 'generated' | 'exported' | 'replied_positive' | 'replied_negative' | 'replied_neutral'
  createdAt: string
}

export interface EmailStep {
  stepNumber: number
  subject: string
  body: string
  delayDays: number
  variant: 'A' | 'B' | 'C'
  bodyLength: 'short' | 'medium' | 'long'
  ctaStyle: 'soft' | 'direct' | 'resource'
}

export interface Sequence {
  id: string
  prospectId: string
  prospect: Prospect
  steps: EmailStep[]
  landingPageSlug?: string
  partnershipAngle: string
  sharedOKRs: string[]
  generatedAt: string
  abGroup: 'A' | 'B' | 'C'
}

export interface ProductContext {
  companyName: string
  description: string
  products: string
  targetCustomers: string
  keyMetrics: string
  differentiators: string
  partnershipGoals: string
  senderName: string
  senderTitle: string
  calendarLink?: string
  rawContext: string
}

export interface ABResult {
  variant: string
  sent: number
  opens: number
  replies: number
  positiveReplies: number
  openRate: number
  replyRate: number
  positiveRate: number
}

// Industry → OKR mapping for personalization
export const INDUSTRY_OKRS: Record<string, string[]> = {
  'health_wellness': [
    'Increase daily active engagement with wellness products',
    'Improve measurable health outcomes for members',
    'Expand into preventive health categories',
    'Grow family-unit subscriptions',
  ],
  'consumer_tech': [
    'Deepen household device penetration',
    'Increase time-in-app and daily active users',
    'Expand addressable market into family segment',
    'Build recurring revenue through subscription products',
  ],
  'retail': [
    'Increase basket size in home and wellness categories',
    'Drive repeat purchase in baby and family segments',
    'Build private label or exclusive product lines',
    'Capture share of the fast-growing sleep wellness market',
  ],
  'insurance': [
    'Reduce claims through preventive wellness programs',
    'Increase member engagement with health benefits',
    'Differentiate plan offerings with family wellness bundles',
    'Reduce pediatric ER visits through better infant monitoring',
  ],
  'media_entertainment': [
    'Build subscription products for family audiences',
    'Increase daily engagement minutes per household',
    'Create nighttime content and audio experiences',
    'Expand into sleep-adjacent content verticals',
  ],
  'default': [
    'Reach the family demographic with premium products',
    'Build new revenue streams in health and wellness',
    'Differentiate through connected hardware + data',
    'Expand brand into the growing sleep economy',
  ]
}

export const TITLE_ANGLES: Record<string, string> = {
  'CEO': 'strategic partnership that opens a new category and a new family-focused revenue stream',
  'President': 'partnership that creates measurable impact on your family and wellness strategy',
  'Chief Product Officer': 'product integration that adds a layer of sleep intelligence to your existing platform',
  'Chief Marketing Officer': 'co-marketing opportunity reaching families at the most intimate moment of their day',
  'Chief Revenue Officer': 'distribution partnership that adds a proven $200M revenue business to your growth portfolio',
  'VP Partnerships': 'partnership with proven traction — nearly 1 in 4 US homes with a baby already uses Hatch',
  'SVP': 'strategic initiative with an established, profitable leader in family sleep',
  'default': 'partnership that puts Hatch\'s family sleep platform alongside your products in millions of homes',
}

// Target company universe — strategic fit for Hatch partnership
export const STRATEGIC_TARGETS = [
  { company: 'ResMed', industry: 'health_wellness', angle: 'sleep health continuum from clinical to consumer', note: 'Already in contact' },
  { company: 'Philips', industry: 'health_wellness', angle: 'sleep & respiratory health + parent brand in baby monitors', note: '' },
  { company: 'Garmin', industry: 'consumer_tech', angle: 'wearable sleep data + Hatch bedside context layer', note: '' },
  { company: 'Peloton', industry: 'health_wellness', angle: 'recovery + sleep as the missing pillar of their fitness platform', note: '' },
  { company: 'Samsung Health', industry: 'consumer_tech', angle: 'Galaxy ecosystem + bedroom intelligence layer', note: '' },
  { company: 'Sonos', industry: 'consumer_tech', angle: 'premium audio in the bedroom + sleep routines', note: '' },
  { company: 'Target', industry: 'retail', angle: 'family wellness destination + exclusive Hatch placement', note: '' },
  { company: 'UnitedHealth Group', industry: 'insurance', angle: 'preventive infant wellness + sleep health benefits', note: '' },
  { company: 'Calm', industry: 'media_entertainment', angle: 'audio sleep content + Hatch bedside delivery layer', note: '' },
  { company: 'Spotify', industry: 'media_entertainment', angle: 'sleep playlists + Hatch bedside audio experience', note: '' },
  { company: 'Oura', industry: 'health_wellness', angle: 'wearable ring + bedside context = full family sleep picture', note: '' },
  { company: 'Whoop', industry: 'health_wellness', angle: 'recovery focus + Hatch family sleep data', note: '' },
]
