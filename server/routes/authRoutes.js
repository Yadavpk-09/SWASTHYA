import express from 'express';
import {
  register,
  login,
  demoLogin,
  googleAuth,
  getMe,
  updateProfile,
  adminLogin,
  adminRegister,
  adminGoogleAuth,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// User auth endpoints
router.post('/register', register);
router.post('/login', login);
router.post('/demo-login', demoLogin);
router.post('/google', googleAuth);
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, updateProfile);

// Password recovery endpoints (applicable for both User and Admin)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Admin dedicated auth endpoints (Module 1 - FR1.1-1.7)
router.post('/admin/login', adminLogin);
router.post('/admin/register', adminRegister);
router.post('/admin/google', adminGoogleAuth);

export default router;
