import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    // Stash pending user data until OTP is confirmed
    pendingUserData: {
      name: { type: String, required: true },
      passwordHash: { type: String, required: true },
      studentId: { type: String },
      major: { type: String },
      avatar: { type: String },
    },
    // Attempts count to prevent brute force
    attempts: {
      type: Number,
      default: 0,
      max: 5,
    },
    // TTL index: Mongo will automatically delete this document after 300 seconds (5 minutes)
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300,
    },
  },
  { timestamps: false }
);

const Otp = mongoose.model('Otp', OtpSchema);
export default Otp;
