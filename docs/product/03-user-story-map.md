# User Story Map — Déftar

> **Product:** Déftar — Digital Ledger for Small Retailers in Guinea
> **Market:** Conakry, Guinea
> **Date:** February 2026
> **Author:** Ablo — Product Owner

---

## Narrative Backbone

**Primary Users:** Ibrahima Diallo — Boutiquier in Matoto, Conakry | Amadou Soumah — Ambulant (walking vendor) across Conakry

**Story:** Ibrahima opens his kiosk at 7am. Throughout the day, customers come to buy rice, oil, bread, and phone credit. **Some pay cash. Some buy on credit.** By evening, Ibrahima needs to know: **how much did I sell today**, how much cash did I collect, who owes me money, and did I make a profit today? Meanwhile, Amadou walks neighborhoods selling phone accessories from his cart — 50+ small sales a day, mostly cash, a few on credit to regulars. By evening he needs the same answer: **did I make money today?**

**Goal:** Replace the paper cahier and mental math with a digital tool that helps retailers and ambulants track every sale, manage credit, and see their daily totals — all without internet, in their language, in under 10 seconds per sale.

---

## User Story Map Overview

The map is organized by **User Activities** (horizontal) representing the end-to-end journey, with **User Tasks** (vertical) representing increasingly detailed capabilities. Tasks are prioritized into release phases:

- **MVP** — Minimum to prove value (sales tracking + credit management)
- **V2** — Enhanced value after adoption is validated (debt recovery automation, richer insights)
- **V3** — Advanced features and monetization
- **Future** — Long-term vision, out of current scope

---

## Activity 1: Get Started

> *Ibrahima hears about Déftar from Ousmane next door. He wants to try it.*

### User Tasks

| Priority | User Story | Acceptance Criteria |
|----------|-----------|-------------------|
| **MVP** | As a boutiquier, I want to start using the app with just my phone number so that I don't need email or documents | Given: User opens app for first time → When: Enters phone number + receives SMS OTP → Then: Account created, app ready to use in < 60 seconds |
| **MVP** | As a boutiquier, I want to choose my language (Susu, Pular, Malinké, French) so that I can understand everything | Given: First launch → When: User sees 4 large flag/language icons → Then: Taps one, entire app switches to that language including voice prompts |
| **MVP** | As a boutiquier, I want the app to work immediately without internet so that I can start even if I have no data | Given: User has no connectivity → When: Completes phone number entry → Then: App functions fully offline; account syncs when network is available |
| **MVP** | As a boutiquier, I want to see a quick visual walkthrough (not text) so that I understand what to do | Given: First use → When: App opens → Then: 3-screen visual tutorial with animated icons showing: record a sale → add customer → view daily total. Skip button always visible |
| **V2** | As a boutiquier, I want to import my existing customers from my phone contacts so I don't have to re-enter names | Given: User grants contacts permission → When: Taps "import" → Then: Contacts appear as potential customers; user selects which ones |
| **V2** | As a boutiquier, I want to set up my business profile (shop name, location) so the app feels personalized | Given: User is onboarded → When: Taps profile icon → Then: Can add shop name (voice or text), neighborhood, and optional photo |

---

## Activity 2: Add Customers

> *Ibrahima wants to add his regular customers — Fatoumata, Moussa, Mamadou — to his digital ledger.*

### User Tasks

| Priority | User Story | Acceptance Criteria |
|----------|-----------|-------------------|
| **MVP** | As a boutiquier, I want to add a customer by name (voice or typing) so I can track their transactions | Given: User on customer list screen → When: Taps "+" button and says or types a name → Then: Customer is created with a unique color-coded avatar |
| **MVP** | As a boutiquier, I want each customer to have a distinct visual identity (color + icon) so I can find them without reading | Given: Customer is created → When: Appears in list → Then: Has unique color circle with first letter/icon, distinguishable at a glance |
| **MVP** | As a boutiquier, I want to add a customer's phone number so I can contact them and later send reminders | Given: Adding customer → When: User enters phone number (optional) → Then: Number is saved with customer profile |
| **V2** | As a boutiquier, I want to take a photo of a customer so I can identify them visually | Given: Adding customer → When: Taps camera icon → Then: Photo is stored locally as customer avatar |
| **V2** | As a boutiquier, I want to group customers (family, regulars, market vendors) so I can organize my ledger | Given: Customer list grows > 20 → When: User creates a group → Then: Can filter view by group |
| **V2** | As a boutiquier, I want to flag unreliable customers so I remember to limit their credit | Given: Customer has bad payment history → When: User taps warning icon → Then: Customer card shows red flag; alert on new credit entry |

---

## Activity 3: Record Sales

> *A customer walks up and buys a phone charger for 5,000 GNF cash. Later, Fatoumata comes to buy 2kg of rice on credit. Ibrahima taps each sale as it happens. Meanwhile, Amadou sells earphones from his cart — tap, 2,000 GNF, done — and keeps walking.*

### User Tasks

| Priority | User Story | Acceptance Criteria |
|----------|-----------|-------------------|
| **MVP** | As a retailer, I want to record a quick cash sale (amount only, no customer) in 1 tap so it's faster than any notebook | Given: Home screen → When: User taps amount on quick-sale number pad → Then: Cash sale recorded with timestamp; daily total updates; confirmation animation + sound. No customer required |
| **MVP** | As a boutiquier, I want to record a cash sale to a known customer in 2 taps so I can track their purchases | Given: User taps customer name → When: Taps amount on number pad → Then: Cash sale recorded for that customer; daily total updates; confirmation |
| **MVP** | As a boutiquier, I want to record a credit sale to a customer in 2 taps so I can track what they owe | Given: User taps customer name → When: Taps amount and selects "credit" (red) → Then: Credit sale recorded; customer balance increases (receivable created); confirmation animation + sound |
| **MVP** | As a boutiquier, I want to record "customer paid me X amount" in 2 taps so I can track payments received against credit | Given: User taps customer name → When: Taps amount and selects "payment" (green) → Then: Payment recorded; customer balance decreases; confirmation |
| **MVP** | As a boutiquier, I want a large, simple number pad with common amounts (500, 1000, 2000, 5000, 10000, 25000 GNF) so I can enter amounts quickly | Given: Sale screen → When: Number pad appears → Then: Pre-set buttons for common GNF amounts + custom amount option |
| **MVP** | As a boutiquier, I want to hear a voice confirmation of what I just recorded so I'm sure it's correct | Given: Sale is saved → When: Confirmation screen shows → Then: Voice says (in selected language): "Sale of 10,000 francs recorded" or "Fatoumata owes you 10,000 francs. Total: 35,000 francs" |
| **MVP** | As a boutiquier, I want to see a customer's total balance immediately so I know their full credit at a glance | Given: Any customer screen → When: User views it → Then: Large, color-coded balance shown: Red = owes money, Green = paid up |
| **MVP** | As a boutiquier, I want all sales saved even with no internet so I never lose data | Given: Phone is offline → When: User records a sale → Then: Saved to local IndexedDB; queued for sync; no error message shown |
| **V2** | As a boutiquier, I want to add a note or voice memo to a sale so I remember what was purchased | Given: Recording sale → When: User taps note icon → Then: Can record voice memo or type short note; attached to sale |
| **V2** | As a boutiquier, I want to undo my last sale if I made a mistake so I can correct errors easily | Given: Sale just recorded → When: User taps "undo" within 30 seconds → Then: Sale reversed; totals corrected |
| **V2** | As a boutiquier, I want to add an item description to a sale so I can track what was sold | Given: Recording sale → When: User taps item icon → Then: Can add text or voice description (e.g., "3 bags rice, 2L oil") |
| **V3** | As a boutiquier, I want to record purchases from my supplier so I can track business expenses | Given: User has supplier contacts → When: Records payment to supplier → Then: Expense tracked separately from sales |
| **V3** | As a boutiquier, I want to photograph a receipt or invoice so I have a visual record | Given: Supplier gives paper receipt → When: User takes photo → Then: Image attached to expense entry |

---

## Activity 4: Track Credit & Collect Debts

> *Ibrahima checks who owes him money. Moussa has owed 25,000 GNF for 10 days. Ibrahima can see this at a glance.*

### User Tasks

| Priority | User Story | Acceptance Criteria |
|----------|-----------|-------------------|
| **MVP** | As a boutiquier, I want to see which customers have outstanding balances sorted by amount so I can know who owes me | Given: User opens "who owes me" view → When: List loads → Then: Customers sorted by amount descending; days since last credit sale shown with color coding (green < 7 days, yellow 7-14, red > 14) |
| **V2** | As a boutiquier, I want to send a WhatsApp reminder to a customer about their debt so I don't have to ask in person | Given: Customer has phone number and outstanding balance → When: User taps "remind" button → Then: Pre-formatted WhatsApp message opens: "Bonjour [Name], ceci est un rappel automatique de Déftar. Votre solde est de 25,000 GNF. Merci!" |
| **V2** | As a boutiquier, I want the reminder to come from the app (not from me personally) so it feels neutral and professional | Given: Reminder is sent → When: Customer receives it → Then: Message clearly identifies as automated from "Déftar" system, not a personal message from the shopkeeper |
| **V2** | As a boutiquier, I want to see my top debtors with quick-remind buttons so I can focus collection efforts | Given: Multiple customers with balances → When: User opens "top debtors" view → Then: Ranked list with amounts, last payment date, and quick-remind buttons |
| **V2** | As a boutiquier, I want to set automatic reminders (every 7 days) so I don't have to remember to follow up | Given: Customer has outstanding balance → When: User enables auto-remind → Then: WhatsApp/SMS sent automatically every 7 days until balance is zero |
| **V2** | As a boutiquier, I want to send an SMS reminder for customers without WhatsApp so I can reach everyone | Given: Customer has phone number but no WhatsApp → When: User taps remind → Then: SMS sent with balance summary |
| **V2** | As a boutiquier, I want the reminder message to be in the customer's preferred language so they understand it | Given: Customer language preference is set → When: Reminder sent → Then: Message is in Susu, Pular, or French based on preference |
| **V3** | As a boutiquier, I want to see my debt recovery rate over time so I know if things are improving | Given: User has 30+ days of data → When: Opens analytics → Then: Chart shows % of debts recovered within 7, 14, 30 days |
| **V3** | As a boutiquier, I want to offer customers a "payment plan" for large debts so I can structure collection | Given: Customer owes > 50,000 GNF → When: User taps "plan" → Then: Can split debt into weekly installments with automated reminders for each |

---

## Activity 5: View My Business

> *End of day. Ibrahima wants to know: how much did I sell today? How much cash did I collect? How much credit did I give? Amadou sits down after walking all day and checks his phone: 47 sales, 156,000 GNF total. Now he knows. End of month: am I profitable?*

### User Tasks

| Priority | User Story | Acceptance Criteria |
|----------|-----------|-------------------|
| **MVP** | As a retailer, I want to see today's summary (total sales, cash collected, credit given) on one screen so I can understand my day | Given: End of day → When: User opens home screen → Then: Three large numbers visible: 📊 Total sales today, 💰 Cash collected, 🔴 Credit given today |
| **MVP** | As a boutiquier, I want to see total money owed to me by all customers so I know my outstanding receivables | Given: Any time → When: User views dashboard → Then: Large bold number: "On vous doit: 450,000 GNF" with voice readout option |
| **MVP** | As a retailer, I want to see a quick sales counter on the home screen so I know how many sales I've made today | Given: Any time during the day → When: User glances at home screen → Then: Visible counter: "You made X sales today" with running total |
| **V2** | As a boutiquier, I want to see a weekly/monthly summary of my business activity so I can track trends | Given: User has > 7 days of data → When: Opens reports → Then: Simple bar chart showing daily totals for the period; icon-based (not text-heavy) |
| **V2** | As a boutiquier, I want to see a history of all sales and payments for a specific customer so I can resolve disputes | Given: Customer disputes amount → When: User taps customer → scrolls history → Then: Full chronological list with dates, amounts, sale type (cash/credit), and any notes/voice memos |
| **V3** | As a boutiquier, I want to estimate my monthly profit (income minus expenses) so I can plan ahead | Given: User tracks both sales and expenses → When: Opens profit view → Then: Simple calculation: Total received - Total spent = Estimated profit |
| **V3** | As a boutiquier, I want to export my business report as a PDF so I can show it to a bank or microfinance institution | Given: User has 3+ months of data → When: Taps "export" → Then: PDF generated with sales summary, revenue trends, and receivables overview |
| **Future** | As a boutiquier, I want to compare my performance with anonymized averages in my neighborhood so I can benchmark | Given: Sufficient market data → When: User opts into benchmarking → Then: Sees their metrics vs. neighborhood average |

---

## Activity 6: Manage My Data

> *Ibrahima's phone is full. He's worried about losing his data. He wants to feel safe.*

### User Tasks

| Priority | User Story | Acceptance Criteria |
|----------|-----------|-------------------|
| **MVP** | As a boutiquier, I want my data to stay on my phone even without internet so I never lose transactions | Given: Phone has no connectivity for days → When: User opens app → Then: All data accessible, fully functional |
| **MVP** | As a boutiquier, I want my data to automatically sync to the cloud when internet is available so I have a backup | Given: Phone connects to network → When: Background sync triggers → Then: All local changes pushed to server; no user action required |
| **MVP** | As a boutiquier, I want to recover my data if I lose my phone by logging in with my phone number on a new device | Given: Phone is lost/stolen → When: User installs Déftar on new phone and enters same number + OTP → Then: All synced data restored |
| **V2** | As a boutiquier, I want to lock the app with a PIN code so nobody else can see my business data | Given: User enables PIN → When: App is opened → Then: 4-digit PIN required; biometric optional if available |
| **V2** | As a boutiquier, I want to delete a customer and all their data so I can clean up my ledger | Given: Customer is selected → When: User confirms deletion → Then: Customer and transactions removed; irreversible after confirmation |
| **V3** | As a boutiquier, I want to share access with my wife/partner so we can both manage the shop | Given: Multi-user needed → When: User invites second phone number → Then: Both devices see same data; sync conflicts resolved automatically |

---

## Activity 7: Get Help

> *Ibrahima is stuck. He accidentally recorded the wrong amount. He needs help but can't read a help page.*

### User Tasks

| Priority | User Story | Acceptance Criteria |
|----------|-----------|-------------------|
| **MVP** | As a boutiquier, I want a visual help guide (animated icons, no text) so I can troubleshoot without reading | Given: User taps "?" icon → When: Help opens → Then: Animated demonstrations of core actions; no text required |
| **V2** | As a boutiquier, I want to call or WhatsApp customer support in my language so I can get human help | Given: User is stuck → When: Taps support button → Then: Opens WhatsApp chat with support team in Susu/Pular/Malinké/French |
| **V2** | As a boutiquier, I want to hear audio tips about using the app so I can learn while working | Given: User has idle moments → When: Notification offers a tip → Then: 15-second audio clip explains a feature in user's language |
| **V3** | As a boutiquier, I want a community chat with other boutiquiers using Déftar so I can exchange tips | Given: User opts into community → When: Opens community tab → Then: WhatsApp group or in-app forum with verified boutiquiers |

---

## Release Plan Summary

### MVP (Month 1-3) — "The Digital Sales Ledger"

**Goal:** Prove that small retailers and ambulants in Conakry will adopt a digital sales ledger and that it gives them visibility into their business.

| Capability | Stories Included |
|-----------|-----------------|
| **Instant onboarding** | Phone number signup, language selection, offline-ready, visual tutorial |
| **Customer management** | Add customers (voice/text), color-coded avatars, phone numbers |
| **Sales recording** | Quick cash sale (1 tap), customer cash sale (2 taps), credit sale (2 taps), payment received (2 taps), GNF number pad, voice confirmation, offline save |
| **Credit tracking** | View who owes money, customer balance, age-coded overdue list |
| **Daily dashboard** | Today's sales total, cash collected, credit given, total receivables, sales counter |
| **Data safety** | Offline-first storage, background cloud sync, phone recovery |
| **Help** | Visual help guide (animated, no text) |

**Total MVP Stories: 20**

### V2 (Month 4-6) — "The Smart Cahier"

**Goal:** Increase retention, add debt recovery automation, and deepen business insights.

| Capability | Stories Included |
|-----------|-----------------|
| **Enhanced customers** | Import contacts, customer photos, groups, reliability flags |
| **Richer sales** | Voice/text notes, item descriptions, undo |
| **Debt reminders** | WhatsApp reminders (manual + auto-weekly), SMS fallback, multilingual messages, top debtors with remind buttons |
| **Business insights** | Weekly/monthly reports, customer sale/payment history |
| **Security** | PIN lock, customer deletion |
| **Support** | WhatsApp support, audio tips |

### V3 (Month 7-12) — "The Business Assistant"

**Goal:** Expand to expense tracking, profit estimation, and begin monetization exploration.

| Capability | Stories Included |
|-----------|-----------------|
| **Expenses** | Supplier payments, receipt photos |
| **Analytics** | Debt recovery trends, profit estimation, PDF export |
| **Advanced collection** | Payment plans, structured installments |
| **Collaboration** | Multi-user access |
| **Community** | Boutiquier network / chat |

### Future — "The Financial Platform"

| Capability | Description |
|-----------|-------------|
| **Micro-credit** | Sales-data-backed loans via MFI partnerships |
| **Supplier marketplace** | Bulk purchasing, wholesale connections |
| **Orange Money integration** | In-app payment collection and disbursement |
| **Benchmarking** | Anonymized neighborhood comparisons |
| **Inventory tracking** | Stock levels, reorder alerts |

---

## Story Map Visual Layout

```
TIME →
─────────────────────────────────────────────────────────────────────

ACTIVITIES:  Get Started → Add Customers → Record Sales → Track Credit → View Business → Manage Data → Get Help

─── MVP ──────────────────────────────────────────────────────────────
             Phone signup    Add by voice    Quick cash     Overdue list   Today's sales   Offline        Visual
             Language pick   Color avatars   sale (1 tap)   (who owes me)  Cash collected  storage        help guide
             Offline start   Phone number    Customer cash  Age-coded      Credit given    Cloud sync
             Visual tour                     sale (2 taps)  balances       Total owed      Phone recovery
                                             Credit sale                   Sales counter
                                             Payment recv
                                             GNF pad
                                             Voice confirm
                                             Offline save

─── V2 ───────────────────────────────────────────────────────────────
             Import contacts Customer photo  Voice notes    WhatsApp       Weekly report   PIN lock       WhatsApp
             Business profile Groups         Item desc      reminders      Customer        Delete data    support
                             Reliability flag Undo          Auto-remind    history                        Audio tips
                                                            SMS fallback
                                                            Multilingual
                                                            Top debtors

─── V3 ───────────────────────────────────────────────────────────────
                                             Supplier txns  Recovery stats Profit estimate Multi-user     Community
                                             Receipt photo  Payment plans  PDF export                     chat

─── FUTURE ───────────────────────────────────────────────────────────
                                             Orange Money   Micro-credit   Benchmarking
                                             integration    Supplier mkt   Inventory
```

---

## Technical Constraints (Applicable to All Stories)

### Non-Functional Requirements

| Requirement | Specification |
|-------------|--------------|
| **Offline capability** | 100% of MVP features must work without any network connectivity |
| **Sync latency** | When network available, sync must complete within 30 seconds for a day's transactions |
| **App size** | < 10 MB installed (low-end phones have 16-32GB storage, often nearly full) |
| **Performance** | App must load in < 3 seconds on Itel A18 (1GB RAM, Android Go) |
| **Battery** | No background GPS, no continuous network polling; wake only for sync when network detected |
| **Data usage** | < 1 MB per day of sync data for typical usage (15-50 sales/day) |
| **Screen size** | Designed for 5-6" screens at 720p resolution |
| **Touch targets** | Minimum 48dp for all interactive elements (large fingers, cracked screens) |
| **Language** | All UI strings externalized; voice clips pre-recorded for Susu, Pular, Malinké, French |
| **Currency** | GNF only in MVP; no decimals; amounts always displayed with thousand separators |
| **Accessibility** | High contrast; large fonts (minimum 16sp body text); audio feedback on all actions |

### Offline Architecture Requirements

| Requirement | Detail |
|-------------|--------|
| **Local database** | IndexedDB (via Dexie.js) stores all sales, payments, customers, and settings |
| **Conflict resolution** | Last-write-wins with timestamp; server is backup, phone is source of truth |
| **Sync queue** | Failed syncs are queued and retried on next connectivity event |
| **Data model** | UUID-based IDs generated client-side to avoid server dependency |
| **Storage limit** | Target < 50 MB for 1 year of data (10,000+ sales and payments) |
| **Migration** | Schema versioning in IndexedDB for seamless upgrades |

---

## Definition of Done (Global)

A user story is DONE when:

1. ✅ Feature works **fully offline** on target device (Itel A18 or equivalent)
2. ✅ UI is **icon-first** — no feature requires reading text to operate
3. ✅ Voice confirmation is available in **all four languages** (Susu, Pular, Malinké, French)
4. ✅ Touch targets are ≥ 48dp
5. ✅ Action completes in ≤ 2 taps from the relevant screen
6. ✅ Data is persisted to IndexedDB and survives app restart/phone restart
7. ✅ Background sync works when network is restored
8. ✅ Tested on Android Go device with 1GB RAM
9. ✅ No crash or data loss under low-memory conditions
10. ✅ Reviewed by at least one native Susu or Pular speaker for language accuracy
