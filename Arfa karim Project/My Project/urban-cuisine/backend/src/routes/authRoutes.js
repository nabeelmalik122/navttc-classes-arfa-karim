const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  getAllUsers,
  deleteUser,
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

// ── Validation rule sets ──────────────────────────────────────────────────────

const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 60 }).withMessage('Name cannot exceed 60 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Please provide a valid phone number'),
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

const updateProfileRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 60 }).withMessage('Name must be 1–60 characters'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Please provide a valid phone number'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

// ── Public routes ─────────────────────────────────────────────────────────────

// POST /api/auth/register
router.post('/register', registerRules, validate, register);

// POST /api/auth/login
router.post('/login', loginRules, validate, login);

// ── Protected routes ──────────────────────────────────────────────────────────

// GET  /api/auth/me
router.get('/me', protect, getMe);

// PUT  /api/auth/profile
router.put('/profile', protect, updateProfileRules, validate, updateProfile);

// ── Admin routes ──────────────────────────────────────────────────────────────

// GET    /api/auth/users
router.get('/users', protect, adminOnly, getAllUsers);

// DELETE /api/auth/users/:id
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
