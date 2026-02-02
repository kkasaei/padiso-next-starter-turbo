import * as postmark from 'postmark';

import { env } from '@/env';
import { type EmailPayload, type EmailProvider } from '../types';

class PostmarkEmailProvider implements EmailProvider {
  private readonly from: string;
  private readonly client: postmark.ServerClient;

  constructor() {
    const from = env.EMAIL_FROM;
    if (!from) {
      throw new Error('Missing EMAIL_FROM in environment configuration');
    }

    const serverToken = env.EMAIL_POSTMARK_SERVER_TOKEN;
    if (!serverToken) {
      throw new Error(
        'Missing EMAIL_POSTMARK_SERVER_TOKEN in environment configuration'
      );
    }

    this.from = from;
    this.client = new postmark.ServerClient(serverToken);
  }

  public async sendEmail(
    payload: EmailPayload
  ): Promise<postmark.Models.MessageSendingResponse> {
    const response = await this.client.sendEmail({
      From: this.from,
      To: payload.recipient,
      Subject: payload.subject,
      HtmlBody: payload.html,
      TextBody: payload.text,
      ReplyTo: payload.replyTo
    });
    if (response.ErrorCode > 0) {
      throw new Error(response.Message);
    }

    return response;
  }
}

export default new PostmarkEmailProvider();
