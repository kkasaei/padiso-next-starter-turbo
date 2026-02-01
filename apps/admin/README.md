# Admin Dashboard

SearchFIT Admin Application - Platform administration and management.

## Getting Started

### Prerequisites

1. Copy the environment variables:
```bash
cp .env.example .env.local
```

2. Add your Clerk API keys to `.env.local`:
   - Get your keys from [Clerk Dashboard](https://dashboard.clerk.com)
   - Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Add `CLERK_SECRET_KEY`

### Development

```bash
# Install dependencies (from root)
pnpm install

# Run development server
pnpm dev
# or from root
pnpm --filter admin dev
```

Open [http://localhost:3002](http://localhost:3002) with your browser.

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: @workspace/ui (shared component library)
- **Database**: @workspace/db (shared database package)
- **Common Utils**: @workspace/common (shared utilities)

## Project Structure

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Redirects to /admin
│   │   └── admin/
│   │       ├── layout.tsx          # Admin layout with sidebar
│   │       ├── page.tsx            # Dashboard
│   │       ├── users/              # User management
│   │       ├── organizations/      # Organization management
│   │       ├── analytics/          # Analytics
│   │       ├── reports/            # Reports
│   │       └── settings/           # Settings
│   ├── components/
│   │   └── layout/
│   │       ├── providers.tsx       # Theme provider
│   │       └── admin-nav.tsx       # Sidebar navigation
│   └── lib/
│       └── utils.ts                # Utility functions
├── .env.example                    # Environment variables template
├── .env.local                      # Your local environment variables (gitignored)
├── package.json
└── next.config.mjs
```

## Features

- 📊 Dashboard with platform metrics
- 👥 User management
- 🏢 Organization management
- 📈 Analytics dashboard
- 📄 Report generation
- ⚙️ Platform settings
- 🎨 Same layout structure as main web app
- 🔐 Protected routes with Clerk authentication

## Commands

- `pnpm dev` - Start development server (port 3002)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linter
- `pnpm typecheck` - Run TypeScript type checking

## Environment Variables

See `.env.example` for all required environment variables.

### Required Variables

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public API key
- `CLERK_SECRET_KEY` - Clerk secret API key
- `NEXT_PUBLIC_APP_URL` - Application URL (default: http://localhost:3002)
