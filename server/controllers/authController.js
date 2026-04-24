const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, selectedServices, ...rest } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      if (userExists.isVerified) {
        return res.status(400).json({ message: 'User already exists and is verified' });
      } else {
        // ALLOW OVERWRITE: If user exists but is not verified, they can try again
        console.log('UNVERIFIED USER RETRYING:', email);
        await userExists.destroy(); // Remove the unverified user to create a fresh one
      }
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log('REGISTRATION ATTEMPT:', { name, email, phone, rest: Object.keys(rest) });

    const user = await User.create({
      name: name || rest.schoolName || rest['School Name'] || 'Unnamed Institution',
      email: email || rest['Email id*'] || rest.email,
      password: password || rest['Create Password*'] || rest.password,
      phone: phone || rest.phone || rest['Phone Number'] || '',
      selectedServices: Array.isArray(selectedServices) ? selectedServices : (rest.selectedServices || []),
      otp,
      otpExpire,
      additionalInfo: rest
    });

    // 1. Send OTP to user
    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify Your SchoolMart Account',
        message: `Your verification OTP is ${otp}.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
            <h2 style="color: #004aad; text-align: center;">Welcome to SchoolMart</h2>
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>Thank you for registering with SchoolMart. Please use the following One-Time Password (OTP) to verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #004aad; letter-spacing: 5px; background: #f0f7ff; padding: 10px 20px; border-radius: 5px; border: 1px dashed #004aad;">${otp}</span>
            </div>
            <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="text-align: center; color: #999; font-size: 12px;">&copy; 2026 SchoolMart. All rights reserved.</p>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('OTP EMAIL FAILED:', emailErr.message);
      await user.destroy();
      return res.status(503).json({
        success: false,
        message: 'Email delivery failed. Please try again.',
        error: emailErr.message
      });
    }

    // 2. Send Notification to Admin
    try {
      const detailsRows = Object.entries(rest)
        .filter(([k, v]) => v && typeof v !== 'object')
        .map(([k, v]) => `<tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${k}</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${v}</td></tr>`)
        .join('');

      await sendEmail({
        email: process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'raikantisathvik@gmail.com',
        subject: '🚀 New Registration: ' + (user.name),
        message: `New user ${user.name} has registered.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #28a745;">New Partner Registration</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee; background: #f9f9f9;"><strong>School Name</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee; background: #f9f9f9;">${user.name}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${user.email}</td></tr>
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${user.phone}</td></tr>
              ${detailsRows}
              <tr><td style="padding: 10px; border-bottom: 1px solid #eee; background: #f9f9f9;"><strong>Services</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee; background: #f9f9f9;">${user.selectedServices.join(', ') || 'None selected'}</td></tr>
            </table>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">This is an automated notification from the SchoolMart Admin System.</p>
          </div>
        `
      });
    } catch (adminEmailErr) {
      console.warn('ADMIN NOTIFICATION FAILED:', adminEmailErr.message);
    }

      res.status(200).json({ success: true, message: 'OTP sent to email' });


  } catch (error) {
    console.error('CRITICAL REGISTRATION ERROR:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server failed to process registration', 
      error: error.message 
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email, otp } });

    if (!user || user.otpExpire < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first' });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'Reset Your SchoolMart Password',
      message: `Your password reset OTP is ${otp}.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
          <h2 style="color: #d9534f; text-align: center;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Please use the following OTP to continue:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #d9534f; letter-spacing: 5px; background: #fff5f5; padding: 10px 20px; border-radius: 5px; border: 1px dashed #d9534f;">${otp}</span>
          </div>
          <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes. If you did not request this, you can safely ignore this email.</p>
        </div>
      `
    });

    res.status(200).json({ success: true, message: 'Reset OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ where: { email, otp } });

    if (!user || user.otpExpire < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'Resend Verification OTP',
      message: `Your new verification OTP is ${otp}.`,
      html: `<h1>New OTP</h1><p>Your new verification OTP is <strong>${otp}</strong>.</p>`
    });

    res.status(200).json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Current Logged-in User
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

