'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: 'mx-auto',
          card: 'shadow-lg border-border',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          formButtonPrimary:
            'bg-primary text-primary-foreground hover:bg-primary/90',
          socialButtonsBlockButton:
            'border-input hover:bg-accent hover:text-accent-foreground',
          formFieldInput:
            'border-input bg-background text-foreground',
          footerActionLink: 'text-primary hover:text-primary/90'
        }
      }}
      routing="path"
      path="/auth/sign-in"
      signUpUrl="/auth/sign-up"
      fallbackRedirectUrl="/workspace-setup"
      forceRedirectUrl="/workspace-setup"
    />
  );
}

