import { redirect } from 'next/navigation';
import { SignUp } from '@clerk/nextjs';
import { getWaitlistMode } from '@/lib/get-waitlist-mode';

export default async function SignUpPage() {
  const isWaitlistMode = await getWaitlistMode();
  
  // Redirect to waitlist if waitlist mode is enabled
  if (isWaitlistMode) {
    redirect('/waitlist');
  }

  return (
    <SignUp
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
      path="/auth/sign-up"
      signInUrl="/auth/sign-in"
      fallbackRedirectUrl="/workspace-setup"
      forceRedirectUrl="/workspace-setup"
    />
  );
}

