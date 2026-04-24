// sendEmail.js
// Completely bypasses Railway SMTP blocks by forcing HTTPS (port 443) via REST APIs.

const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { Resend } = require('resend');

const sendEmail = async (options) => {
  const fromName = "SchoolMart Accounts";
  
  // ── [1] Resend API (HTTPS Port 443) - Preferred Cloud Solution ──
  if (process.env.RESEND_API_KEY) {
    console.log('[sendEmail] Using Resend REST API (HTTPS)');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: `${fromName} <onboarding@resend.dev>`, // Must be a verified domain or onboarding@resend.dev for testing
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message,
    });
    if (error) throw new Error(`Resend Error: ${error.message}`);
    console.log('[sendEmail] Resend API delivered:', data?.id);
    return;
  }

  // ── [2] Gmail API via OAuth2 (HTTPS Port 443) ──
  if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN) {
    console.log('[sendEmail] Using Nodemailer OAuth2 (HTTPS)');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SMTP_USER.replace(/^["']|["']$/g, ''),
        clientId: process.env.GMAIL_CLIENT_ID.replace(/^["']|["']$/g, ''),
        clientSecret: process.env.GMAIL_CLIENT_SECRET.replace(/^["']|["']$/g, ''),
        refreshToken: process.env.GMAIL_REFRESH_TOKEN.replace(/^["']|["']$/g, ''),
      },
    });

    const info = await transporter.sendMail({
      from: `"${fromName}" <${process.env.SMTP_USER.replace(/^["']|["']$/g, '')}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message,
    });

    console.log('[sendEmail] Gmail OAuth2 delivered:', info.messageId);
    return;
  }

  // ── [3] Legacy SMTP / Local Dev Fallback (Will timeout on Railway) ──
  console.log('[sendEmail] WARNING: Using legacy SMTP via Port 587. Railway blocks this port.');
  const pass = (process.env.SMTP_PASS || '').replace(/^["']|["']$/g, '');
  const gmailUser = (process.env.SMTP_USER || '').replace(/^["']|["']$/g, '');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // port 587
    auth: { user: gmailUser, pass },
    connectionTimeout: 10000,
  });

  const info = await transporter.sendMail({
    from: `"${fromName}" <${gmailUser}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message,
  });

  console.log('[sendEmail] SMTP delivered:', info.messageId);
};

module.exports = sendEmail;
