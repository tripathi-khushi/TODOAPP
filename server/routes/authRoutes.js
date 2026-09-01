import express from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth endpoints
router.post('/register', register);
router.post('/signup', register);
router.post('/login', login);

// Protected user endpoints
router.get('/me', optionalAuth, getMe);
router.put('/profile', protect, updateProfile);

export default router;
