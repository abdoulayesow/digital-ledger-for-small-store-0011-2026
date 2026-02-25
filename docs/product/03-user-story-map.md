# User Story Map — Déftar

> **Product:** Déftar — Digital Ledger for Small Retailers in Guinea
> **Market:** Conakry, Guinea
> **Date:** February 2026
> **Author:** Ablo — Product Owner

---

## Narrative Backbone

**Primary User:** Ibrahima Diallo — Boutiquier in Matoto, Conakry

**Story:** Ibrahima opens his kiosk at 7am. Throughout the day, customers come to buy rice, oil, bread, and phone credit. Many pay cash. Many buy on credit ("à crédit"). By evening, Ibrahima needs to know: how much cash did I collect, who owes me money, and did I make a profit today? At month-end, he wants to know: can I afford to restock? Should I stop giving credit to Moussa who never pays?

**Goal:** Replace Ibrahima's paper cahier with a digital tool that helps him track money in, money owed, and money recovered — all without internet, in his language, in under 10 seconds per transaction.

---

## User Story Map Overview

The map is organized by **User Activities** (horizontal) representing the end-to-end journey, with **User Tasks** (vertical) representing increasingly detailed capabilities. Tasks are prioritized into release phases:

- **MVP** — Minimum to prove value (debt tracking + recovery)
- **V2** — Enhanced value after adoption is validated
- **V3** — Advanced features and monetization
- **Future** — Long-term vision, out of current scope

---

## Activity 1: Get Started

> *Ibrahima hears about Déftar from Ousmane next door. He wants to try it.*

### User Tasks

| Priority | User Story | Acceptance Criteria |
|----------|-----------|-------------------|
| **MVP** | As a boutiquier, I want to start using the app with just my phone number so that I don't need email or documents | Given: User opens app for first time → When: Enters phone number + receives SMS OTP → Then: Account created, app ready to use in < 60 seconds |
| **MVP** | As a boutiquier, I want to choose my language (Susu, Pular, French) so that I can understand everything | Given: First launch → When: User sees 3 large flag/language icons → Then: Taps one, entire app switches to that language including voice prompts |
| **MVP** | As a boutiquier, I want the app to work immediately without internet so that I can start even if I have no data | Given: User has no connectivity → When: Completes phone number entry → Then: App functions fully offline; account syncs when network is available |
| **MVP** | As a boutiquier, I want to see a quick visual walkthrough (not text) so that I understand what to do | Given: First use → When: App opens → Then: 3-screen visual tutorial with animated icons showing: add customer → record debt → send reminder. Skip button always visible |
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
| **MVP** | As a boutiquier, I want to add a customer's phone number so I can send them reminders | Given: Adding customer → When: User enters phone number (optional) → Then: Number is saved; reminder button becomes active for that customer |
| **V2** | As a boutiquier, I want to take a photo of a customer so I can identify them visually | Given: Adding customer → When: Taps camera icon → Then: Photo is stored locally as customer avatar |
| **V2** | As a boutiquier, I want to group customers (family, regulars, market vendors) so I can organize my ledger | Given: Customer list grows > 20 → When: User creates a group → Then: Can filter view by group |
| **V2** | As a boutiquier, I want to flag unreliable customers so I remember to limit their credit | Given: Customer has bad payment history → When: User taps warning icon → Then: Customer card shows red flag; alert on new credit entry |

---

## Activity 3: Record Transactions

> *Fatoumata comes to buy 2kg of rice and 1 liter of oil. She pays 15,000 GNF cash but owes 10,000 GNF. Ibrahima records this.*

### User Tasks

| Priority | User Story | Acceptance Criteria |
|----------|-----------|-------------------|
| **MVP** | As a boutiquier, I want to record "customer owes me X amount" in 2 taps so it's faster than writing in my notebook | Given: User taps customer name → When: Taps amount on number pad → Then: Debt is recorded with timestamp; customer balance updates; confirmation animation + sound |
| **MVP** | As a boutiquier, I want to record "customer paid me X amount" in 2 taps so I can track payments received | Given: User taps customer name → When: Taps amount and selects "paid" (green) → Then: Payment recorded; customer balance decreases; confirmation |
| **MVP** | As a boutiquier, I want a large, simple number pad with common amounts (500, 1000, 2000, 5000, 10000, 25000 GNF) so I can enter amounts quickly | Given: Transaction screen → When: Number pad appears → Then: Pre-set buttons for common GNF amounts + custom amount option |
| **MVP** | As a boutiquier, I want to hear a voice confirmation of what I just recorded so I'm sure it's correct | Given: Transaction is saved → When: Confirmation screen shows → Then: Voice says (in selected language): "Fatoumata owes you 10,000 francs. Total: 35,000 francs" |
| **MVP** | As a boutiquier, I want to see a customer's total balance immediately so I know their full debt at a glance | Given: Any customer screen → When: User views it → Then: Large, color-coded balance shown: Red = owes money, Green = paid up |
| **MVP** | As a boutiquier, I want all transactions saved even with no internet so I never lose data | Given: Phone is offline → When: User records a transaction → Then: Saved to local IndexedDB; queued for sync; no error message shown |
| **V2** | As a boutiquier, I want to add a note to a transaction (voice or text) so I remember what was purchased | Given: Recording transaction → When: User taps note icon → Then: Can record voice memo or type short note; attached to transaction |
| **V2** | As a boutiquier, I want to record a cash sale (no credit) so I can track all my revenue | Given: User makes a cash sale → When: Taps "cash sale" button → Then: Amount recorded as income; no customer debt created |
| **V2** | As a boutiquier, I want to undo my last transaction if I made a mistake so I can correct errors easily | Given: Transaction just recorded → When: User taps "undo" within 30 seconds → Then: Transaction reversed; balance corrected |
| **V3** | As a boutiquier, I want to record purchases from my supplier so I can track business expenses | Given: User has supplier contacts → When: Records payment to supplier → Then: Expense tracked separately from customer transactions |
| **V3** | As a boutiquier, I want to photograph a receipt or invoice so I have a visual record | Given: Supplier gives paper receipt → When: User takes photo → Then: Image attached to expense entry |

---

## Activity 4: Collect Debts

> *Moussa has owed Ibrahima 25,000 GNF for 10 days. Ibrahima wants to remind him without creating social tension.*

### User Tasks

| Priority | User Story | Acceptance Criteria |
|----------|-----------|-------------------|
| **MVP** | As a boutiquier, I want to send a WhatsApp reminder to a customer about their debt so I don't have to ask in person | Given: Customer has phone number and outstanding balance → When: User taps "remind" button → Then: Pre-formatted WhatsApp message opens: "Bonjour [Name], ceci est un rappel automatique de Déftar. Votre solde est de 25,000 GNF. Merci!" |
| **MVP** | As a boutiquier, I want the reminder to come from the app (not from me personally) so it feels neutral and professional | Given: Reminder is sent → When: Customer receives it → Then: Message clearly identifies as automated from "Déftar" system, not a personal message from the shopkeeper |
| **MVP** | As a boutiquier, I want to see which customers have overdue balances sorted by amount so I can prioritize collection | Given: User opens "who owes me" view → When: List loads → Then: Customers sorted by amount descending; days since last transaction shown with color coding (green < 7 days, yellow 7-14, red > 14) |
| **V2** | As a boutiquier, I want to set automatic reminders (every 7 days) so I don't have to remember to follow up | Given: Customer has outstanding balance → When: User enables auto-remind → Then: WhatsApp/SMS sent automatically every 7 days until balance is zero |
| **V2** | As a boutiquier, I want to send an SMS reminder for customers without WhatsApp so I can reach everyone | Given: Customer has phone number but no WhatsApp → When: User taps remind → Then: SMS sent with balance summary |
| **V2** | As a boutiquier, I want the reminder message to be in the customer's preferred language so they understand it | Given: Customer language preference is set → When: Reminder sent → Then: Message is in Susu, Pular, or French based on preference |
| **V3** | As a boutiquier, I want to see my debt recovery rate over time so I know if things are improving | Given: User has 30+ days of data → When: Opens analytics → Then: Chart shows % of debts recovered within 7, 14, 30 days |
| **V3** | As a boutiquier, I want to offer customers a "payment plan" for large debts so I can structure collection | Given: Customer owes > 50,000 GNF → When: User taps "plan" → Then: Can split debt into weekly installments with automated reminders for each |

---

## Activity 5: View My Business

> *End of day. Ibrahima wants to know: how much did I make today? End of month: am I profitable?*

### User Tasks

| Priority | User Story | Acceptance Criteria |
|----------|-----------|-------------------|
| **MVP** | As a boutiquier, I want to see today's summary (cash in, credit given, payments received) on one screen so I can understand my day | Given: End of day → When: User opens home screen → Then: Three large numbers visible: 💰 Cash collected, 🔴 Credit given today, 🟢 Debts paid today |
| **MVP** | As a boutiquier, I want to see total money owed to me by all customers so I know my outstanding receivables | Given: Any time → When: User views dashboard → Then: Large bold number: "On vous doit: 450,000 GNF" with voice readout option |
| **V2** | As a boutiquier, I want to see a weekly/monthly summary of my business activity so I can track trends | Given: User has > 7 days of data → When: Opens reports → Then: Simple bar chart showing daily totals for the period; icon-based (not text-heavy) |
| **V2** | As a boutiquier, I want to know my top 5 debtors so I can focus my collection efforts | Given: Multiple customers with balances → When: User opens "top debtors" view → Then: Ranked list with amounts, last payment date, and quick-remind buttons |
| **V2** | As a boutiquier, I want to see a history of all transactions for a specific customer so I can resolve disputes | Given: Customer disputes amount → When: User taps customer → scrolls history → Then: Full chronological list with dates, amounts, and any notes/voice memos |
| **V3** | As a boutiquier, I want to estimate my monthly profit (income minus expenses) so I can plan ahead | Given: User tracks both sales and expenses → When: Opens profit view → Then: Simple calculation: Total received - Total spent = Estimated profit |
| **V3** | As a boutiquier, I want to export my business report as a PDF so I can show it to a bank or microfinance institution | Given: User has 3+ months of data → When: Taps "export" → Then: PDF generated with transaction summary, revenue trends, and debt recovery rate |
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
| **V2** | As a boutiquier, I want to call or WhatsApp customer support in my language so I can get human help | Given: User is stuck → When: Taps support button → Then: Opens WhatsApp chat with support team in Susu/Pular/French |
| **V2** | As a boutiquier, I want to hear audio tips about using the app so I can learn while working | Given: User has idle moments → When: Notification offers a tip → Then: 15-second audio clip explains a feature in user's language |
| **V3** | As a boutiquier, I want a community chat with other boutiquiers using Déftar so I can exchange tips | Given: User opts into community → When: Opens community tab → Then: WhatsApp group or in-app forum with verified boutiquiers |

---

## Release Plan Summary

### MVP (Month 1-3) — "The Digital Cahier"

**Goal:** Prove that small retailers in Conakry will adopt a digital ledger and that it helps them recover debts.

| Capability | Stories Included |
|-----------|-----------------|
| **Instant onboarding** | Phone number signup, language selection, offline-ready, visual tutorial |
| **Customer management** | Add customers (voice/text), color-coded avatars, phone numbers |
| **Transaction recording** | Record debts (2 taps), record payments (2 taps), GNF number pad, voice confirmation |
| **Debt collection** | WhatsApp reminder (manual trigger), overdue customer list, amount sorting |
| **Daily dashboard** | Today's summary (cash/credit/payments), total receivables |
| **Data safety** | Offline-first storage, background cloud sync, phone recovery |
| **Help** | Visual help guide (animated, no text) |

**Total MVP Stories: 19**

### V2 (Month 4-6) — "The Smart Cahier"

**Goal:** Increase retention and begin automated debt recovery.

| Capability | Stories Included |
|-----------|-----------------|
| **Enhanced customers** | Import contacts, customer photos, groups, reliability flags |
| **Richer transactions** | Voice notes, cash sales, undo, transaction history |
| **Automated reminders** | Auto-remind (weekly), SMS fallback, multilingual messages |
| **Business insights** | Weekly/monthly reports, top debtors, customer history |
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
| **Micro-credit** | Transaction-history-backed loans via MFI partnerships |
| **Supplier marketplace** | Bulk purchasing, wholesale connections |
| **Orange Money integration** | In-app payment collection and disbursement |
| **Benchmarking** | Anonymized neighborhood comparisons |
| **Inventory tracking** | Stock levels, reorder alerts |

---

## Story Map Visual Layout

```
TIME →
─────────────────────────────────────────────────────────────────────

ACTIVITIES:  Get Started → Add Customers → Record Txns → Collect Debts → View Business → Manage Data → Get Help

─── MVP ──────────────────────────────────────────────────────────────
             Phone signup    Add by voice    2-tap debt     WhatsApp       Today's         Offline        Visual
             Language pick   Color avatars   2-tap payment  reminder       summary         storage        help guide
             Offline start   Phone number    GNF pad        Overdue list   Total owed      Cloud sync
             Visual tour                     Voice confirm  Amount sort                    Phone recovery
                                             Offline save

─── V2 ───────────────────────────────────────────────────────────────
             Import contacts Customer photo  Voice notes    Auto-remind    Weekly report   PIN lock       WhatsApp
             Business profile Groups         Cash sales     SMS fallback   Top debtors     Delete data    support
                             Reliability flag Undo          Multilingual   Txn history                    Audio tips

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
| **Data usage** | < 1 MB per day of sync data for typical usage (15-30 transactions/day) |
| **Screen size** | Designed for 5-6" screens at 720p resolution |
| **Touch targets** | Minimum 48dp for all interactive elements (large fingers, cracked screens) |
| **Language** | All UI strings externalized; voice clips pre-recorded for Susu, Pular, French |
| **Currency** | GNF only in MVP; no decimals; amounts always displayed with thousand separators |
| **Accessibility** | High contrast; large fonts (minimum 16sp body text); audio feedback on all actions |

### Offline Architecture Requirements

| Requirement | Detail |
|-------------|--------|
| **Local database** | IndexedDB (via Dexie.js) stores all transactions, customers, and settings |
| **Conflict resolution** | Last-write-wins with timestamp; server is backup, phone is source of truth |
| **Sync queue** | Failed syncs are queued and retried on next connectivity event |
| **Data model** | UUID-based IDs generated client-side to avoid server dependency |
| **Storage limit** | Target < 50 MB for 1 year of data (10,000+ transactions) |
| **Migration** | Schema versioning in IndexedDB for seamless upgrades |

---

## Definition of Done (Global)

A user story is DONE when:

1. ✅ Feature works **fully offline** on target device (Itel A18 or equivalent)
2. ✅ UI is **icon-first** — no feature requires reading text to operate
3. ✅ Voice confirmation is available in **all three languages** (Susu, Pular, French)
4. ✅ Touch targets are ≥ 48dp
5. ✅ Action completes in ≤ 2 taps from the relevant screen
6. ✅ Data is persisted to IndexedDB and survives app restart/phone restart
7. ✅ Background sync works when network is restored
8. ✅ Tested on Android Go device with 1GB RAM
9. ✅ No crash or data loss under low-memory conditions
10. ✅ Reviewed by at least one native Susu or Pular speaker for language accuracy
