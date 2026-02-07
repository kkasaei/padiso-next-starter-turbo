'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SignIn } from '@clerk/nextjs';
import { toast } from '@workspace/ui/components/sonner';

function SignInToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('msg') === 'waitlist-closed') {
      toast("We're no longer on waitlist — sign in and get started!");
    }
  }, [searchParams]);

  return null;
}

export default function SignInPage() {
  return (
    <>
      <Suspense fallback={null}>
        <SignInToast />
      </Suspense>
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
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
      />
    </>
  );
}
