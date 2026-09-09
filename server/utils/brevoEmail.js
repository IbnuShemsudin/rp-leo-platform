import { BrevoClient } from '@getbrevo/brevo';

const SENDER_NAME = 'SSGI RP-LEO System';

export const sendOtpEmail = async ({ to, subject, htmlContent }) => {
  try {
    if (!to) {
      console.warn('⚠️ OTP email skipped: No target email address provided.');
      return;
    }

    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    if (!apiKey || !senderEmail) {
      throw new Error(
        'Brevo OTP email is not configured. Set BREVO_API_KEY and BREVO_SENDER_EMAIL.'
      );
    }
    if (apiKey.startsWith('xsmtpsib-')) {
      throw new Error(
        'BREVO_API_KEY contains an SMTP key. Create an API key in Brevo under SMTP & API > API Keys.'
      );
    }

    const brevoClient = new BrevoClient({ apiKey });

    const result = await brevoClient.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent,
      sender: { name: SENDER_NAME, email: senderEmail },
      to: [{ email: to }],
    });

    console.log('✉️ OTP email sent successfully via Brevo:', result);
    return result;
  } catch (error) {
    console.error('❌ BREVO OTP EMAIL ERROR:', error);
    throw error;
  }
};
