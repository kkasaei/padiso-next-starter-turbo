# Environment Setup

## Create `.env.local` file

Create a file named `.env.local` in the `apps/admin` directory with the following content:

```bash
# Clerk Authentication
# Get your keys from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

## Getting Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **API Keys** section
4. Copy the **Publishable Key** and **Secret Key**
5. Paste them into your `.env.local` file

## Note

The `.env.local` file is gitignored and will not be committed to the repository.

For production deployment, set these environment variables in your hosting platform's environment settings.
