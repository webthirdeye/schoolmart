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
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      name: name || rest.schoolName || 'Unnamed Institution',
      email,
      password,
      phone: phone || rest.phone || '',
      selectedServices: selectedServices || rest.selectedServices || [],
      otp,
      otpExpire,
      additionalInfo: rest
    });

    // Send OTP to user
    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification OTP - SchoolMart',
        message: `Your verification OTP is ${otp}. It expires in 10 minutes.`,
        html: `<h1>Verify Your Email</h1><p>Your verification OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`
      });

      // Send Notification to Admin
      const extraDetails = Object.entries(rest).map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`).join('');
      await sendEmail({
        email: process.env.ADMIN_EMAIL,
        subject: 'New User Registration Attempt',
        message: `A new user ${user.name} (${email}) has registered.\nDetails: ${JSON.stringify(rest)}`,
        html: `<h1>New Registration</h1><p><strong>Name:</strong> ${user.name}</p><p><strong>Email:</strong> ${email}</p>${extraDetails}`
      });

      res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (err) {
      console.error(err);
      user.otp = null;
      user.otpExpire = null;
      await user.save();
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      subject: 'Password Reset OTP - SchoolMart',
      message: `Your password reset OTP is ${otp}. It expires in 10 minutes.`,
      html: `<h1>Reset Your Password</h1><p>Your password reset OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`
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

