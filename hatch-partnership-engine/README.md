# Hatch Partnership Engine

Strategic partnership outreach — personalized email sequences for senior leaders at target companies.

## What it does

- **Product context** — configure your company story, metrics, and partnership goals once
- **Strategic targets** — pre-loaded universe of companies aligned with family/sleep/wellness
- **CSV upload** — import contacts from Apollo, LinkedIn, or any source
- **AI sequences** — 4-step personalized email sequence per prospect, tailored to their title, company, and likely OKRs
- **A/B testing** — auto-assigns each sequence to a test group (subject style, body length, CTA)
- **Landing pages** — personalized page at `/for/[company-slug]` for each prospect
- **Export** — one-click export for Instantly or Lemlist

## Deploy to Vercel

```bash
# 1. Clone and install
npm install

# 2. Set environment variable
# In Vercel dashboard → Settings → Environment Variables:
# ANTHROPIC_API_KEY = your key from console.anthropic.com

# 3. Deploy
npx vercel --prod
```

Or connect your GitHub repo to Vercel and it deploys automatically on push.

## Local development

```bash
ANTHROPIC_API_KEY=your_key npm run dev
```

## Workflow

1. **Context** tab — fill in company description, metrics, partnership goals, your name
2. **Strategic Targets** tab — select companies, add contact details
3. **Prospects** tab — upload CSV or use targets; click Generate
4. **Sequences** tab — review emails, preview landing pages
5. Export to Instantly or Lemlist
6. Configure reply webhook: `POST /api/webhooks/reply`

## A/B Groups

| Group | Subject | Body | CTA |
|-------|---------|------|-----|
| A | Question-based | Short (3-4 sentences) | Soft / exploratory |
| B | Bold declarative | Medium (5-7 sentences) | Direct ask |
| C | Reference-based | Long (8-10 sentences) | Resource offer |

## CSV format

Supported column names (case-insensitive):
- `email` / `Email`
- `firstName` / `First Name` / `first_name`
- `lastName` / `Last Name` / `last_name`
- `title` / `Title` / `Job Title`
- `company` / `Company`
- `industry` / `Industry`
- `revenue` / `Revenue` / `Annual Revenue` (optional)
- `employees` / `Employees` (optional)

Apollo CSV exports work out of the box.
