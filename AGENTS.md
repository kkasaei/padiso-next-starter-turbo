# AGENTS.md — SearchFit Development Guidelines

## **IMPORTANT: We only support a 7-day free trial. All trial references must use 7 days. Never use 14 days or any other trial duration.**

The trial period is configured in `packages/billing/src/plans.ts` (`trialDays: 7`) and consumed dynamically throughout the app via `PLANS.growth.trialDays`. Do not hardcode trial durations — always reference the plan config.

---

## Project Structure

This is a **Turborepo** monorepo using **pnpm** workspaces.

### Apps

| App | Path | Description |
|-----|------|-------------|
| `web` | `apps/web` | Main Next.js app (marketing site + authenticated dashboard) |
| `admin` | `apps/admin` | Admin dashboard (internal) |
| `api` | `apps/api` | NestJS backend API |
| `hub` | `apps/hub` | Design system hub / component showcase |
| `embed` | `apps/embed` | Embeddable widget (Vite + React) |

### Packages

| Package | Path | Description |
|---------|------|-------------|
| `@workspace/billing` | `packages/billing` | Stripe billing, plans config, webhooks. Import `@workspace/billing` for client-safe exports, `@workspace/billing/server` for Stripe API |
| `@workspace/db` | `packages/db` | Drizzle ORM, Postgres schema, migrations |
| `@workspace/trpc` | `packages/trpc` | tRPC routers, client, server setup |
| `@workspace/ui` | `packages/ui` | Shared UI components (shadcn/ui based) |
| `@workspace/common` | `packages/common` | Shared utilities, routes, auth helpers, billing components |
| `@workspace/ai` | `packages/ai` | AI/LLM integrations |
| `@workspace/integrations` | `packages/integrations` | Third-party integrations (Google, Reddit, etc.) |
| `@workspace/analytics` | `packages/analytics` | PostHog analytics |
| `@workspace/email` | `packages/email` | Email templates (React Email) |
| `@workspace/cloudflare` | `packages/cloudflare` | Cloudflare R2 storage |
| `@workspace/trigger` | `packages/trigger` | Background jobs (Trigger.dev) |
| `@workspace/monitoring` | `packages/monitoring` | Error tracking & monitoring |

## Key Technical Decisions

- **Auth**: Clerk (`@clerk/nextjs`) — organizations map to workspaces
- **Database**: Postgres via Drizzle ORM. Schema in `packages/db/src/schema/`
- **API layer**: Use **tRPC** for all client-server communication. Avoid creating unnecessary API routes. The only API routes should be for webhooks and third-party callbacks
- **Billing**: Stripe via `packages/billing`. Plans defined in `packages/billing/src/plans.ts`, limits in `packages/billing/src/limits.json`
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion (`motion/react`)

## Workspace Setup Flow

The onboarding flow at `/workspace-setup` uses a **payment-first** approach:

1. **Workspace Details** — collect name, slug, logo. Validate slug availability with Clerk (no org created yet)
2. **Select Plan** — choose billing interval, redirect to Stripe Checkout
3. **Provisioning** — after payment, create Clerk org → DB workspace → link Stripe subscription
4. **Survey** — optional onboarding questions, then redirect to dashboard

Clerk org and DB workspace are only created **after** successful Stripe payment. This prevents orphaned resources from abandoned signups.
