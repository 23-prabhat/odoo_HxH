# Runbook: local PostgreSQL + Prisma + Next.js (npm)

This is the step-by-step command sequence to run the project with your local PostgreSQL database.

Assumptions:
- Your local DB is `rem_manager_dbms_project`
- You already reset the DB schema with:
  - `DROP SCHEMA public CASCADE;`
  - `CREATE SCHEMA public;`

Notes for Windows:
- If PowerShell blocks `npm` scripts, use `npm.cmd` / `npx.cmd` (shown below).
- Run all commands from the `rem_manager` folder.

---

## 1) Go to the project folder

```bat
cd "c:\College\4th_sem\DBMS\odoo_HxH\rem_manager"
```

---

## 2) Confirm your `.env` has the right DATABASE_URL

Example (edit to match your username/password):

```env
DATABASE_URL="postgresql://rem_user:YOUR_PASSWORD@localhost:5432/rem_manager_dbms_project?schema=public"
NEXTAUTH_SECRET=super-secret-nextauth-key-for-expenseflow-hackathon-2026
NEXTAUTH_URL=http://localhost:3000
```

---

## 3) Install dependencies

```bat
npm.cmd install
```

---

## 4) Initialize Prisma database tables

### Option A (recommended): create/apply a migration (first time on a fresh local DB)

```bat
npx.cmd prisma migrate dev --name init
```

### Option B (no migrations): push schema directly (quick dev-only)

```bat
npx.cmd prisma db push
```

---

## 5) Generate Prisma client (safe to run any time)

```bat
npx.cmd prisma generate
```

---

## 6) Run the dev server

```bat
npm.cmd run dev
```

Open:
- http://localhost:3000

---

## 7) Useful optional commands

### Prisma Studio (view/edit data)

```bat
npx.cmd prisma studio
```

### Check Prisma setup

```bat
npx.cmd prisma -v
```

### Build + run production

```bat
npm.cmd run build
npm.cmd run start
```

### Lint

```bat
npm.cmd run lint
```
