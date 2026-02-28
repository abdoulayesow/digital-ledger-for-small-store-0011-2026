# Product Vision — Déftar

> **Product:** Déftar — Digital Ledger for Small Retailers in Guinea
> **Market:** Conakry, Guinea (expansion: Francophone West Africa)
> **Date:** February 2026
> **Author:** Ablo — Product Owner

---

## 1. Problem Central

### The Pain

Guinea's economy runs on informal retail. Hundreds of thousands of small kiosks, boutiques, and walking vendors (ambulants) are the primary distribution point for daily essentials — rice, oil, bread, phone credit, candles, phone accessories — in every neighborhood across the country. These retailers are the invisible backbone of Guinean commerce.

They all share one devastating problem: **they cannot track their sales or their money.**

Most retailers have no idea how much they actually sell in a day, what their profit is, or which products make money. An ambulant selling 50+ items a day from a basket has zero visibility into his totals. A boutiquier handling dozens of transactions between cash and credit can't tell at day's end whether the business grew or shrank. They are running businesses blind.

On top of this blindness, the typical boutiquier in Conakry extends credit to 60-70% of regular customers. Debts are tracked in paper notebooks — or worse, in memory. Pages get torn, ink fades, notebooks get lost in rain. Customers dispute amounts. The shopkeeper, lacking proof, either absorbs the loss or creates social conflict.

**The result:** An estimated 15-25% of credit-based sales are never collected. For a retailer earning 3 million GNF/month ($350 USD), that's 450,000-750,000 GNF ($50-85 USD) lost monthly — money that would feed their family, pay school fees, or reinvest in stock. And beyond uncollected debt, the deeper problem is that no retailer truly knows if their business is profitable.

### Who Suffers

- **Small kiosk owners** (boutiquiers) — Estimated 50,000+ in Conakry alone
- **Market women** — Selling vegetables, condiments, and household goods in open-air markets
- **Ambulants** — Walking vendors selling door-to-door in neighborhoods, bus stations, and markets
- **Micro-entrepreneurs** — Phone credit sellers, charging stations, small artisans

### Why Now

Three converging forces create the window of opportunity:

1. **Smartphone penetration is reaching critical mass** — Sub-$50 Android phones from Tecno, Itel, and Infinix are now affordable for small retailers. Guinea's mobile data subscribers are growing rapidly.

2. **Orange Money has normalized digital finance** — With fewer than 5% of Guineans holding bank accounts, mobile money has become the primary financial tool. Orange Money's dominance in Guinea (especially after MTN's December 2024 exit) means the population is increasingly comfortable with phone-based financial transactions.

3. **The KhataBook model is proven** — India's digital ledger apps (KhataBook, OkCredit) have demonstrated that digitizing paper notebooks for small retailers creates explosive adoption. KhataBook recorded $3 billion in transactions within six months of launch and helped merchants recover half of their outstanding receivables within weeks. The behavioral pattern (paper notebook → digital ledger → financial services) is universal — it just hasn't been executed for Francophone West Africa.

---

## 2. Vision Statement

> **Déftar est l'application qui permet aux petits commerçants guinéens de suivre leurs ventes, gérer leurs crédits, récupérer leur argent, et comprendre leur activité — sans savoir lire ni écrire, sans connexion internet, et sans changer leurs habitudes.**

*English: Déftar is the app that enables small Guinean retailers to track their sales, manage credit, recover their money, and understand their business — without needing to read or write, without internet, and without changing their habits.*

### Vision in One Sentence

**Déftar replaces the paper notebook with a 1-tap sales ledger that works offline, speaks your language, and helps you get paid.**

---

## 3. Product Principles

These principles are non-negotiable. Every feature, design decision, and roadmap prioritization must pass through these filters.

### Principle 1: Offline Is the Default, Not the Exception

Guinea's connectivity is unreliable and expensive. Déftar must work fully offline for all core functions. Network connectivity is a bonus for syncing and reminders, not a requirement for operation.

**Test:** Can Ibrahima record 20 sales in a day without any internet? → Must be YES.

### Principle 2: If You Can Use WhatsApp, You Can Use Déftar

The app's interaction complexity must never exceed WhatsApp's. Large buttons, visual feedback, minimal text, voice-first where possible. No tutorials needed — the UI teaches itself.

**Test:** Can Ousmane teach Ibrahima to record a sale in under 2 minutes? → Must be YES.

### Principle 3: The Notebook Mental Model

Déftar is a better cahier (notebook), not an accounting system. Users think in terms of "who owes me" and "who did I pay" — not debits, credits, ledgers, or balance sheets. The vocabulary and UX must match how shopkeepers already think.

**Test:** Does a non-literate market woman understand what the screen is showing her? → Must be YES.

### Principle 4: Recover Money, Not Just Track It

Tracking alone is table stakes. The real value is helping shopkeepers **collect** their debts. Automated WhatsApp/SMS reminders (sent from the app, not the shopkeeper) reduce social friction and recover outstanding receivables.

**Test:** Does Déftar help Ibrahima get paid faster than his paper notebook? → Must be measurably YES within 30 days.

### Principle 5: Trust Through Transparency

User data belongs to the user. No selling data to third parties. No hidden fees. No lock-in. Users can export everything. Building trust with a skeptical, underserved population requires radical transparency.

**Test:** Would Ibrahima recommend Déftar to his competitor across the street? → That's when we've won.

### Principle 6: Guinean First, Then West African

The app is designed from scratch for the Guinean context — GNF currency, Susu/Pular/French languages, Orange Money integration, Conakry neighborhoods. It is not a translated version of an app built for another market.

**Test:** Does the app feel like it was built by someone who knows Madina Market? → Must be YES.

---

## 4. Differentiation

### Why Not Just Use KhataBook or OkCredit?

| Dimension | KhataBook / OkCredit | Déftar |
|-----------|---------------------|--------|
| **Language** | Hindi + 11 Indian languages | Susu, Pular, Malinké, French |
| **Currency** | Indian Rupee (INR) | Guinean Franc (GNF) — no decimals, large numbers |
| **Payments** | UPI-based (India-specific) | Orange Money (dominant in Guinea) |
| **Literacy design** | Designed for low but non-zero literacy | Designed for **zero literacy** — icon + voice first |
| **Connectivity** | Offline-capable but cloud-synced | Offline-native — cloud is optional |
| **Cultural context** | Indian kirana store norms | West African boutique norms, Islamic commercial ethics |
| **Market** | Saturated (India has 5+ competitors) | Greenfield — nothing exists for Francophone West Africa |

### Why Not a Generic Accounting App (Wave, Zoho, etc.)?

These tools assume literacy, connectivity, and Western business structures. They require chart-of-accounts setup, invoice formatting, and text-heavy interfaces. They are designed for SMEs, not for a market woman who tracks debts with knotted strings.

### Core Differentiator

**Déftar is the only digital ledger built from the ground up for zero-literacy, offline-first, Francophone West African informal retail.**

---

## 5. Target Market Sizing

### Guinea (Primary Market)

| Segment | Estimated Count | Source |
|---------|----------------|--------|
| Small kiosks/boutiques in Conakry | 50,000+ | BCG estimates 82-97% of retail in similar African markets is traditional; Conakry pop. ~2M |
| Small kiosks/boutiques nationally | 150,000+ | Guinea pop. ~15.4M; retail density in urban centers |
| Market women (open-air vendors) | 100,000+ | Major markets in every prefecture |
| Ambulants (walking vendors) | 50,000+ | Neighborhoods, bus stations, markets across urban Guinea |
| **Total Addressable Market (Guinea)** | **~350,000+ retailers** | |

### Francophone West Africa (Expansion Market)

| Country | Similar Market Dynamics | Estimated Retailers |
|---------|------------------------|-------------------|
| Senegal | Strong mobile money (Wave, Orange Money) | 200,000+ |
| Côte d'Ivoire | Largest Francophone West African economy | 400,000+ |
| Mali | Cash economy, low literacy | 150,000+ |
| Burkina Faso | Cash economy, low literacy | 100,000+ |
| **Expansion TAM** | | **~850,000+** |
| **Total TAM** | | **~1.1 million retailers** |

### Revenue Potential (Post-Free Phase)

The KhataBook playbook shows monetization through financial services (not app subscriptions):

| Revenue Stream | Model | Timing |
|----------------|-------|--------|
| **Free ledger** | Free forever — drives adoption | MVP |
| **Premium reminders** | Bulk SMS/WhatsApp reminder packs | V2 (6 months) |
| **Micro-lending** | Transaction-data-backed working capital loans (partner with MFIs) | V3 (12-18 months) |
| **Supplier marketplace** | Connect boutiquiers with wholesalers for bulk purchasing | V3+ |
| **Financial reporting** | Exportable business reports for loan applications | V2 |
| **B2B data insights** | Aggregated (anonymized) market intelligence for FMCG companies | V4 (24+ months) |

---

## 6. Success Metrics — MVP (90 Days)

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Registered retailers** | ≥ 500 in Conakry | Critical mass for word-of-mouth in 3-5 neighborhoods |
| **Weekly Active Users (WAU)** | ≥ 60% of registered | Ledger must be a daily habit, not a novelty |
| **Sales recorded/user/week** | ≥ 30 | Proves the tool replaces mental tracking for daily sales |
| **Onboarding completion** | ≥ 80% who open the app complete first sale | UX is simple enough for the target audience |
| **NPS (Net Promoter Score)** | ≥ 50 | Shopkeepers would recommend to peers |
| **Organic referral rate** | ≥ 30% of new users from word-of-mouth | Virality engine is working |

#### V2 Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Debt recovery rate** | +20% vs. self-reported baseline | Core credit recovery value proposition validated |

### Anti-Metrics (What We Are NOT Optimizing For)

- Revenue — The MVP is free, and monetization experiments can wait
- Feature count — Fewer features done perfectly beats many features done adequately
- Geographic expansion — Stay in Conakry until the model works
- App Store ratings — Our users won't leave reviews; measure through direct feedback

---

## 7. Competitive Landscape

| Competitor | Geography | Relevance to Guinea |
|-----------|-----------|-------------------|
| **KhataBook** | India | Proven model, but India-specific. No French, no CFA/GNF, no Orange Money |
| **OkCredit** | India | Similar to KhataBook. No presence in Africa |
| **Wave (fintech)** | Senegal, Côte d'Ivoire | Mobile money disruptor, not a ledger. Complementary, not competitive |
| **Kweek** | Côte d'Ivoire | B2B supply chain for boutiques. Different problem space |
| **Kyosk** | Kenya, Nigeria | Digital distribution platform for retailers. Inventory-focused, not ledger |
| **Paper notebook** | Universal | The real competitor. Déftar must be objectively better in every way that matters |

### Competitive Moat Strategy

1. **Language and cultural localization** — First to market with Susu/Pular-native experience
2. **Offline-first architecture** — Technically hard to replicate well
3. **Network effects** — Each shopkeeper that adopts creates social proof for neighbors
4. **Transaction data** — Over time, builds a unique dataset of informal commercial activity in Guinea
5. **Trust** — First-mover trust in a market where trust is the currency

---

## 8. Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Low adoption** — Shopkeepers resist digital tools | 🔴 High | Seed through community influencers (Ousmane + Amadou personas); prove value in first week via sales visibility and credit tracking |
| **Connectivity worse than expected** | 🟡 Medium | Architecture is offline-native; sync is gravy, not requirement |
| **Political instability** | 🟡 Medium | App works offline and locally; no dependency on government infrastructure |
| **Orange Money API access** | 🟡 Medium | V1 works without integration; Orange Money is a V2 enhancement |
| **Copycats** | 🟡 Medium | First-mover advantage + local knowledge + network effects create defensibility |
| **Electricity/charging** | 🟡 Medium | Minimal battery usage (dark mode, no GPS, no background processes); most retailers have charging access |
| **Cultural resistance to digital debt tracking** | 🔴 High | Position reminders as coming from the app, not the shopkeeper; frame as "professional" |

---

## 9. Product Name: Why "Déftar"

**Déftar** (also spelled "deftere" or "defter") comes from the Arabic-origin word used across Pular, Hausa, and other West African languages meaning **"notebook"** or **"register."** It is the word many Peul shopkeepers already use for their paper ledger.

**Why this name works:**

- Instantly understood by Pular speakers (34% of Guinea's population)
- Recognized by Malinké and Susu speakers through Islamic commercial vocabulary
- Conveys exactly what the product does — it's your defter, but digital
- Easy to pronounce, memorable, and distinct in the Play Store
- Connects to a trusted, familiar object — reduces fear of technology

**Tagline (Pular):** *Déftar maa, e nder jungo maa* — "Your notebook, in your hand"

**Tagline (French):** *Ton cahier, dans ta poche* — "Your notebook, in your pocket"

---

## 10. Technical Vision Summary

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Backend API** | Next.js (API routes) on Vercel | Developer productivity, serverless scaling, familiar stack |
| **Database** | Neon (PostgreSQL) on Vercel | Serverless Postgres, excellent DX, cost-effective |
| **Client** | Progressive Web App (PWA) | No Play Store dependency; installable on Android; JS/React ecosystem |
| **Offline Storage** | IndexedDB via Dexie.js | Robust offline-first data persistence on low-end Android |
| **Sync Engine** | Custom conflict-resolution with last-write-wins + queue | Handles intermittent connectivity gracefully |
| **Language** | i18n with icon-first design | Susu, Pular, Malinké, French — switch without restart |
| **Voice** | Web Speech API + pre-recorded audio clips | Fallback to recorded clips when Speech API unavailable |
| **Reminders** | WhatsApp Business API / SMS gateway | Automated debt reminders via customer's preferred channel |
| **Auth** | Phone number (OTP via SMS) | No email required; matches Orange Money mental model |

### Architecture Principle

> **The phone is the database. The server is the backup.**
>
> Every sale and payment is written to local IndexedDB first. When network is available, a background sync pushes changes to Neon. If the server is unreachable for a week, nothing breaks. If the user loses their phone, data can be restored from the last sync.
