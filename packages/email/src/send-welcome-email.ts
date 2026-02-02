import { render } from '@react-email/render';

import { EmailProvider } from './provider';
import {
  WelcomeEmail,
  type WelcomeEmailProps
} from './templates/welcome-email';

export async function sendWelcomeEmail(
  input: WelcomeEmailProps & { recipient: string }
): Promise<void> {
  const component = WelcomeEmail(input);
  const html = await render(component);
  const text = await render(component, { plainText: true });

  await EmailProvider.sendEmail({
    recipient: input.recipient,
    subject: `Welcome to ${input.appName}`,
    html,
    text
  });
}
