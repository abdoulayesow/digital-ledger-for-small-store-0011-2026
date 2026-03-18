# Session Summary: WhatsApp OTP Auth + MVP Progress Assessment

**Date:** 2026-03-18
**Branch:** main
**Commit:** dcc8824

## Overview

Replaced Firebase Phone Auth with server-side WhatsApp OTP (primary) + SMS fallback auth. Made dev bypass fully mock everything (no database, no APIs). Conducted full MVP progress assessment.

## Completed Work

- **WhatsApp OTP auth** — Server-side OTP generation, WhatsApp Business Cloud API sender, Africa's Talking SMS fallback
- **New API routes** — `POST /api/auth/send-otp` (rate-limited) + `POST /api/auth/verify-otp` (attempt-limited)
- **Login page rewrite** — Removed all Firebase/reCAPTCHA, now simple fetch calls with WhatsApp primary + SMS secondary buttons
- **Prisma schema** — Added `OtpVerification` model with channel, expiry, attempts tracking
- **i18n** — Added 5 new keys across all 4 languages (sendViaWhatsapp, sendViaSms, codeSentWhatsapp, codeSentSms, tooManyAttempts)
- **Firebase cleanup** — Deleted firebase client/admin, auth providers, verify-token route; removed firebase-admin from next.config
- **Zero-infra dev bypass** — `DEV_BYPASS_AUTH=true` skips database, WhatsApp, and SMS entirely across all auth routes
- **Full MVP assessment** — ~85% feature-complete

## Key Files Modified/Created

| Action | File |
|--------|------|
| Created | `app/ui/lib/otp/generate.ts` |
| Created | `app/ui/lib/otp/send-whatsapp.ts` |
| Created | `app/ui/lib/otp/send-sms.ts` |
| Created | `app/ui/app/api/auth/send-otp/route.ts` |
| Created | `app/ui/app/api/auth/verify-otp/route.ts` |
| Rewritten | `app/ui/app/login/page.tsx` |
| Modified | `app/db/prisma/schema.prisma` (added OtpVerification) |
| Modified | `app/ui/lib/i18n/types.ts` + `fr.ts`, `su.ts`, `ff.ts`, `man.ts` |
| Modified | `app/ui/next.config.ts` (removed firebase-admin) |
| Deleted | `app/ui/lib/firebase/` (client.ts, admin.ts) |
| Deleted | `app/ui/lib/auth/` (phone-auth-provider, firebase-phone-auth, dev-phone-auth, create-phone-auth) |
| Deleted | `app/ui/app/api/auth/verify-token/route.ts` |

## Design Decisions

- **WhatsApp primary** — Higher delivery rates in Guinea than SMS
- **Server-side OTP** — No Firebase/Google dependency, simple fetch from client
- **Rate limiting** — Max 3 OTPs per phone in 10 min window
- **Attempt limiting** — Max 3 wrong code attempts per OTP
- **Dev bypass** — `DEV_BYPASS_AUTH=true` + code `123456` skips all external calls AND database
- **Lazy cleanup** — Expired/verified OTP records cleaned on next send (production only)

## MVP Status (~85%)

### Done
- Auth (WhatsApp OTP + SMS), Dashboard, Quick Cash Sale, Customer CRUD
- Credit Sales, Cash Sales, Payments, Credit Tracking (age-coded)
- Settings (4 languages), Offline/PWA, Sync Engine, i18n, Middleware

### Not Started
- Reminders backend (V2 scope), Historical analytics, Data export
- Voice input, Full SW caching, Tests

---

## Local Testing Guide (Zero Infrastructure)

### Quick Start on a New Machine

```bash
git pull
cd app/ui
npm install
```

### .env.local Setup

Create `app/ui/.env.local` with just one line:

```
DEV_BYPASS_AUTH=true
```

**That's it.** No database URL, no WhatsApp API keys, no SMS credentials needed. The dev bypass mode fully mocks everything in-memory.

This file is gitignored — you must create it on each machine.

### Run and Test

```bash
cd app/ui
npm run dev
```

1. Open `http://localhost:8000/login`
2. Enter any valid Guinea phone number (e.g. `622123456`)
3. Click **WhatsApp** or **SMS** button — both work identically in dev mode
4. Enter code **`123456`**
5. You land on the dashboard as **"Boutique Test"** retailer

### How Dev Bypass Works

All three auth routes have independent dev bypass paths:

| Route | Dev Behavior |
|-------|-------------|
| `POST /api/auth/send-otp` | Logs OTP to console, returns success immediately. No database write. |
| `POST /api/auth/verify-otp` | Accepts code `123456` for any phone. Sets cookie `dev-session-token`. No database. |
| `GET /api/auth/session` | Returns hardcoded retailer (`dev-retailer-00000000`, "Boutique Test", French). No database. |

The middleware only checks cookie existence (no DB), so the entire app works offline with just `DEV_BYPASS_AUTH=true`.

### Testing Checklist

- [ ] Login via WhatsApp button → code 123456 → dashboard
- [ ] Login via SMS link → code 123456 → dashboard
- [ ] Dashboard shows "Boutique Test", zero sales
- [ ] Quick cash sale flow (tap amounts, confirm)
- [ ] Add a customer, record credit sale, record payment
- [ ] Customer balance updates correctly
- [ ] Reminders page shows age-coded debts
- [ ] Settings: switch between 4 languages
- [ ] Back button from OTP step returns to phone step
- [ ] All 4 language labels render on login page

---

## Production Environment Setup

### Required env vars

```env
# PostgreSQL (Neon)
DATABASE_URL=postgresql://...

# WhatsApp Business Cloud API
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_ACCESS_TOKEN=...

# Africa's Talking SMS (fallback)
AT_API_KEY=...
AT_USERNAME=...
```

### Database migration

```bash
cd app/db
npx prisma migrate dev --name add-otp-verification
# Or for production: npx prisma db push
```

### WhatsApp Business API Setup

1. Create a Meta Business Account at business.facebook.com
2. Enable WhatsApp Business API in Meta Developer portal
3. Register a phone number for sending
4. Create and get approved an `authentication_otp` message template
5. Copy the Phone Number ID and generate a permanent access token
6. Set `WHATSAPP_PHONE_NUMBER_ID` and `WHATSAPP_ACCESS_TOKEN`

### Africa's Talking SMS Setup (Fallback)

1. Create account at africastalking.com
2. Use their sandbox for free testing
3. Set `AT_API_KEY` and `AT_USERNAME`

---

## Remaining Tasks (Next Session)

1. Apply Prisma migration to Neon database
2. Run through the full testing checklist above
3. Set up WhatsApp Business API credentials for production
4. Set up Africa's Talking sandbox for SMS testing

---

## Resume Prompt

```
Resume Déftar digital ledger development.

IMPORTANT: Follow token optimization patterns from `.claude/skills/summary-generator/guidelines/token-optimization.md`:
- Use Grep before Read for searches
- Use Explore agent for multi-file exploration
- Reference this summary instead of re-reading files
- Keep responses concise

## Context
Previous session summary: docs/summaries/2026-03-18_whatsapp-otp-auth-progress.md

Completed: WhatsApp OTP auth (replacing Firebase), full MVP ~85% done.
Dev bypass fully works with zero infrastructure (DEV_BYPASS_AUTH=true, code 123456).

Key files to review first:
- app/ui/app/api/auth/send-otp/route.ts (OTP dispatch)
- app/ui/app/api/auth/verify-otp/route.ts (OTP verification)
- app/ui/app/login/page.tsx (login UI)
- app/ui/lib/otp/ (generate, send-whatsapp, send-sms)

Status: Auth committed + pushed. Need to:
1. Apply Prisma migration (`cd app/db && npx prisma migrate dev`)
2. Run full testing checklist (see summary)
3. Set up WhatsApp Business API + Africa's Talking for production
```
