// utils/sendVerificationEmail.ts

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SEND_GRID_API_KEY!);

export async function sendVerificationEmail(email: string, code: string) {
  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL!,
    subject: 'Email Verification - Complete Your Registration',
    html: `
      <p>Thank you for registering! Please verify your email by entering the following code:</p>
      <h2>${code}</h2>
      <p>This code will expire in 15 minutes.</p>
    `,
  };
  
  await sgMail.send(msg);
}
