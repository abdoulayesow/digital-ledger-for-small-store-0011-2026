# Session Summary: Dashboard Redesign & UI Polish

**Date**: 2026-03-21
**Focus**: Restructure dashboard to lead with "How much am I making today?" + fonts, icons, header, and layout polish

## Overview

Complete dashboard overhaul shifting from receivables-first to revenue-first design. Added new fonts, redesigned dashboard icons, polished the app header, and fixed layout/stacking issues.

## Completed Work

### Dashboard Restructure (`app/ui/app/(app)/page.tsx`)
- **Hero section**: Today's total revenue in large brand gold text with radial gradient glow
- **Breakdown strip**: 3-column grid (Cash | Credit | Payments) with icons, amounts, and labels
- **Recent sales**: Unchanged SaleList component
- **Receivables row**: Demoted to a compact tappable link (only shown when > 0), with red left border accent

### Font Upgrade (`app/ui/app/layout.tsx`, `globals.css`)
- **Display**: Nunito → **Outfit** (geometric, modern, confident — better for finance app)
- **Body**: Noto Sans → **DM Sans** (cleaner, more modern readability)

### Icon Redesign (`app/ui/components/icons/index.tsx`)
- **IconCoin**: Was compass/target shape → Now a **banknote** (rectangle + center circle + side marks)
- **IconDebt**: Was circle + arrow → Now **banknote with arrow going out** (credit given)
- **IconPayment**: Was arrow + circle → Now **arrow coming in + banknote** (payment received)
- Nav icons (Home, Users, Bell, Settings) left unchanged

### App Header (`app/ui/components/layout/AppHeader.tsx`)
- Height: `h-14` → `h-[4.5rem]` (72px)
- Background: Warm gradient (`surface-1` → `surface-2`)
- Title: Always shows "B'TIKI" in `text-3xl font-black text-brand`, centered
- Logo: 28px → 38px with gold border and rounded corners
- Avatar: `sm` → `md` size

### Layout Fixes
- **AppHeader moved to shared layout** (`app/(app)/layout.tsx`) — now appears on every page
- **BottomNav**: Added `z-40` to fix stacking issue (was missing z-index)
- **QuickSaleFab**: Now only shows on dashboard (`/`), hidden on all other pages
- **Card**: `rounded-xl` → `rounded-lg` globally

### Logo (`components/brand/LogoMark.tsx`)
- Added `border-2 border-brand rounded-lg` — gold border everywhere logo appears

### i18n (all 4 languages)
- Added `todayTotal` and `cashSales` keys to `types.ts`, `fr.ts`, `su.ts`, `ff.ts`, `man.ts`

## Key Files Modified

| File | Change |
|------|--------|
| `app/ui/app/(app)/page.tsx` | Full dashboard restructure |
| `app/ui/app/(app)/layout.tsx` | Added AppHeader to shared layout |
| `app/ui/app/layout.tsx` | Nunito/Noto Sans → Outfit/DM Sans |
| `app/ui/app/globals.css` | Updated font fallback names |
| `app/ui/components/layout/AppHeader.tsx` | Taller, gradient bg, centered B'TIKI branding |
| `app/ui/components/layout/BottomNav.tsx` | Added z-40 for proper stacking |
| `app/ui/components/layout/QuickSaleFab.tsx` | Only visible on dashboard |
| `app/ui/components/brand/LogoMark.tsx` | Gold border + rounded corners |
| `app/ui/components/icons/index.tsx` | Redesigned Coin/Debt/Payment icons as banknotes |
| `app/ui/components/ui/Card.tsx` | rounded-xl → rounded-lg |
| `app/ui/lib/i18n/types.ts` | Added todayTotal, cashSales keys |
| `app/ui/lib/i18n/fr.ts` | French translations |
| `app/ui/lib/i18n/su.ts` | Susu translations |
| `app/ui/lib/i18n/ff.ts` | Pular translations |
| `app/ui/lib/i18n/man.ts` | Malinké translations |

## Deployment Checklist (Vercel)

### Must Do Before Deploy
- [ ] Run `npx prisma generate` in `app/db/` and commit generated client
- [ ] Provision Neon PostgreSQL database
- [ ] Set `DATABASE_URL` in Vercel Environment Variables
- [ ] Set Vercel project root directory to `app/ui/`
- [ ] Ensure `DEV_BYPASS_AUTH` is NOT set in production

### OTP / Auth (needed for real users)
- [ ] Set `WHATSAPP_PHONE_NUMBER_ID` and `WHATSAPP_ACCESS_TOKEN` for WhatsApp OTP
- [ ] Set `AT_API_KEY` and `AT_USERNAME` for SMS fallback (Africa's Talking)

### Verify After Deploy
- [ ] Run `npm run build` locally first to confirm clean build
- [ ] Test all 4 bottom nav pages render with AppHeader
- [ ] Test QuickSaleFab only appears on dashboard
- [ ] Test OTP flow with real credentials

## Resume Prompt

```
Resume B'tiki dashboard work.

Session summary: docs/summaries/2026-03-21_dashboard-redesign-ui-polish.md

All UI changes are uncommitted. 15 files modified.
The dashboard redesign is complete. Next steps are:
1. Commit all changes
2. Prepare for Vercel deployment (Prisma generate, env vars, project root)
3. Address onboarding flow — how does a store owner sign up?
```
