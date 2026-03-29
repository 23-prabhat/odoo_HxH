# Smart Expense Management System — Frontend Architecture

> Purpose: define a scalable frontend architecture for the reimbursement platform described in [architecture.md](C:/Hackathon/odoo/odoo_HxH/architecture.md), using Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.

---

## 1. Frontend Goals

The frontend should optimize for:

- clear role-based navigation and access control
- simple operational workflows over decorative UI
- predictable server/client boundaries
- reusable domain-driven components
- compatibility with Next.js App Router and Route Handlers
- easy transition from mock data to real APIs

This is an internal product UI, so the interface should feel calm, sparse, and task-oriented rather than marketing-heavy.

---

## 2. Frontend Principles

1. Server-first by default.
2. Client components only for interactivity, local state, uploads, and optimistic UI.
3. Keep routing aligned to business domains, not generic UI buckets.
4. Co-locate page-specific UI close to the route, and keep shared primitives in `components/`.
5. Use typed API contracts at the boundary between frontend and backend.
6. Enforce role visibility in both navigation and route guards.
7. Prefer composition over large monolithic page components.

---

## 3. Recommended Frontend Structure

```txt
rem_manager/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── auth/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── signup/page.tsx
│   │   ├── (protected)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── expenses/
│   │   │   │   ├── history/page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── approvals/page.tsx
│   │   │   ├── admin/
│   │   │   │   ├── users/page.tsx
│   │   │   │   └── workflow/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── expenses/
│   │   ├── approvals/
│   │   └── admin/
│   ├── features/
│   │   ├── auth/
│   │   ├── expenses/
│   │   ├── approvals/
│   │   ├── users/
│   │   ├── workflow/
│   │   └── settings/
│   ├── lib/
│   │   ├── auth/
│   │   ├── api/
│   │   ├── format/
│   │   ├── guards/
│   │   ├── constants/
│   │   └── utils.ts
│   ├── hooks/
│   └── types/
├── middleware or proxy equivalent
└── frontend-architecture.md
```

---

## 4. Domain-Based Frontend Modules

Each business area should own:

- page containers
- API request helpers
- DTOs/view models
- form schemas
- feature-specific components

### `features/auth`

Responsibilities:

- login form submission
- signup form submission
- session shaping for UI
- company bootstrap flow

Suggested files:

```txt
features/auth/
├── api.ts
├── schema.ts
├── types.ts
└── utils.ts
```

### `features/expenses`

Responsibilities:

- expense list mapping
- expense detail shaping
- expense create form model
- OCR autofill transformation
- status display helpers

Suggested files:

```txt
features/expenses/
├── api.ts
├── schema.ts
├── mappers.ts
├── constants.ts
└── types.ts
```

### `features/approvals`

Responsibilities:

- pending queue requests
- approve/reject actions
- approval timeline normalization
- manager/admin action permissions

### `features/users`

Responsibilities:

- admin user list
- create user modal submission
- role update handling
- manager assignment handling

### `features/workflow`

Responsibilities:

- workflow step display
- manager approver toggle
- condition rule configuration UI
- future rule builder expansion

---

## 5. Routing Architecture

### Public Routes

- `/auth/login`
- `/auth/signup`

These routes should use a simple auth layout with centered forms and no dashboard chrome.

### Protected Routes

- `/dashboard`
- `/expenses/new`
- `/expenses/history`
- `/expenses/[id]`
- `/approvals`
- `/admin/users`
- `/admin/workflow`
- `/settings`

These routes should sit under a shared protected layout:

- left sidebar
- top navigation
- session guard
- role-aware menu rendering

---

## 6. Role-Based UI Model

### Roles

- `ADMIN`
- `MANAGER`
- `EMPLOYEE`

### Route Access Matrix

| Route | ADMIN | MANAGER | EMPLOYEE |
|---|---:|---:|---:|
| `/dashboard` | yes | yes | yes |
| `/expenses/new` | yes | no | yes |
| `/expenses/history` | yes | yes | yes |
| `/approvals` | yes | yes | no |
| `/admin/users` | yes | no | no |
| `/admin/workflow` | yes | no | no |
| `/settings` | yes | yes | yes |

### Enforcement Layers

1. Proxy or middleware route guard.
2. Server-side auth check in protected layouts/pages.
3. Sidebar filtering based on session role.
4. Component-level action guard where needed.

Frontend should never rely on hidden buttons alone for security.

---

## 7. Server and Client Component Boundaries

### Use Server Components For

- page shells
- initial data fetches
- dashboard summaries
- protected layout auth checks
- expense detail fetch
- settings/company info fetch

### Use Client Components For

- form state
- modals
- file inputs
- OCR upload flow
- filters
- table interactions
- approve/reject actions
- optimistic feedback

### Rule of Thumb

If a component only reads data and renders markup, keep it server-side.
If it manages user input or browser APIs, make it client-side.

---

## 8. Data Fetching Strategy

Use Route Handlers as the main backend boundary.

### Initial Render

- fetch on the server in route pages/layouts
- pass serializable data to child components

### Mutations

- submit via server actions or `fetch` to Route Handlers
- revalidate route data after mutation
- optionally use optimistic local UI for approvals/forms

### Recommended Pattern

```txt
Page (Server)
→ calls feature api helper
→ renders container with initial data
→ client subcomponents handle form interactions
→ mutation succeeds
→ refresh or revalidate
```

---

## 9. API Client Layer

Create thin typed wrappers in feature modules instead of calling `fetch` directly inside page components.

Example shape:

```ts
// features/expenses/api.ts
export async function getExpenses() {}
export async function getExpenseById(id: string) {}
export async function createExpense(payload: CreateExpenseInput) {}
```

Benefits:

- keeps pages small
- centralizes error handling
- makes response types reusable
- simplifies later migration to query libraries if needed

---

## 10. State Management

Use three levels of state only:

### Server State

- expenses
- approvals queue
- users
- workflow rules
- settings

Source of truth should remain server/API data.

### Local UI State

- modal open/close
- form input
- filter selections
- pending comment drafts
- upload progress

Keep this inside client components unless shared across siblings.

### Shared Client State

Only introduce Context or Zustand for:

- session mirror if needed client-side
- mobile sidebar state
- global toast/feedback plumbing
- short-lived OCR draft cache

Do not move server-owned business records into global client state unless there is a real UX need.

---

## 11. Component Architecture

### Layout Components

```txt
components/layout/
├── app-shell.tsx
├── sidebar.tsx
├── topbar.tsx
└── page-header.tsx
```

### Feature Components

```txt
components/auth/
├── login-form.tsx
└── signup-form.tsx

components/expenses/
├── expense-form.tsx
├── expense-history-table.tsx
├── expense-status-badge.tsx
├── expense-detail.tsx
└── receipt-upload.tsx

components/approvals/
├── approval-queue.tsx
├── approval-item.tsx
└── approval-timeline.tsx

components/admin/
├── users-table.tsx
├── user-modal.tsx
└── workflow-settings.tsx
```

### UI Primitives

Use shadcn/ui for:

- button
- input
- textarea
- select
- dialog
- card
- table
- badge
- dropdown-menu
- toast

Keep primitives generic and move domain formatting to feature components.

---

## 12. Page Composition Model

Each route should follow this layering:

1. page file
2. route container
3. feature sections
4. reusable primitives

Example:

```txt
app/(protected)/expenses/history/page.tsx
→ renders ExpensesHistoryPage
→ uses ExpenseHistoryTable
→ uses shadcn Table primitives
```

This avoids large page files full of table logic and formatting.

---

## 13. Forms Architecture

All forms should use a consistent structure:

- schema
- default values
- submit transformer
- mutation handler
- success/error feedback

Recommended forms:

- login
- signup
- new expense
- add user
- update role
- update manager
- approval comment
- workflow settings

When backend work is ready, add schema validation with `zod` and `react-hook-form`.

---

## 14. OCR Frontend Flow

The OCR flow should stay isolated from the main expense form state.

Recommended interaction:

1. User uploads receipt.
2. Frontend sends file to `/api/ocr`.
3. API returns parsed draft fields.
4. User reviews suggested values.
5. User confirms or edits.
6. Final expense submit uses the normal expense create endpoint.

Frontend components:

```txt
components/expenses/
├── receipt-upload.tsx
├── ocr-preview.tsx
└── expense-form.tsx
```

Keep OCR suggestions clearly editable and never auto-submit from OCR.

---

## 15. Table Strategy

Tables should be simple, readable, and role-aware.

### Expense History Table

Columns:

- date
- amount
- status
- category
- submitted by or hidden based on role

### Users Table

Columns:

- name
- email
- role
- manager

### Approval Queue

Prefer a list or compact table depending on density:

- employee
- amount in company currency
- category
- submitted date
- action buttons

Use tables for scan-heavy screens and list items for action-heavy screens.

---

## 16. Formatting and Display Rules

Centralize formatting helpers in `lib/format/`.

Recommended helpers:

- `formatCurrency(amount, currency)`
- `formatDate(date)`
- `formatRole(role)`
- `formatExpenseStatus(status)`

Managers and admins should always see the company currency value where relevant.
Employees can see original submitted currency as the primary value.

---

## 17. Error Handling UX

Every mutation path should define:

- loading state
- success feedback
- empty state
- failure state

Examples:

- login failure: inline form error
- OCR failure: non-blocking message, allow manual entry
- approval failure: toast + keep item visible
- list failure: inline empty/error block with retry action

---

## 18. Suggested Implementation Order

### Phase 1

- auth routes
- protected layout
- role-aware sidebar
- dashboard

### Phase 2

- expense submission
- expense history
- approval queue

### Phase 3

- admin users
- admin workflow
- settings

### Phase 4

- expense detail page
- OCR flow
- approval timeline
- finer loading/error states

---

## 19. Recommended Next.js-Specific Frontend Decisions

- keep route segments shallow and readable
- use route groups for public vs protected experiences
- use Route Handlers for backend communication
- use server redirects for auth gating where possible
- use client-side refresh only after mutations
- avoid putting all product logic into a single global client store

---

## 20. Final Recommendation

The strongest frontend architecture for this product is:

- App Router with `(public)` and `(protected)` route groups
- domain-based feature modules for auth, expenses, approvals, users, and workflow
- server-first data loading
- minimal shared client state
- role-aware shell and navigation
- simple reusable shadcn primitives
- thin typed API wrappers instead of fetch calls scattered across pages

This structure will support the current MVP and still scale cleanly when Prisma, NextAuth, OCR, and live approval rules are added.
