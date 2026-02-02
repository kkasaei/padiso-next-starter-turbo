import { EmailProvider } from './provider';

export interface SendContactFormEmailInput {
  recipient: string; // Team email (hi@searchfit.ai)
  firstName: string;
  lastName: string;
  email: string; // Customer's email
  message: string;
  ipAddress?: string;
  userAgent?: string;
  contactRequestId: string;
}

/**
 * Send contact form notification email to team
 *
 * This sends a simple, clean notification to your team email
 * when someone submits the contact form.
 */
export async function sendContactFormEmail(
  input: SendContactFormEmailInput
): Promise<void> {
  try {
    const {
      recipient,
      firstName,
      lastName,
      email,
      message,
      ipAddress,
      userAgent,
      contactRequestId,
    } = input;

    const fullName = `${firstName} ${lastName}`;
    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long',
    });

    // Simple, clean HTML email
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                📧 New Contact Form Submission
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Contact Information -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding-bottom: 20px;">
                    <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                      Contact Information
                    </h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px; width: 120px; vertical-align: top;">
                          <strong>Name:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">
                          ${fullName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px; vertical-align: top;">
                          <strong>Email:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">
                          <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">
                            ${email}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px; vertical-align: top;">
                          <strong>Submitted:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">
                          ${timestamp}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding-bottom: 12px;">
                    <h2 style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                      Message
                    </h2>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f9f9f9; border-left: 4px solid #667eea; padding: 20px; border-radius: 6px;">
                    <p style="margin: 0; color: #1a1a1a; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
${message}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Quick Reply Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}?subject=Re:%20Your%20inquiry%20to%20SearchFit" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                      📧 Reply to ${firstName}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Technical Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e5e5e5; padding-top: 20px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 12px 0; color: #666666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Technical Details
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 4px 0; color: #999999; font-size: 12px; width: 120px;">
                          Request ID:
                        </td>
                        <td style="padding: 4px 0; color: #666666; font-size: 12px; font-family: 'Courier New', monospace;">
                          ${contactRequestId}
                        </td>
                      </tr>
                      ${
                        ipAddress
                          ? `
                      <tr>
                        <td style="padding: 4px 0; color: #999999; font-size: 12px;">
                          IP Address:
                        </td>
                        <td style="padding: 4px 0; color: #666666; font-size: 12px; font-family: 'Courier New', monospace;">
                          ${ipAddress}
                        </td>
                      </tr>
                      `
                          : ''
                      }
                      ${
                        userAgent
                          ? `
                      <tr>
                        <td style="padding: 4px 0; color: #999999; font-size: 12px; vertical-align: top;">
                          User Agent:
                        </td>
                        <td style="padding: 4px 0; color: #666666; font-size: 12px; font-family: 'Courier New', monospace; word-break: break-all;">
                          ${userAgent}
                        </td>
                      </tr>
                      `
                          : ''
                      }
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; color: #999999; font-size: 12px;">
                This email was automatically generated by your SearchFit contact form.<br>
                View all submissions in your database or Slack notifications.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Plain text version
    const text = `
New Contact Form Submission
============================

CONTACT INFORMATION
-------------------
Name: ${fullName}
Email: ${email}
Submitted: ${timestamp}

MESSAGE
-------
${message}

REPLY TO THIS EMAIL
-------------------
Click here to reply: mailto:${email}

TECHNICAL DETAILS
-----------------
Request ID: ${contactRequestId}
${ipAddress ? `IP Address: ${ipAddress}` : ''}
${userAgent ? `User Agent: ${userAgent}` : ''}

---
This email was automatically generated by your SearchFit contact form.
    `;

    // Send email
    await EmailProvider.sendEmail({
      recipient,
      subject: `📧 New Contact: ${fullName}`,
      html,
      text,
      replyTo: email, // Reply directly to the customer
    });

    console.log(
      `[Email] ✅ Contact form notification sent to ${recipient} for submission from ${email}`
    );
  } catch (error) {
    console.error('[Email] ❌ Failed to send contact form email:', error);
    // Don't throw - email failure shouldn't block the contact form submission
  }
}

