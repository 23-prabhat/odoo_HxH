# Using local PostgreSQL (v18) with this project (Windows + pgAdmin)

This project already uses PostgreSQL via Prisma (`@prisma/client`, `@prisma/adapter-pg`, `pg`). Right now your `.env` points at a hosted Neon database.

Below are the steps to switch to a **locally installed PostgreSQL**.

---

## 0) Prerequisites

- PostgreSQL 18 installed locally.
- The PostgreSQL service is running.
- You know the **postgres superuser password** you set during installation.
- pgAdmin installed (you said you will use pgAdmin).

Quick service check:
- Open **Services** (`services.msc`) → ensure the `postgresql-x64-*` service is **Running**.

---

## 1) (Optional) Make sure `psql` is available

If you prefer **pgAdmin only**, you can skip this section entirely.

### Option A (recommended): add PostgreSQL `bin` to PATH

1. Locate your PostgreSQL install folder, commonly:
   - `C:\Program Files\PostgreSQL\18\bin`
2. Add that `bin` folder to **System PATH**.
3. Open a **new** terminal and verify:
   - `psql --version`

### Option B: use the full `psql.exe` path

If you don’t want to edit PATH, run:
- `"C:\Program Files\PostgreSQL\16\bin\psql.exe" --version`

(Adjust `18` to your installed version.)

---

## 2) Create a local database + user (pgAdmin)

### 2.1 Register your server in pgAdmin

1. Open **pgAdmin**
2. In the left tree: **Servers** → right-click → **Register** → **Server…**
3. **General** tab:
   - Name: `Local PostgreSQL 18` (any name is fine)
4. **Connection** tab:
   - Host name/address: `localhost`
   - Port: `5432` (unless you changed it)
   - Maintenance database: `postgres`
   - Username: `postgres`
   - Password: (your postgres password)
   - (Optional) check **Save password**
5. Click **Save**

### 2.2 Create the app user and database in pgAdmin

1. Expand: **Servers** → your server → **Login/Group Roles**
2. Right-click **Login/Group Roles** → **Create** → **Login/Group Role…**
   - Name: `rem_user`
   - Definition tab: Password: choose a password (example: `rem_password`)
   - Privileges tab: keep defaults (no superuser needed)
   - Save
3. Expand: **Databases** → right-click → **Create** → **Database…**
   - Database: `rem_manager_dbms_project`
   - Owner: `rem_user`
   - Save

That’s it—pgAdmin has created your local database and user.

---

## 2b) (Alternative) Create database + user using `psql`

Open PowerShell (or CMD) and run `psql` as the postgres admin user:

- `psql -U postgres`

If that works, create a dedicated user + database (you can rename these if you prefer):

```sql
-- Create an app user
CREATE USER rem_user WITH PASSWORD 'rem_password';

-- Create an app database owned by that user
CREATE DATABASE rem_manager_dbms_project OWNER rem_user;

-- Optional: allow creating extensions if you ever need them
-- ALTER USER rem_user WITH CREATEDB;
```

Quit:
- `\q`

Notes:
- If your password contains special URL characters (like `@`, `:`, `/`, `#`), you’ll need to URL-encode it in `DATABASE_URL`.

---

## 3) Install dependencies (one-time)

From `rem_manager/`:

```bash
pnpm.cmd install
```

Note: On some Windows setups, `pnpm.ps1` can be blocked by execution policy — using `pnpm.cmd` avoids that.

---

## 4) Point the app at your local database

Edit `.env` in the project root (this repo uses it already):

- Set `DATABASE_URL` to your local connection string.

Example:

```env
DATABASE_URL="postgresql://rem_user:rem_password@localhost:5432/rem_manager_dbms_project?schema=public"
NEXTAUTH_SECRET=super-secret-nextauth-key-for-expenseflow-hackathon-2026
NEXTAUTH_URL=http://localhost:3000
```

`rem_password` above is just an example. You must ensure that:
- The login role in pgAdmin is actually named `rem_user`
- Its password matches what you put into `DATABASE_URL`
- The database `rem_manager_dbms_project` exists and is owned by (or grants access to) that user

Important:
- Use `localhost` for local dev.
- Keep `NEXTAUTH_URL` as `http://localhost:3000` for local NextAuth callbacks.

---

## 5) Create tables with Prisma

Your schema is in `prisma/schema.prisma`, and the Prisma CLI is already installed in `package.json`.

From `rem_manager/`, run one of these approaches:

### Option A (recommended for team projects): migrations

```bash
pnpm.cmd prisma migrate dev --name init
```

This will create `prisma/migrations/*` and apply them to your local DB.

### Option B (quick local sync): db push (no migrations)

```bash
pnpm.cmd prisma db push
```

Then generate the client (often automatic, but safe to run once):

```bash
pnpm.cmd prisma generate
```

If you use `npm` instead of `pnpm`, run:

```bash
npm.cmd run -s prisma -- --help
```

(If `npm.ps1` is blocked in PowerShell, `npm.cmd` avoids that.)

---

## 6) Run the app

```bash
pnpm.cmd dev
```

Open:
- `http://localhost:3000`

---

## 7) Verify the database is being used

### Quick check via `psql`

```bash
psql -U rem_user -d rem_manager_dbms_project
```

Then:

```sql
\dt
```

You should see tables like `User`, `Company`, `Expense`, etc.

### Optional: Prisma Studio

```bash
pnpm.cmd prisma studio
```

---

## 8) Troubleshooting

### "server does not support SSL" / SSL errors

Local Postgres typically doesn’t use SSL by default. The runtime DB connector in this repo has been adjusted to **not force SSL on `localhost`**.

If you still see SSL errors, double-check:
- `DATABASE_URL` host is exactly `localhost` (or `127.0.0.1`).

### `psql` not found

- Add `C:\Program Files\PostgreSQL\<version>\bin` to PATH, or run `psql.exe` via its full path.

### Wrong password / auth failures

If Prisma shows `P1000 Authentication failed`, it means the username/password in `DATABASE_URL` doesn’t match what you created in PostgreSQL.

Fix (pgAdmin):
- Go to **Login/Group Roles** → right-click `rem_user` → **Properties** → **Definition** tab → set the password
- Or update the `DATABASE_URL` password to the one you already set

Fix (SQL):

```sql
ALTER USER rem_user WITH PASSWORD 'new_password';
```

- Ensure `pg_hba.conf` is using password auth (commonly `scram-sha-256`).
- Reset the app user password:

```sql
ALTER USER rem_user WITH PASSWORD 'new_password';
```

### Port conflicts

- Default port is `5432`. If your Postgres runs on a different port, update `DATABASE_URL` accordingly.

---

## 9) Suggested local settings for this repo

- Database name: `rem_manager_dbms_project`
- User: `rem_user`
- Host: `localhost`
- Port: `5432`
- Schema: `public`
