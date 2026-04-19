const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('INITIALIZING EMAIL SEND:', {
    host: process.env.SMTP_HOST || 'NOT SET',
    port: process.env.SMTP_PORT || 'NOT SET',
    user: process.env.SMTP_USER || 'NOT SET'
  });

  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: port,
    secure: port === 465, // true for 465, false for other ports
    family: 4, // Force IPv4 to avoid ENETUNREACH parsing
    auth: {
      user: process.env.SMTP_USER?.replace(/^["']|["']$/g, ''),
      pass: process.env.SMTP_PASS?.replace(/^["']|["']$/g, ''),
    },
  });

  const message = {
    from: `${process.env.SMTP_USER}`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
