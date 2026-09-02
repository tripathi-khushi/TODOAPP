import express from 'express';
import { 
  sendSignupOtp, 
  verifySignupOtp, 
  resendOtp, 
  login, 
  getMe, 
  updateProfile 
} from '../controllers/authController.js';
import { optionalAuth, protect } from '../middleware/authMiddleware.js';
import { otpDispatchLimiter, authAttemptLimiter, sanitizeInputData } from '../middleware/securityMiddleware.js';

const router = express.Router();

// Apply sanitization to all auth routes
router.use(sanitizeInputData);

// OTP Signup Flow (Protected against spam & brute force)
router.post('/send-signup-otp', otpDispatchLimiter, sendSignupOtp);
router.post('/verify-signup-otp', authAttemptLimiter, verifySignupOtp);
router.post('/resend-otp', otpDispatchLimiter, resendOtp);

// Standard Login (Protected against brute force)
router.post('/login', authAttemptLimiter, login);

// Protected User endpoints
router.get('/me', optionalAuth, getMe);
router.put('/profile', protect, updateProfile);

export default router;
