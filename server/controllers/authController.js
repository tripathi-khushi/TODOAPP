import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateAndSendOtp, verifySubmittedOtp } from '../services/otpService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'smartech_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

// Helper to sign JWT token
const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// @desc    Step 1 of Signup: Validate details & send 6-digit OTP email to user's inbox
// @route   POST /api/auth/send-signup-otp
export const sendSignupOtp = async (req, res) => {
  try {
    const { name, email, password, studentId, major, avatar } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your full name' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your email address' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists in database
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.',
      });
    }

    // Stash pending registration data
    const pendingUserData = {
      name: name.trim(),
      password: password,
      studentId: studentId ? studentId.trim() : `ST-${Math.floor(1000 + Math.random() * 9000)}`,
      major: major ? major.trim() : 'Robotics & AI Engineering',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    // Dispatch real email via Nodemailer
    await generateAndSendOtp(normalizedEmail, pendingUserData);

    res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been sent to your email (${normalizedEmail}). Please check your inbox or spam folder.`,
      email: normalizedEmail,
    });
  } catch (error) {
    console.error('Error in sendSignupOtp:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send verification email. Please verify email settings.',
    });
  }
};

// @desc    Step 2 of Signup: Verify 6-digit OTP and activate user account
// @route   POST /api/auth/verify-signup-otp
export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please enter the 6-digit verification code sent to your email',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify OTP against MongoDB
    const verification = await verifySubmittedOtp(normalizedEmail, otp);

    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.message,
      });
    }

    const { userData } = verification;

    // Check once again to avoid duplicate creation
    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Account already verified and created. Please log in.',
      });
    }

    // Create user in MongoDB (UserSchema.pre('save') will hash the password once properly)
    user = new User({
      name: userData.name,
      email: normalizedEmail,
      password: userData.password || userData.passwordHash,
      studentId: userData.studentId,
      major: userData.major,
      avatar: userData.avatar,
      isVerified: true,
    });

    await user.save();

    // Seed initial personal coursework tasks for this user in MongoDB
    try {
      const { createStarterTasksForUser } = await import('../seeds/starterTasks.js');
      await createStarterTasksForUser(user._id, user.major);
    } catch (seedErr) {
      console.warn('Could not seed initial tasks for user:', seedErr.message);
    }

    // Issue JWT Token
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account verified and created successfully in MongoDB!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        major: user.major,
        avatar: user.avatar,
        isLoggedIn: true,
      },
    });
  } catch (error) {
    console.error('Error in verifySignupOtp:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Verification failed',
    });
  }
};

// @desc    Resend OTP to user's email
// @route   POST /api/auth/resend-otp
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const Otp = (await import('../models/Otp.js')).default;
    const existingOtp = await Otp.findOne({ email: normalizedEmail });

    if (!existingOtp) {
      return res.status(400).json({
        success: false,
        message: 'No pending verification found for this email. Please restart registration.',
      });
    }

    await generateAndSendOtp(normalizedEmail, existingOtp.pendingUserData);

    res.status(200).json({
      success: true,
      message: `A fresh 6-digit verification code has been sent to ${normalizedEmail}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to resend verification code',
    });
  }
};

// @desc    Log in an existing user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email address and password',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user in MongoDB and explicitly select password field
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this email. Please create an account first.',
      });
    }

    // Compare password with hashed password in database
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please try again.',
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        major: user.major,
        avatar: user.avatar,
        isLoggedIn: true,
      },
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

// @desc    Get currently logged in user info
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json({
        success: true,
        user: null,
        isLoggedIn: false,
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        studentId: req.user.studentId,
        major: req.user.major,
        avatar: req.user.avatar,
        isLoggedIn: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
    });
  }
};

// @desc    Update user profile in database
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'You must be logged in to update profile',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in database',
      });
    }

    const { name, email, studentId, major, avatar } = req.body;

    if (name !== undefined) user.name = name.trim();
    if (email !== undefined) user.email = email.trim().toLowerCase();
    if (studentId !== undefined) user.studentId = studentId.trim();
    if (major !== undefined) user.major = major.trim();
    if (avatar !== undefined) user.avatar = avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated in database successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        studentId: updatedUser.studentId,
        major: updatedUser.major,
        avatar: updatedUser.avatar,
        isLoggedIn: true,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};
