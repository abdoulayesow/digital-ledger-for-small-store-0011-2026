# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
- Déftar: offline-first digital ledger PWA for small Guinean retailers
- Replaces paper notebooks (cahiers) for credit/debt tracking
- Target: non-literate users on low-end Android (Itel A18, 1GB RAM)
- Architecture principle: "The phone is the database. The server is the backup."

## Tech Stack
- Frontend: Next.js 15 + React 19 + TypeScript (app/ui/)
- Database: PostgreSQL via Neon + Prisma (app/db/)
- UI: shadcn/ui + Tailwind CSS
- Offline: IndexedDB via Dexie.js + custom sync engine
- Auth: Phone number + OTP (SMS), country code +224
- PWA: Service worker for installability and offline support

## Project Structure
```
app/
├── ui/                    # Frontend (Next.js App Router)
│   ├── app/              # Pages and API routes
│   ├── components/       # shadcn/ui + custom components
│   └── lib/
│       ├── i18n/         # Translations (su.ts, ff.ts, man.ts, fr.ts)
│       ├── hooks/        # Custom hooks
│       ├── db/           # Dexie.js client-side database
│       └── utils/        # Utilities
└── db/                   # Backend database layer
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    └── lib/
        └── prisma.ts     # Prisma client singleton
```

## Development Commands
### UI (run from app/ui/)
- `npm run dev`          — Dev server (port 8000)
- `npm run build`        — Production build
- `npx tsc --noEmit`     — Type checking

### Database (run from app/db/)
- `npx prisma generate`      — Regenerate client after schema changes
- `npx prisma migrate dev`   — Create and apply migration
- `npx prisma db push`       — Push schema without migration
- `npx prisma studio`        — Visual database browser

## Domain Model
### Core Entities
- Retailer — App user (boutiquier/market woman), authenticated by phone
- Customer — Person who owes money to the retailer
- Transaction — Debt (credit given) or Payment (money received)
- Reminder — WhatsApp/SMS debt collection message

### Key Business Rules
- All amounts in GNF (Guinean Franc), no decimals, large round numbers
- Common amounts: 500, 1000, 2000, 5000, 10000, 25000 GNF
- Debts age-coded: green (<7 days), yellow (7-14 days), red (>14 days)
- 2-tap maximum for core actions (record debt, record payment)
- Reminders sent from the app, not from the user (reduces social friction)

## Conventions

### Currency
```typescript
new Intl.NumberFormat("fr-GN", {
  style: "currency", currency: "GNF", minimumFractionDigits: 0
}).format(amount)
```

### Phone Numbers
- Country code: +224 (Guinea)
- Format for display and storage

### i18n — 4 Languages
- Susu (su), Pular (ff), Malinké (man), French (fr)
- Icon-first, text-second design (60%+ users have limited literacy)
- Voice input/output via Web Speech API + pre-recorded clips
- All user-facing text must use translation hooks

### Offline-First Patterns
- All writes go to IndexedDB first via Dexie.js
- UUIDs generated client-side (work offline)
- Background sync to PostgreSQL when network available
- Last-write-wins conflict resolution
- Sync queue with retry on failure

### API Routes
```typescript
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { session, error } = await requireSession()
  if (error) return error
  // implementation
}
```

### Components
- Use shadcn/ui components
- Touch targets ≥ 48dp
- High contrast, large fonts (≥16sp)
- Dark mode default (battery optimization)

## Target Device Constraints
- Itel A18: 1GB RAM, Android Go
- App size: < 10 MB installed
- Load time: < 3 seconds
- Data usage: < 1 MB/day
- Storage: < 50 MB for 1 year of data
- No background GPS, minimal battery usage
- Screen: 5-6" at 720p

## Product Principles (Non-Negotiable)
1. Offline is the default, not the exception
2. If you can use WhatsApp, you can use Déftar
3. Notebook mental model — not an accounting system
4. Recover money, not just track it
5. Trust through transparency — user owns their data
6. Guinean first, then West African
