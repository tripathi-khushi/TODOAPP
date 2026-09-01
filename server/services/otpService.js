import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import Otp from '../models/Otp.js';

/**
 * Creates and returns a Nodemailer transporter.
 */
const getTransporter = async () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Configured with custom SMTP or Gmail
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Development Fallback: Ethereal test transporter
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

/**
 * Generate 6-digit OTP, hash it, store with pending user data, and dispatch email.
 */
export const generateAndSendOtp = async (email, pendingUserData) => {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Generate secure 6-digit numerical code
  const otpCode = crypto.randomInt(100000, 999999).toString();

  // 2. Hash the OTP with bcrypt before saving to database
  const salt = await bcrypt.genSalt(10);
  const otpHash = await bcrypt.hash(otpCode, salt);

  // 3. Clear any existing OTP for this email and save the new one
  await Otp.deleteMany({ email: normalizedEmail });
  await Otp.create({
    email: normalizedEmail,
    otpHash,
    pendingUserData,
    createdAt: new Date(),
  });

  // 4. Send Email via Nodemailer
  try {
    const transporter = await getTransporter();

    const mailOptions = {
      from: '"Smartech Security" <noreply@smartech.edu>',
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
              Please enter the 6-digit verification code below to complete creating your account and unlock your learning dashboard:
            </p>
            
            <div style="background: linear-gradient(135deg, #f7edf4, #ebdce5); border: 2px dashed #a85597; border-radius: 12px; padding: 18px; margin: 20px 0;">
              <span style="font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #624b5d;">
                ${otpCode}
              </span>
            </div>
            
            <p style="font-size: 12px; color: #8c7185; margin-top: 16px;">
              ⏱️ This code is valid for <strong>5 minutes</strong>. If you did not request this, you can safely ignore this email.
            </p>
          </div>

          <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #a88fa0;">
            © ${new Date().getFullYear()} Smartech Learning Dashboard. All rights reserved.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('====================================================');
    console.log(`✉️  OTP EMAIL DISPATCHED to: ${normalizedEmail}`);
    console.log(`🔢 VERIFICATION CODE:       ${otpCode}`);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`🌐 Preview URL:             ${nodemailer.getTestMessageUrl(info)}`);
    }
    console.log('====================================================');

    return { success: true, email: normalizedEmail };
  } catch (emailError) {
    console.error('Failed to send email via Nodemailer:', emailError);
    // Still log code in console for development fallback
    console.log('====================================================');
    console.log(`🔢 [DEV FALLBACK] OTP CODE for ${normalizedEmail}: ${otpCode}`);
    console.log('====================================================');
    return { success: true, email: normalizedEmail, devCode: otpCode };
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
