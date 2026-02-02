import { Resend, type CreateEmailResponse } from 'resend';

import { env } from '@/env';
import { type EmailPayload, type EmailProvider } from '../types';

class ResendEmailProvider implements EmailProvider {
  private readonly from: string;
  private readonly client: Resend;

  constructor() {
    const from = env.EMAIL_FROM;
    if (!from) {
      throw new Error('Missing EMAIL_FROM in environment configuration');
    }

    const apiKey = env.EMAIL_RESEND_API_KEY;
    if (!apiKey) {
      throw new Error(
        'Missing EMAIL_RESEND_API_KEY in environment configuration'
      );
    }

    this.from = from;
    this.client = new Resend(apiKey);
  }

  public async sendEmail(payload: EmailPayload): Promise<CreateEmailResponse> {
    const response = await this.client.emails.send({
      from: this.from,
      to: payload.recipient,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo: payload.replyTo
    });
    if (response.error) {
      throw Error(response.error.message ?? 'Could not send mail.');
    }

    return response;
  }
}

export default new ResendEmailProvider();
