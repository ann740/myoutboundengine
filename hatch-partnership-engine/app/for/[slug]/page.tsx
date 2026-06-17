import { notFound } from 'next/navigation'

async function getLandingData(slug: string) {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/landing/${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function LandingPage({ params }: { params: { slug: string } }) {
  const data = await getLandingData(params.slug)
  if (!data) notFound()

  const { pageData, prospect, partnershipAngle } = data

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1B2D] to-[#1B2B4B]">
      {/* Nav */}
      <nav className="px-8 py-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-7 h-7 rounded-md bg-hatch-teal flex items-center justify-center">
          <span className="text-hatch-dark font-bold text-xs">H</span>
        </div>
        <span className="text-white font-semibold text-sm">Hatch</span>
        <span className="text-white/20 text-sm">×</span>
        <span className="text-white/60 text-sm">{prospect.company}</span>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-16 space-y-16">
        {/* Hero */}
        <div>
          <div className="label mb-4">A partnership opportunity</div>
          <h1 className="text-4xl font-display font-semibold text-white leading-tight mb-4">
            {pageData.headline}
          </h1>
          <p className="text-xl text-white/60 leading-relaxed">{pageData.subheadline}</p>
        </div>

        {/* Partnership thesis */}
        <div className="bg-hatch-teal/5 border border-hatch-teal/20 rounded-2xl p-8">
          <div className="label mb-3">The opportunity</div>
          <p className="text-white/80 text-lg leading-relaxed">{pageData.partnershipThesis}</p>
        </div>

        {/* Hatch stats */}
        {pageData.hatchStats && (
          <div>
            <div className="label mb-6">Hatch by the numbers</div>
            <div className="grid grid-cols-3 gap-4">
              {pageData.hatchStats.map((stat: string, i: number) => (
                <div key={i} className="card text-center py-6">
                  <div className="text-white/70 text-sm">{stat}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Partner benefits */}
        {pageData.partnerBenefits && (
          <div>
            <div className="label mb-6">What this means for {prospect.company}</div>
            <div className="space-y-4">
              {pageData.partnerBenefits.map((b: { title: string; description: string }, i: number) => (
                <div key={i} className="card flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-hatch-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-hatch-teal text-sm font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">{b.title}</div>
                    <div className="text-white/50 text-sm">{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shared OKRs */}
        {pageData.sharedOKRs && (
          <div>
            <div className="label mb-6">Shared goals</div>
            <div className="space-y-3">
              {pageData.sharedOKRs.map((item: { okr: string; howHatchHelps: string }, i: number) => (
                <div key={i} className="card">
                  <div className="font-medium text-white text-sm mb-1">{item.okr}</div>
                  <div className="text-white/40 text-sm">{item.howHatchHelps}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Closing note */}
        {pageData.closingNote && (
          <div className="border-t border-white/10 pt-12">
            <div className="label mb-4">A note from Ann</div>
            <p className="text-white/60 text-base leading-relaxed italic">{pageData.closingNote}</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center pb-8">
          <p className="text-white/40 text-sm mb-4">{pageData.callToAction}</p>
          <div className="text-white/20 text-xs">
            This page was created specifically for {prospect.firstName} {prospect.lastName} at {prospect.company}
          </div>
        </div>
      </div>
    </div>
  )
}
