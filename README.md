# SearchFit.ai Monorepo

This repository contains the SearchFit.ai applications and shared packages.

## Apps

| App | Path | Description |
|-----|------|-------------|
| `web` | `apps/web` | Main Next.js app (marketing site + authenticated dashboard) |
| `admin` | `apps/admin` | Admin dashboard (internal) |
| `api` | `apps/api` | NestJS backend API |
| `hub` | `apps/hub` | Design system hub / component showcase |
| `embed` | `apps/embed` | Embeddable widget (Vite + React) |

## Packages

| Package | Path | Description |
|---------|------|-------------|
| `@workspace/billing` | `packages/billing` | Stripe billing, plans config, webhooks |
| `@workspace/db` | `packages/db` | Drizzle ORM, Postgres schema, migrations |
| `@workspace/trpc` | `packages/trpc` | tRPC routers, client, server setup |
| `@workspace/ui` | `packages/ui` | Shared UI components (shadcn/ui based) |
| `@workspace/common` | `packages/common` | Shared utilities, routes, auth helpers |
| `@workspace/ai` | `packages/ai` | AI/LLM integrations |
| `@workspace/integrations` | `packages/integrations` | Third-party integrations (Google, Reddit, etc.) |
| `@workspace/analytics` | `packages/analytics` | PostHog analytics |
| `@workspace/email` | `packages/email` | Email templates (React Email) |
| `@workspace/cloudflare` | `packages/cloudflare` | Cloudflare R2 storage |
| `@workspace/trigger` | `packages/trigger` | Background jobs (Trigger.dev) |
| `@workspace/monitoring` | `packages/monitoring` | Error tracking & monitoring |

## Technologies

- **Monorepo**: Turborepo + pnpm workspaces
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Auth**: Clerk
- **Database**: Postgres (Drizzle ORM) — local or Neon
- **API Layer**: tRPC
- **Billing**: Stripe
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Background Jobs**: Trigger.dev
- **Analytics**: PostHog, Google Analytics, Hotjar
- **Email**: Resend (React Email templates)
- **Storage**: Cloudflare R2
- **Cache**: Upstash Redis
- **Monitoring**: Sentry

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 17 with extensions: `vector` (pgvector), `timescaledb`
- Stripe CLI (for local webhook testing)

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/kkasaei/searchfit-turbo.git
   cd searchfit-turbo
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up the database**

   Create a local Postgres database and enable the required extensions:

   ```bash
   createdb searchfit_turbo
   psql -d searchfit_turbo -c "CREATE EXTENSION IF NOT EXISTS vector;"
   psql -d searchfit_turbo -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"
   ```

   > **Important — Database Extensions:** This project requires the `vector` (pgvector) and `timescaledb` Postgres extensions. These must be installed on every environment — local, DEV, STG, and PROD.
   >
   > - **Local (Homebrew):** Install pgvector (`brew install pgvector`) and TimescaleDB (`brew tap timescale/tap && brew install timescaledb`), then run `timescaledb_move.sh` and restart Postgres.
   > - **Neon (DEV/STG/PROD):** Enable extensions from the Neon dashboard or run the `CREATE EXTENSION` SQL commands above via the Neon SQL Editor. Both `vector` and `timescaledb` are supported natively on Neon.
   >
   > Verify extensions are active:
   > ```sql
   > SELECT extname, extversion FROM pg_extension WHERE extname IN ('vector', 'timescaledb');
   > ```

4. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in the values — see [`ENV_REFERENCE.md`](./ENV_REFERENCE.md) for the full reference of all variables per environment (Local, DEV, STG, PROD).

5. **Push the database schema**

   ```bash
   pnpm db:push
   ```

6. **Start the dev server**

   ```bash
   pnpm dev
   ```

7. **Start Stripe CLI** (separate terminal, for billing webhooks)

   ```bash
   stripe listen --forward-to localhost:3000/api/billing/webhook
   ```

   Copy the webhook signing secret it prints and set it as `BILLING_STRIPE_WEBHOOK_SECRET` in `.env`.

### Environment Variables

All environment variables are documented in [`ENV_REFERENCE.md`](./ENV_REFERENCE.md) with values for each environment:

| Environment | Vercel Target | Domain |
|-------------|--------------|--------|
| **Local** | — | `localhost:3000` |
| **DEV** | `development` | `dev.searchfit.ai` |
| **STG** | `preview` | `stg.searchfit.ai` |
| **PROD** | `production` | `searchfit.ai` |

#### Required Variables

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `DATABASE_URL` | Postgres connection string | Local: `postgresql://USER@localhost:5432/searchfit_turbo` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | [Clerk Dashboard](https://dashboard.clerk.com) |
| `CLERK_SECRET_KEY` | Clerk secret key | [Clerk Dashboard](https://dashboard.clerk.com) |
| `BILLING_STRIPE_SECRET_KEY` | Stripe secret key | [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) |
| `BILLING_STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Stripe CLI or Stripe Dashboard → Webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) |
| `NEXT_PUBLIC_BILLING_PRICE_GRWOTH_PLAN_MONTHLY_ID` | Stripe Price ID (monthly) | Stripe Dashboard → Products |
| `NEXT_PUBLIC_BILLING_PRICE_GRWOTH_PLAN_YEARLY_ID` | Stripe Price ID (yearly) | Stripe Dashboard → Products |
| `TRIGGER_PROJECT_ID` | Trigger.dev project ID | [Trigger.dev Dashboard](https://cloud.trigger.dev) |
| `TRIGGER_SECRET_KEY` | Trigger.dev secret key | [Trigger.dev Dashboard](https://cloud.trigger.dev) |
| `EMAIL_RESEND_API_KEY` | Resend API key | [Resend Dashboard](https://resend.com) |
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway key | [Vercel Dashboard](https://vercel.com) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL | [Upstash Console](https://console.upstash.com) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token | [Upstash Console](https://console.upstash.com) |
| `R2_ACCOUNT_ID` | Cloudflare account ID | [Cloudflare Dashboard](https://dash.cloudflare.com) |
| `R2_ACCESS_KEY_ID` | R2 access key | Cloudflare Dashboard → R2 → API Tokens |
| `R2_SECRET_ACCESS_KEY` | R2 secret key | Cloudflare Dashboard → R2 → API Tokens |
| `INTEGRATION_ENCRYPTION_KEY` | Encryption key for stored credentials | Generate: `openssl rand -hex 32` |

### Vercel Deployment

The project is deployed on Vercel (Project ID: `prj_KsE1diyqM2fZTJl8f54jAtjXeLmX`).

Environment variables are managed per Vercel environment. To re-provision them, run:

```bash
bash scripts/setup-vercel-envs.sh
```
