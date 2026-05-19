# Marlo Luxury Rentals

Rent iconic watches, fine jewelry, and luxury accessories for any occasion — from a single evening to a monthly subscription.

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router) | Fastest way to full-stack with React |
| Language | TypeScript (strict) | Type safety across the whole codebase |
| Database | PostgreSQL + Prisma 6 | Managed schema, great DX, strong typing |
| Auth | NextAuth v5 (JWT) | Email/password + extensible (OAuth later) |
| Email | Resend | Simple API, high deliverability |
| Styling | Tailwind CSS | Rapid UI iteration |
| Deployment | Vercel | Zero-config Next.js deploys |
| CI | GitHub Actions | Lint + typecheck + test + build on every push |

## Local Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ (local or cloud, e.g. [Supabase](https://supabase.com), [Neon](https://neon.tech))

### 1. Clone and install

```bash
git clone <repo>
cd marlo-luxury-rentals
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/marlo_db?schema=public"

# Generate a secret: openssl rand -base64 32
AUTH_SECRET="your-secret-here"
AUTH_URL="http://localhost:3000"

# Resend API key (https://resend.com)
RESEND_API_KEY="re_your_key_here"
EMAIL_FROM="noreply@marloluxury.com"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Migrate and seed the database

```bash
# Create tables
npm run db:migrate

# Load demo data (admin user + 5 catalog items)
npm run db:seed
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Credentials (after seed)

| Role | Email | Password |
|---|---|---|
| Admin | admin@marloluxury.com | admin123! |
| Customer | demo@marloluxury.com | demo123! |

## Auth Flow

1. **Sign up** → POST `/api/register` → verification email sent via Resend
2. **Verify email** → GET `/api/verify-email?token=...` → marks `emailVerified`
3. **Sign in** → NextAuth credentials provider → JWT session cookie
4. **Dashboard** → protected by middleware; redirects to `/auth/signin` if unauthenticated

## Database Schema

```
users           ← auth, roles (CUSTOMER | ADMIN)
items           ← luxury catalog (watches, jewelry, bags, accessories)
rentals         ← per-item rentals with dates, status, Stripe payment ref
subscriptions   ← recurring plans (BASIC | PREMIUM | VIP)
orders          ← one-time purchases / rental confirmations
```

See `prisma/schema.prisma` for full field definitions.

## Scripts

```bash
npm run dev            # Start dev server (http://localhost:3000)
npm run build          # Production build
npm run typecheck      # TypeScript check (no emit)
npm run lint           # ESLint
npm run test           # Jest
npm run db:migrate     # Run Prisma migrations (dev)
npm run db:migrate:deploy  # Run migrations (prod/CI)
npm run db:seed        # Load seed data
npm run db:studio      # Prisma Studio (database GUI)
```

## CI/CD

- **Push to any branch** → GitHub Actions runs `lint → typecheck → test → build`
- **Push to `main`** → additionally triggers Vercel deployment

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | Vercel personal access token |

### Required Vercel Environment Variables

Configure in Vercel dashboard (or `vercel env pull`):
- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL` (set to your production domain)
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `NEXT_PUBLIC_APP_URL`

## Deployment

```bash
# One-time setup
npm install -g vercel
vercel link         # Link to Vercel project
vercel env pull     # Pull prod env vars

# Deploy manually (normally done by CI)
vercel --prod
```

After first deploy, run migrations against the production DB:

```bash
DATABASE_URL="<prod-url>" npm run db:migrate:deploy
```
