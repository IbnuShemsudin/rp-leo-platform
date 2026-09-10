# Switch OTP Verification Email to Brevo (Sendinblue)

## Problem
Gmail SMTP only delivers to the account owner's own email (`isrubest18@gmail.com`). Emails to external domains are silently dropped by Gmail's anti-abuse systems.

## Root Cause
`issueEmailOtp` in `server/controllers/authController.js` uses `sendEmailNotification` (nodemailer → Gmail SMTP), which Gmail restricts from sending to non-Gmail addresses.

## Scope
**Only** the OTP / email-verification flow switches to Brevo. All other emails (MoU notifications, admin alerts via `notifyAdmins.js` and `mouRoutes.js`) remain on nodemailer unchanged.

## Changes

### 1. Create `server/utils/brevoEmail.js` (new file)
- Import `BrevoClient` from `@getbrevo/brevo`
- Create singleton client using `BREVO_API_KEY` env var
- Export `sendOtpEmail({ to, subject, htmlContent })` with the same signature as `sendEmailNotification`
- Use `BREVO_SENDER_EMAIL` env var for the sender (fallback to `EMAIL_USER`)
- Log success/failure for debugging

### 2. Edit `server/controllers/authController.js`
- Replace import: `sendEmailNotification` → `sendOtpEmail` (from `../utils/brevoEmail.js`)
- Change call on line 398 in `issueEmailOtp` from `sendEmailNotification({...})` to `sendOtpEmail({...})`
- `sendEmailNotification` import is no longer needed in this file (only used for OTP here)

### 3. Edit `server/.env`
- Add `BREVO_API_KEY=` (user fills in their actual key)
- Add `BREVO_SENDER_EMAIL=isrubest18@gmail.com` (or their Brevo-verified sender)

## What Stays Unchanged
- `server/utils/email.js` — nodemailer transport, unchanged
- `server/utils/notifyAdmins.js` — still imports from `email.js`
- `server/routes/mouRoutes.js` — still imports from `email.js`
- `server/utils/emailTemplates.js` — unchanged (still generates HTML)
- `.env` existing `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_HOST`, etc. — unchanged

## Brevo SDK API (verified)
```javascript
import { BrevoClient } from '@getbrevo/brevo';

const brevoClient = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

await brevoClient.transactionalEmails.sendTransacEmail({
  subject,
  htmlContent,
  sender: { name: "SSGI RP-LEO System", email: process.env.BREVO_SENDER_EMAIL },
  to: [{ email: to }],
});
```

## User Actions Required
1. Sign up at [brevo.com](https://www.brevo.com) (free plan: 300 emails/day)
2. Create an API key in Brevo Dashboard → Settings → API Keys
3. Verify `isrubest18@gmail.com` as an approved sender email in Brevo (they'll email a confirmation link)
4. Paste API key into `BREVO_API_KEY` in `server/.env`

## Validation
- Register a new user with a **non-Gmail** address (e.g., `test@yahoo.com`)
- Should receive OTP email within seconds
- Server console should show `✉️ OTP email sent successfully via Brevo`
- Existing MoU/admin notifications still work via nodemailer
