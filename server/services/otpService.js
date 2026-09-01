import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Otp from '../models/Otp.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is always loaded from server directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

/**
 * Creates and returns a verified Nodemailer transporter using configured SMTP/Gmail credentials.
 */
const getTransporter = () => {
  // Reload in case .env was modified while server was running
  dotenv.config({ path: path.resolve(__dirname, '../.env') });

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass || !emailUser.trim() || !emailPass.trim()) {
    throw new Error(
      'Email service is not configured. Please add EMAIL_USER and EMAIL_PASS (App Password) to server/.env so verification emails can be delivered to real inboxes.'
    );
  }

  const cleanUser = emailUser.trim();
  const cleanPass = emailPass.trim().replace(/\s+/g, ''); // Remove spaces if user copied "abcd efgh ijkl mnop"

  // Gmail / Custom SMTP Transporter
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: true, // Use SSL/TLS
    auth: {
      user: cleanUser,
      pass: cleanPass,
    },
  });
};

/**
 * Generate 6-digit OTP, hash it with bcrypt, save to MongoDB, and send real email.
 */
export const generateAndSendOtp = async (email, pendingUserData) => {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Check if email transporter is available
  const transporter = getTransporter();

  // 2. Generate secure 6-digit numerical code
  const otpCode = crypto.randomInt(100000, 999999).toString();

  // 3. Hash the OTP with bcrypt before saving to database
  const salt = await bcrypt.genSalt(10);
  const otpHash = await bcrypt.hash(otpCode, salt);

  // 4. Clear any existing OTP for this email and save the new one (5-minute TTL)
  await Otp.deleteMany({ email: normalizedEmail });
  await Otp.create({
    email: normalizedEmail,
    otpHash,
    pendingUserData,
    createdAt: new Date(),
  });

  // 5. Send Real Email via Nodemailer
  const mailOptions = {
    from: `"Smartech Security" <${process.env.EMAIL_USER}>`,
    to: normalizedEmail,
    subject: `Your Smartech Verification Code: ${otpCode}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background-color: #faf4f5; border-radius: 20px; color: #3d2839;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-size: 28px; font-weight: 800; color: #3d2839; margin: 0;">Smar<span style="color: #a85597;">t</span>ech</h1>
          <p style="font-size: 14px; color: #8c7185; margin-top: 4px;">Student Account Verification</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 28px; border-radius: 16px; box-shadow: 0 4px 16px rgba(120, 80, 105, 0.08); text-align: center;">
          <h2 style="font-size: 18px; font-weight: 700; color: #3d2839; margin-top: 0;">Verify Your Email Address</h2>
          <p style="font-size: 14px; color: #624b5d; line-height: 1.5; margin-bottom: 24px;">
            Hello <strong>${pendingUserData?.name || 'Student'}</strong>,<br>
            Please enter the 6-digit verification code below to verify your email and unlock your personal learning dashboard:
          </p>
          
          <div style="background: linear-gradient(135deg, #f7edf4, #ebdce5); border: 2px dashed #a85597; border-radius: 12px; padding: 18px; margin: 20px 0;">
            <span style="font-family: monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #624b5d;">
              ${otpCode}
            </span>
          </div>
          
          <p style="font-size: 12px; color: #8c7185; margin-top: 16px;">
            ⏱️ This code will expire in <strong>5 minutes</strong>. If you did not request this, please ignore this email.
          </p>
        </div>

        <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #a88fa0;">
          © ${new Date().getFullYear()} Smartech Learning Dashboard. All rights reserved.
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Nodemailer] Real OTP email successfully delivered to: ${normalizedEmail} (Message ID: ${info.messageId})`);
    return { success: true, email: normalizedEmail };
  } catch (error) {
    console.error(`❌ [Nodemailer Error] Could not send email to ${normalizedEmail}:`, error.message);
    throw new Error(`Failed to send email to ${normalizedEmail}: ${error.message}`);
  }
};

/**
 * Verify submitted OTP against stored hash in MongoDB.
 */
export const verifySubmittedOtp = async (email, inputOtp) => {
  const normalizedEmail = email.trim().toLowerCase();

  // Find OTP document in database
  const otpRecord = await Otp.findOne({ email: normalizedEmail });

  if (!otpRecord) {
    return {
      valid: false,
      message: 'Verification code has expired or was not found. Please request a new code.',
    };
  }

  // Check attempt limit
  if (otpRecord.attempts >= 5) {
    await Otp.deleteOne({ _id: otpRecord._id });
    return {
      valid: false,
      message: 'Too many incorrect attempts. Please request a fresh verification code.',
    };
  }

  // Compare submitted code with hashed OTP
  const isMatch = await bcrypt.compare(inputOtp.toString().trim(), otpRecord.otpHash);

  if (!isMatch) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    return {
      valid: false,
      message: `Invalid verification code. ${5 - otpRecord.attempts} attempts remaining.`,
    };
  }

  // Valid: retrieve stashed pending user data and remove used OTP
  const pendingData = otpRecord.pendingUserData;
  await Otp.deleteOne({ _id: otpRecord._id });

  return {
    valid: true,
    userData: pendingData,
  };
};
