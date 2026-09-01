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

const router = express.Router();

// OTP Signup Flow
router.post('/send-signup-otp', sendSignupOtp);
router.post('/verify-signup-otp', verifySignupOtp);
router.post('/resend-otp', resendOtp);

// Standard Login
router.post('/login', login);

// Protected User endpoints
router.get('/me', optionalAuth, getMe);
router.put('/profile', protect, updateProfile);

export default router;
