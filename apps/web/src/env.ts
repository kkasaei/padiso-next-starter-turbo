import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1).optional(),
    

    // Cloudflare Turnstile (Captcha)
    TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
    TURNSILE_SECRET_KEY_CONTACT_FORM: z.string().min(1).optional(),

  },
  client: {
    NEXT_PUBLIC_CLIENT_URL: z.string().url(),
     

  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    

    // Cloudflare Turnstile (Captcha)
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    TURNSILE_SECRET_KEY_CONTACT_FORM: process.env.TURNSILE_SECRET_KEY_CONTACT_FORM,

  }
});
