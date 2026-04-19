// Force IPv4 DNS resolution at the module level — Railway resolves
// smtp.gmail.com to IPv6 by default which is blocked by outbound firewall rules.
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const user = (process.env.SMTP_USER || '').replace(/^["']|["']$/g, '');
  const pass = (process.env.SMTP_PASS || '').replace(/^["']|["']$/g, '');
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);

  console.log('INITIALIZING EMAIL SEND:', { host, port, user });

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,    // true only for port 465 (SSL), false for 587 (STARTTLS)
    requireTLS: port !== 465, // enforce STARTTLS upgrade on port 587
    family: 4,               // Force IPv4 socket connections
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false, // Accept self-signed certs in Railway sandbox
    },
  });

  const message = {
    from: `"SchoolMart" <${user}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
