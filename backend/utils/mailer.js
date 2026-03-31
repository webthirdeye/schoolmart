const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendQuoteEmail = async (quote) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Sending it to the admin
    subject: `New Quote Request from ${quote.schoolName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #3B82F6; border-bottom: 2px solid #3B82F6; padding-bottom: 10px;">New Quote Submitted</h2>
        <div style="margin-top: 20px;">
          <p><strong>School Name:</strong> ${quote.schoolName}</p>
          <p><strong>Phone Number:</strong> ${quote.phone || 'N/A'}</p>
          <p><strong>Email:</strong> ${quote.email || 'N/A'}</p>
          <p><strong>Pin Code:</strong> ${quote.pinCode || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f9f9f9; padding: 15px; border-left: 5px solid #ccc; margin: 10px 0;">
            ${quote.message || 'No message provided.'}
          </blockquote>
        </div>
        <div style="margin-top: 30px; font-size: 0.8em; color: #777; border-top: 1px solid #eee; pt: 10px;">
          This is an automated notification from SchoolMart CMS.
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Quote notification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending quote email:', error);
    throw error;
  }
};

module.exports = { sendQuoteEmail };
