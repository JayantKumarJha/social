# CampusBlind 🎭

> One platform. Two identities. — The first dual-identity, vector-intelligent social network for students and professionals.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Auth | Supabase Auth (Email OTP) |
| Database | Vercel Postgres + pgvector |
| State | Zustand |
| Animations | Framer Motion |
| Hosting | Vercel |
| Version Control | GitHub |

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/campusblind.git
cd campusblind
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it `campusblind`, choose a strong password, pick a region close to your users (e.g. `ap-south-1` for India)
3. Once created, go to **Settings → API**
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. In Supabase → **Authentication → Providers**, enable **Email** and turn on **"Enable Email OTP"**
6. In Supabase → **Authentication → URL Configuration**, set:
   - Site URL: `http://localhost:3000` (change to your Vercel URL after deploy)
   - Redirect URLs: `http://localhost:3000/**`

### 3. Set up Vercel Postgres

1. Go to [vercel.com](https://vercel.com) → your project → **Storage → Create Database → Postgres**
2. Name it `campusblind-db`
3. Vercel will auto-inject all `POSTGRES_*` env vars into your project

4. Run the schema against your DB:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   vercel login

   # Pull env vars locally
   vercel env pull .env.local

   # Run schema (using psql or the Vercel Postgres dashboard query editor)
   # Paste contents of schema.sql into the Vercel Postgres query editor
   ```

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Postgres vars are auto-filled by `vercel env pull`
```

### 5. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## Deploying to Vercel (GitHub → Vercel)

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial CampusBlind MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/campusblind.git
git push -u origin main
```

### Step 2 — Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo `campusblind`
3. Framework: **Next.js** (auto-detected)
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` → set to your `.vercel.app` URL
5. Click **Deploy**

Your app will be live at `https://campusblind.vercel.app` (or similar) within 2 minutes.

### Step 3 — Update Supabase redirect URLs

After deploy, go to Supabase → **Auth → URL Configuration** and add:
- Site URL: `https://campusblind.vercel.app`
- Redirect URLs: `https://campusblind.vercel.app/**`

### Step 4 — Run schema on production DB

Paste `schema.sql` contents into Vercel Postgres → **Data → Query** tab.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts + toast
│   ├── page.tsx            # Root redirect (auth check)
│   ├── globals.css         # CSS variables, Tailwind base
│   └── onboarding/
│       └── page.tsx        # Onboarding orchestrator (6 steps)
│
├── components/
│   └── onboarding/
│       ├── StepCard.tsx        # Shared card wrapper + typography
│       ├── ProgressBar.tsx     # Step progress indicator
│       ├── StepEmail.tsx       # Step 1: Email + user type
│       ├── StepVerify.tsx      # Step 2: OTP verification
│       ├── StepInstitution.tsx # Step 3: College / company
│       ├── StepField.tsx       # Step 4: Field + year/role
│       ├── StepInterests.tsx   # Step 5: Interest vector seeding
│       └── StepAvatar.tsx      # Step 6: Avatar reveal + save
│
├── lib/
│   ├── supabase.ts         # Browser Supabase client
│   ├── supabase-server.ts  # Server Supabase client
│   └── avatar.ts           # Avatar generator + constants
│
└── store/
    └── onboarding.ts       # Zustand store for onboarding state
```

---

## Next Steps (Feed & Posts)

After onboarding is deployed, the next build sprint will cover:

- [ ] `/feed` — Unified feed with public + avatar posts
- [ ] Mode toggle (Public ↔ Avatar) with interaction siloing
- [ ] Post creation modal (text + image)
- [ ] Like / comment with silo enforcement
- [ ] Basic vector update on interaction
- [ ] `/profile` — Public profile page

---

## Environment Variables Reference

| Variable | Source | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard | ✅ |
| `NEXT_PUBLIC_APP_URL` | Your app URL | ✅ |
| `POSTGRES_URL` | Auto — Vercel Postgres | ✅ |
| `POSTGRES_USER` | Auto — Vercel Postgres | ✅ |
| `POSTGRES_PASSWORD` | Auto — Vercel Postgres | ✅ |
| `POSTGRES_HOST` | Auto — Vercel Postgres | ✅ |
| `POSTGRES_DATABASE` | Auto — Vercel Postgres | ✅ |

---

## License

Private — CampusBlind © 2026. All rights reserved.
