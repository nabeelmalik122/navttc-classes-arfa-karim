const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const {
  submitContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

// ── Validation rules ──────────────────────────────────────────────────────────

const contactRules = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 60 }).withMessage('Name cannot exceed 60 characters'),
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('phone').optional().trim(),
  body('subject').trim().notEmpty().withMessage('Subject is required')
    .isLength({ max: 120 }).withMessage('Subject cannot exceed 120 characters'),
  body('message').trim().notEmpty().withMessage('Message is required')
    .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters'),
];

const idRule = [param('id').isMongoId().withMessage('Invalid message ID')];

// ── Public routes ─────────────────────────────────────────────────────────────

// POST /api/contact
router.post('/', contactRules, validate, submitContact);

// ── Admin routes ──────────────────────────────────────────────────────────────

// GET    /api/contact          ?unread=true
router.get('/', protect, adminOnly, getAllContacts);

// GET    /api/contact/:id
router.get('/:id', protect, adminOnly, idRule, validate, getContactById);

// PUT    /api/contact/:id
router.put('/:id', protect, adminOnly, idRule, validate, updateContact);

// DELETE /api/contact/:id
router.delete('/:id', protect, adminOnly, idRule, validate, deleteContact);

module.exports = router;
