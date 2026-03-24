# Session Summary: PWA Service Worker Implementation

**Date:** 2026-03-23
**Focus:** Complete PWA support — service worker caching, SW registration, install prompt, sync engine activation

## Overview

Implemented full PWA support for B'tiki. The manifest, icons, metadata, and a stub service worker already existed. This session filled the remaining gaps: proper caching strategies in the service worker, client-side SW registration, an install prompt with banner UI, and activation of the dormant sync engine. A code review pass fixed cache-poisoning bugs, touch target sizing, and edge cases.

## Completed Work

### Commit 1: Core Flows (from previous session, committed at start)
- Committed 18 files from prior session (customer edit/delete, sale detail modal, TextInput, useFormSubmit)
- Commit: `06192ab`

### PWA Implementation (uncommitted)

#### Service Worker Upgrade (`public/sw.js`)
- Replaced stub with tiered caching strategy:
  - **Navigation:** Network-first → cache → `/offline` fallback
  - **`/_next/static/`:** Cache-first (content-hashed, immutable)
  - **API (`/api/`):** Network-only (data lives in IndexedDB)
  - **Other (fonts, images):** Stale-while-revalidate
- Versioned caches: `btiki-shell-v1` (precache) + `btiki-runtime-v1` (dynamic)
- Precaches only public assets (excluded `/` — auth-protected)
- All strategies guard with `response.ok` to prevent cache poisoning
- `clients.claim()` properly chained inside `waitUntil`

#### SW Registration Hook (`lib/hooks/use-service-worker.ts`)
- Registers `/sw.js` on mount
- Reloads on `controllerchange` with double-reload guard

#### Install Prompt Hook (`lib/hooks/use-install-prompt.ts`)
- Captures `beforeinstallprompt` event
- Exposes `{ canInstall, promptInstall(), dismiss() }`
- Dismissal expires after 7 days (re-shows for accidental dismissals)
- Clears deferred prompt after `userChoice` regardless of outcome (single-use)

#### Install Banner (`components/pwa/InstallBanner.tsx`)
- Bottom banner with app icon, install text, install button, dismiss X
- All touch targets ≥ 48dp (min-h-12)
- Dark theme styling (surface-1 bg, brand accent)

#### Sync Engine Activation (`components/providers/SessionProvider.tsx`)
- `useServiceWorker()` called on mount
- `startSync()` called when session loads, `stopSync()` on cleanup
- The sync engine was fully built but never activated — now live

#### Middleware Fix (`middleware.ts`)
- Added `sw.js` to matcher exclusion list (was redirecting to `/login`)

#### i18n (`lib/i18n/{types,fr,su,ff,man}.ts`)
- Added `pwa` namespace: `install`, `installDescription`, `dismiss`
- All 4 languages (French, Susu, Pular, Malinké)

### Code Review Fixes Applied
| Issue | Fix |
|-------|-----|
| `/` in precache fails behind auth | Removed from PRECACHE_URLS |
| Navigation caches 404s/302s | Added `response.ok` guard |
| SWR returns undefined on cache miss + network fail | Falls back to `Response("", { status: 503 })` |
| `_next/static` no fallback on network fail | Added `.catch()` + `response.ok` guard |
| Dismiss button 30dp, install button 40dp | Both now min-h-12 (48dp) |
| Deferred prompt not cleared on browser dismiss | Always clear after userChoice |
| Dismiss is permanent forever | Re-shows after 7 days |
| `clients.claim()` outside waitUntil | Chained inside promise |

## Key Files Modified

| File | Change |
|------|--------|
| `public/sw.js` | **REWRITTEN** — full caching strategy with response.ok guards |
| `lib/hooks/use-service-worker.ts` | **NEW** — SW registration hook |
| `lib/hooks/use-install-prompt.ts` | **NEW** — install prompt with 7-day dismiss expiry |
| `components/pwa/InstallBanner.tsx` | **NEW** — install banner component |
| `components/providers/SessionProvider.tsx` | Added SW registration + sync engine lifecycle |
| `app/(app)/layout.tsx` | Added InstallBanner to provider tree |
| `middleware.ts` | Added sw.js to exclusion list |
| `lib/i18n/types.ts` | Added pwa namespace |
| `lib/i18n/{fr,su,ff,man}.ts` | Added pwa translations |

## Design Decisions

- **No Workbox** — custom SW keeps bundle at ~2KB vs ~50KB+ with Workbox (critical for 1GB RAM target)
- **Network-only for API** — all data lives in IndexedDB via Dexie.js; caching API responses would create stale data conflicts with the sync engine
- **`response.ok` guards everywhere** — prevents cache poisoning from 302 redirects (auth middleware), 404s, and server errors
- **7-day dismiss expiry** — target users may dismiss accidentally; permanent dismissal is too aggressive
- **SW registration in SessionProvider** — co-located with sync engine start; both require client-side mount
- **Sync engine activated here** — `startSync()`/`stopSync()` were fully implemented but never called; now wired to session lifecycle

## Remaining Tasks (Not Started)

- [ ] **Review all changes from this session** — clean code and refactoring pass across both commits
- [ ] Offline page i18n — currently hardcoded in French, should show all languages or use icons
- [ ] SW update UX — currently force-reloads; could lose unsaved form data mid-sale
- [ ] Runtime cache eviction — unbounded growth risk on 50MB storage budget
- [ ] Sync error UI — visual feedback when sync fails/retries
- [ ] Demo mode polish — guided first-time experience
- [ ] Reports / history — weekly/monthly sales summary
- [ ] Data export — CSV or shareable summary
- [ ] WhatsApp reminder automation (V2)

## Verification

- `cd app/ui && npx tsc --noEmit` — clean, no errors
- `cd app/ui && npm run build` — succeeds
- **Note:** PWA changes are NOT committed yet. 10 modified + 3 new files.

---

## Resume Prompt

```
Resume B'tiki development — review all changes from previous session, apply clean code and refactoring practices.

IMPORTANT: Follow token optimization patterns from `.claude/skills/summary-generator/guidelines/token-optimization.md`:
- Use Grep before Read for searches
- Use Explore agent for multi-file exploration
- Reference this summary instead of re-reading files
- Keep responses concise

## Context
Previous session implemented PWA service worker support and activated the sync engine.
Session summary: docs/summaries/2026-03-23_pwa-service-worker.md

IMPORTANT: There are uncommitted changes from last session (10 modified + 3 new files).
Review these changes first, apply clean code and refactoring improvements, then commit.

## Review Scope
Two logical changesets to review:

### 1. Core Flows (already committed as 06192ab)
- Customer edit/delete page
- Sale detail modal
- TextInput component + useFormSubmit hook
- Refactoring of login, new customer, quick sale, RecordSaleForm
- Dashboard empty state
- i18n keys (editCustomer, deleteConfirm)

### 2. PWA Implementation (uncommitted)
- Service worker with tiered caching (public/sw.js)
- SW registration hook (lib/hooks/use-service-worker.ts)
- Install prompt hook (lib/hooks/use-install-prompt.ts)
- Install banner component (components/pwa/InstallBanner.tsx)
- Sync engine activation in SessionProvider
- Middleware fix for sw.js
- i18n pwa keys

## Key files to start with:
- app/ui/public/sw.js — service worker caching strategies
- app/ui/components/providers/SessionProvider.tsx — SW + sync wiring
- app/ui/components/pwa/InstallBanner.tsx — install banner
- app/ui/lib/hooks/use-install-prompt.ts — install prompt hook
- app/ui/lib/hooks/use-service-worker.ts — SW registration
- app/ui/lib/hooks/use-form-submit.ts — shared form submission hook
- app/ui/components/ui/TextInput.tsx — shared input component
- app/ui/components/sale/SaleDetailModal.tsx — sale detail modal
- app/ui/app/(app)/customers/[id]/edit/page.tsx — customer edit page

## Review Focus:
- Code duplication across hooks and components
- Consistent error handling patterns
- Naming conventions matching existing codebase
- Touch target compliance (≥ 48dp)
- i18n completeness
- Memory leaks / cleanup in useEffect hooks
- Unnecessary complexity that can be simplified
```
```

