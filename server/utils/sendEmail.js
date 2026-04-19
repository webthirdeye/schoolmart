const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('INITIALIZING EMAIL SEND:', {
    host: process.env.SMTP_HOST || 'NOT SET',
    port: process.env.SMTP_PORT || 'NOT SET',
    user: process.env.SMTP_USER || 'NOT SET'
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    family: 4, // Force IPv4 to avoid ENETUNREACH with IPv6
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
