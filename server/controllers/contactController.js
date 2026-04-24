const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// Submit a new contact/quote inquiry
exports.submitInquiry = async (req, res) => {
  try {
    const { name, schoolName, pinCode, email, phone, message, subject } = req.body;

    const displayName = schoolName || name;

    if (!displayName || !phone || !message) {
      return res.status(400).json({ message: 'School Name, Phone, and Message are required' });
    }

    const inquiry = await Contact.create({
      name: displayName,
      schoolName: schoolName || name,
      pinCode,
      email,
      phone,
      message,
      subject: subject || 'New Institutional Quote Request'
    });

    // Notify Admin (Optional but recommended)
    try {
      if (process.env.ADMIN_EMAIL || process.env.SMTP_USER) {
        await sendEmail({
          email: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
          subject: subject || 'New Quote Request - SchoolMart',
          message: `New inquiry from ${displayName}. Phone: ${phone}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
              <h2 style="color: #004aad;">New Quote Request</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee; background: #f9f9f9;"><strong>School/Name</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee; background: #f9f9f9;">${displayName}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${email || 'N/A'}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${phone}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Pin Code</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${pinCode || 'N/A'}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Message</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${message}</td></tr>
              </table>
              <p style="margin-top: 20px; font-size: 12px; color: #666;">Source: ${subject || 'Direct Inquiry'}</p>
            </div>
          `
        });
      }
    } catch (emailErr) {
      console.error('Admin notification email failed:', emailErr);
    }

    res.status(201).json({
      success: true,
      message: 'Your request has been received. Our team will contact you shortly.',
      data: inquiry
    });
  } catch (error) {
    console.error('Inquiry submission error:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
};

// Get all inquiries (Admin only)
exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Contact.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data: inquiries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update inquiry status (Admin)
exports.updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Contact.findByPk(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    await inquiry.update({ status: req.body.status });
    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete inquiry (Admin)
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Contact.findByPk(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    await inquiry.destroy();
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


