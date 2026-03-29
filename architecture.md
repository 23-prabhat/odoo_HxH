# Reimbursement Management System — Architecture

> **Purpose:** Single source of truth for all agents and teammates. Read this before writing any code.

---

## Problem Statement

Companies struggle with manual expense reimbursement processes that are time-consuming, error-prone, and lack transparency. This system automates: expense submission, multi-level approvals with configurable rules, currency conversion, and receipt OCR.

---

## Objectives

1. **Authentication & Company Bootstrap** — On signup, auto-create a Company (currency set from selected country) and an Admin user.
2. **User & Role Management** — Admin creates employees/managers, assigns roles (ADMIN / MANAGER / EMPLOYEE), defines manager relationships.
3. **Expense Submission** — Employees submit expenses with amount (any currency), category, description, date. OCR auto-fills from receipt images.
4. **Sequential Approval Workflow** — Expenses route through ordered approvers (e.g., Manager → Finance → Director). Each step must complete before the next activates. Rejection at any step immediately rejects the expense.
5. **Conditional Approval Rules** — Admin configures rules:
   - **PERCENTAGE**: e.g., 60% of approvers approve → expense approved (remaining steps skipped)
   - **SPECIFIC_APPROVER**: e.g., CFO approves → expense auto-approved (remaining steps skipped)
   - **HYBRID**: either condition triggers approval
   - **Sequential + Conditional combine**: steps define the *order*, condition defines *when to stop early*. Without a condition, all steps must approve.
6. **Currency Handling** — Submitted amounts converted to company's base currency for managers.
7. **Role-Based Views** — Employees see own expenses; Managers see pending approvals for their team; Admins see everything and can override.

---

## Tech Stack

| Layer | Package | Version | Notes |
|---|---|---|---|
| Framework | `next` | 16.2.1 | App Router + TypeScript (installed) |
| Runtime | `react` / `react-dom` | 19.2.4 | Installed |
| ORM | `@prisma/client` + `@prisma/adapter-pg` | 7.6.0 | Installed |
| Database | Neon PostgreSQL | — | Via DATABASE_URL in .env |
| Auth | `next-auth@beta` | v5 | **Install** — credentials provider |
| Password Hashing | `bcryptjs` | latest | **Install** |
| OCR | `tesseract.js` | latest | **Install** — server-side receipt parsing |
| UI | `shadcn/ui` + `radix-ui` | 4.1.1 / 1.4.3 | Installed |
| Icons | `@phosphor-icons/react` | 2.1.10 | Installed |
| Styling | `tailwindcss` v4 | 4.x | Installed |
| Countries API | restcountries.com | — | Free, no key |
| Exchange Rate API | exchangerate-api.com | — | Free tier, no key |

### Install Commands (run inside `rem_manager/`)
```bash
npm install next-auth@beta bcryptjs tesseract.js
npm install -D @types/bcryptjs
npx prisma init
```

---

## Environment Variables

File: `rem_manager/.env`

> **Note:** The DATABASE_URL must be a raw connection string (no `psql` prefix or shell quotes).

```env
# Neon PostgreSQL (already configured — verify format is raw connection string)
DATABASE_URL=postgresql://neondb_owner:<password>@ep-sparkling-lab-anw8bs13-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# NextAuth (add these)
NEXTAUTH_SECRET=<generate: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

---

## Database Schema (Prisma)

File: `rem_manager/prisma/schema.prisma`

### Enums
```prisma
enum Role            { ADMIN  MANAGER  EMPLOYEE }
enum ExpenseStatus   { PENDING  APPROVED  REJECTED }
enum ApprovalStatus  { PENDING  APPROVED  REJECTED }
enum ConditionType   { NONE  PERCENTAGE  SPECIFIC_APPROVER  HYBRID }
```

### Models

**Company**
```prisma
model Company {
  id        String   @id @default(cuid())
  name      String
  country   String
  currency  String   // e.g. "USD", "INR" — auto-set from country on signup
  createdAt DateTime @default(now())
  users     User[]
  rules     ApprovalRule[]
}
```

**User**
```prisma
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  passwordHash    String
  name            String
  role            Role      @default(EMPLOYEE)
  companyId       String
  company         Company   @relation(fields: [companyId], references: [id])
  managerId       String?
  manager         User?     @relation("ManagerEmployee", fields: [managerId], references: [id])
  subordinates    User[]    @relation("ManagerEmployee")
  createdAt       DateTime  @default(now())
  expenses        Expense[]
  approvalRecords ExpenseApproval[]
  approvalSteps   ApprovalStep[]
}
```

**Expense**
```prisma
model Expense {
  id                      String         @id @default(cuid())
  submitterId             String
  submitter               User           @relation(fields: [submitterId], references: [id])
  amount                  Decimal        // original amount
  currency                String         // original currency code
  amountInCompanyCurrency Decimal        // converted to company currency
  category                String
  description             String
  date                    DateTime
  status                  ExpenseStatus  @default(PENDING)
  receiptUrl              String?
  createdAt               DateTime       @default(now())
  approvals               ExpenseApproval[]
}
```

**ApprovalRule** — defines an approval flow for a company (matched by expense amount)
```prisma
model ApprovalRule {
  id                  String        @id @default(cuid())
  companyId           String
  company             Company       @relation(fields: [companyId], references: [id])
  name                String        // e.g. "Standard", "High Value"
  minAmount           Decimal       @default(0)  // rule applies to expenses >= this amount
  isManagerApprover   Boolean       @default(true)  // if true, employee's manager is auto-inserted as step 0
  conditionType       ConditionType @default(NONE)
  percentageThreshold Float?        // e.g. 60.0 — used when PERCENTAGE or HYBRID
  specificApproverId  String?       // User.id — used when SPECIFIC_APPROVER or HYBRID
  steps               ApprovalStep[]
}
```

**ApprovalStep** — an ordered approver within a rule
```prisma
model ApprovalStep {
  id         String       @id @default(cuid())
  ruleId     String
  rule       ApprovalRule @relation(fields: [ruleId], references: [id], onDelete: Cascade)
  approverId String
  approver   User         @relation(fields: [approverId], references: [id])
  sequence   Int          // 1, 2, 3... defines order
  label      String?      // e.g. "Finance", "Director" — display only
}
```

**ExpenseApproval** — tracks each approver's decision for an expense
```prisma
model ExpenseApproval {
  id         String         @id @default(cuid())
  expenseId  String
  expense    Expense        @relation(fields: [expenseId], references: [id], onDelete: Cascade)
  approverId String
  approver   User           @relation(fields: [approverId], references: [id])
  sequence   Int            // matches ApprovalStep.sequence (0 = manager if isManagerApprover)
  status     ApprovalStatus @default(PENDING)
  comment    String?
  createdAt  DateTime       @default(now())
}
```

---

## File Structure

```
rem_manager/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx           # Login form
│   │   │   └── signup/page.tsx          # Signup → creates Company + Admin
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx               # Sidebar (role-aware) + session guard
│   │   │   ├── dashboard/page.tsx       # Summary stats
│   │   │   ├── expenses/
│   │   │   │   ├── page.tsx             # Expense history list
│   │   │   │   ├── new/page.tsx         # Submit expense + OCR upload
│   │   │   │   └── [id]/page.tsx        # Detail + approval timeline
│   │   │   ├── approvals/page.tsx       # Manager/Admin: pending approvals queue
│   │   │   └── admin/
│   │   │       ├── users/page.tsx       # Manage users, roles, manager assignments
│   │   │       └── rules/page.tsx       # Configure approval rules + steps
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── signup/route.ts          # POST: create company + admin
│   │   │   ├── expenses/
│   │   │   │   ├── route.ts             # GET (list), POST (create)
│   │   │   │   └── [id]/route.ts        # GET (detail), PATCH (admin override)
│   │   │   ├── approvals/[id]/route.ts  # POST: approve/reject with comment
│   │   │   ├── users/
│   │   │   │   ├── route.ts             # GET (list), POST (create)
│   │   │   │   └── [id]/route.ts        # PATCH (role/manager)
│   │   │   ├── ocr/route.ts             # POST: receipt image → parsed fields
│   │   │   ├── company/route.ts         # GET: company info
│   │   │   └── rules/
│   │   │       ├── route.ts             # GET, POST
│   │   │       └── [id]/route.ts        # PATCH, DELETE
│   │   ├── layout.tsx
│   │   ├── page.tsx                     # Redirect to /login or /dashboard
│   │   └── globals.css
│   ├── lib/
│   │   ├── prisma.ts                    # Prisma singleton (pg adapter for Neon)
│   │   ├── auth.ts                      # NextAuth v5 config
│   │   ├── utils.ts                     # cn() — already exists
│   │   ├── ocr.ts                       # Tesseract.js wrapper
│   │   ├── currency.ts                  # Country/currency lookup + exchange rates
│   │   └── approval-engine.ts           # Core approval flow logic
│   └── components/
│       ├── ui/                          # shadcn components
│       ├── expenses/
│       │   ├── ExpenseForm.tsx
│       │   ├── ExpenseList.tsx
│       │   └── ExpenseStatusBadge.tsx
│       ├── approvals/
│       │   ├── ApprovalQueue.tsx
│       │   └── ApprovalTimeline.tsx
│       └── admin/
│           ├── UserTable.tsx
│           └── RuleBuilder.tsx          # Numbered list of steps + condition config
```

> **Note:** Use Prisma-generated types directly (`import { User, Expense, ... } from '@prisma/client'`). No separate types file needed.

---

## API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/signup` | Public | Create company + admin user |
| GET | `/api/company` | Any | Company info (currency, country) |
| GET | `/api/expenses` | Any | List expenses (scoped by role) |
| POST | `/api/expenses` | Employee | Submit expense (triggers approval chain) |
| GET | `/api/expenses/[id]` | Any | Expense detail + approval records |
| PATCH | `/api/expenses/[id]` | Admin | Override expense status |
| POST | `/api/approvals/[id]` | Manager+ | Approve/reject with comment |
| GET | `/api/users` | Admin | List company users |
| POST | `/api/users` | Admin | Create employee/manager |
| PATCH | `/api/users/[id]` | Admin | Update role/manager |
| GET | `/api/rules` | Admin | List approval rules |
| POST | `/api/rules` | Admin | Create rule with steps |
| PATCH | `/api/rules/[id]` | Admin | Update rule |
| DELETE | `/api/rules/[id]` | Admin | Delete rule |
| POST | `/api/ocr` | Employee | Receipt image → parsed fields |

---

## Key Business Logic Flows

### 1. Signup & Company Bootstrap
```
User fills signup form (name, email, password, company name, country)
→ Fetch currency code from restcountries API for selected country
→ POST /api/signup
  → Create Company { name, country, currency }
  → Create User { role: ADMIN, companyId }
  → Auto-login via NextAuth
→ Redirect to /dashboard
```

### 2. Expense Submission
```
Employee fills form (or uses OCR to pre-fill)
→ POST /api/expenses { amount, currency, category, description, date }
  → Convert currency:
      GET exchangerate-api.com/v4/latest/{expenseCurrency}
      amountInCompanyCurrency = amount * rates[companyCurrency]
  → Find matching ApprovalRule (highest minAmount <= expense amount)
  → Build approval chain:
      If rule.isManagerApprover AND submitter has a manager:
        → Create ExpenseApproval { sequence: 0, approverId: submitter.managerId, status: PENDING }
      → Create ExpenseApproval for step 1 (sequence: 1) ONLY if no manager step, else just step 0 for now
  → Expense.status = PENDING
```

### 3. Approval Flow (Sequential + Conditional)
```
Approver calls POST /api/approvals/[id] { decision: APPROVED|REJECTED, comment }
→ Update ExpenseApproval.status + comment

If REJECTED at any step:
  → Expense.status = REJECTED (done — rejection is terminal)

If APPROVED:
  → Check conditionType on the rule:
     NONE: if all steps complete and approved → APPROVED, else activate next step
     PERCENTAGE: if (approved count / total steps) >= threshold → APPROVED, else next step
     SPECIFIC_APPROVER: if this approver is the specific approver → APPROVED, else next step
     HYBRID: if percentage met OR specific approver approved → APPROVED, else next step
  → "Activate next step" = create ExpenseApproval for next sequence with status=PENDING
     (this makes it appear in that approver's queue)
  → If no more steps and condition not met → APPROVED (all approved)
```

### 4. OCR Receipt Flow
```
Employee uploads receipt image on /expenses/new
→ POST /api/ocr (multipart/form-data)
  → Tesseract.js.recognize(imageBuffer) on server
  → Regex parse for: amount, date, merchant name/description
  → Return { amount, currency, date, description }
→ Frontend auto-fills expense form
→ Employee reviews, edits if needed, submits
```

### 5. Currency Conversion
```
GET https://api.exchangerate-api.com/v4/latest/{expenseCurrency}
→ rates = response.rates
→ amountInCompanyCurrency = amount * rates[companyCurrency]
→ Both original and converted amounts stored on Expense
→ Managers always see amountInCompanyCurrency
```

---

## Key Library Files

### `src/lib/prisma.ts`
Singleton Prisma client with Neon pg adapter:
```ts
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as { prisma?: PrismaClient }
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### `src/lib/auth.ts`
NextAuth v5 with credentials provider. Session must include: `user.id`, `user.role`, `user.companyId`.

### `src/lib/approval-engine.ts`
Core functions:
- `resolveApprovalChain(expense, rule, submitter)` — creates initial ExpenseApproval records
- `advanceApproval(expenseId)` — called after each decision; evaluates condition or activates next step
- `evaluateCondition(rule, approvals)` — returns `{resolved: boolean, outcome: 'APPROVED'|null}`

### `src/lib/currency.ts`
- `fetchCountriesWithCurrencies()` — calls restcountries API, returns `{name, currencyCode, currencySymbol}[]`
- `convertCurrency(amount, fromCurrency, toCurrency)` — calls exchangerate API, returns converted Decimal

### `src/lib/ocr.ts`
- `parseReceipt(imageBuffer: Buffer)` — Tesseract.js OCR → regex extraction → `{amount?, date?, description?}`

---

## Agent Conventions

> **CRITICAL: Read `node_modules/next/dist/docs/` before writing any Next.js code** (per AGENTS.md — this Next.js version has breaking changes from what you know).

1. **Prisma**: Always import from `@/lib/prisma`. Never instantiate directly.
2. **Types**: Use Prisma-generated types (`import { User, ... } from '@prisma/client'`). No separate types file.
3. **API routes**: Next.js 16 Route Handlers (`export async function GET/POST(request: Request)`).
4. **Auth**: Use `auth()` from `@/lib/auth` to get session in server components and route handlers.
5. **Role guard**: Always check `session.user.role` server-side. Never trust client claims.
6. **Company scoping**: Every DB query listing users/expenses/rules MUST filter by `companyId` from session.
7. **Amounts**: Store as `Decimal` in Prisma. Display with `Intl.NumberFormat`.
8. **OCR**: Server-side only (in `/api/ocr`). Never import tesseract.js in client components.
9. **shadcn**: Add components via `npx shadcn add <component>`. Do not copy manually.
10. **App Router only**: No `pages/` directory. Everything under `src/app/`.

---

## External API Reference

### Countries & Currencies
```
GET https://restcountries.com/v3.1/all?fields=name,currencies
Response: [{ name: { common: "India" }, currencies: { INR: { name: "Indian Rupee", symbol: "₹" } } }]
```

### Currency Exchange Rates
```
GET https://api.exchangerate-api.com/v4/latest/{EXPENSE_CURRENCY}
Response: { base: "EUR", rates: { USD: 1.08, INR: 90.5, ... } }

Conversion: amountInCompanyCurrency = amount * rates[companyCurrency]
```

### Excalidraw Mockup
```
https://link.excalidraw.com/l/65VNwvy7c4X/4WSLZDTrhkA
```

---

## Current Project State

- [x] Next.js 16 + TypeScript initialized
- [x] shadcn/ui configured (Radix Lyra, Phosphor icons, Tailwind v4)
- [x] Neon PostgreSQL connected (DATABASE_URL in .env)
- [x] Prisma client + pg adapter installed
- [x] Button component at `src/components/ui/button.tsx`
- [ ] `next-auth`, `bcryptjs`, `tesseract.js` — not yet installed
- [ ] Prisma schema — not yet written
- [ ] Auth — not yet set up
- [ ] No pages or API routes implemented
