const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const {
  createReservation,
  getMyReservations,
  cancelReservation,
  getAllReservations,
  updateReservationStatus,
  deleteReservation,
} = require('../controllers/reservationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

// ── Validation rules ──────────────────────────────────────────────────────────

const reservationRules = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 60 }).withMessage('Name cannot exceed 60 characters'),
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('date').notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid ISO date'),
  body('time').notEmpty().withMessage('Time is required'),
  body('guests').isInt({ min: 1, max: 20 })
    .withMessage('Guests must be between 1 and 20'),
  body('occasion')
    .optional()
    .isIn(['none', 'birthday', 'anniversary', 'business', 'date', 'other'])
    .withMessage('Invalid occasion'),
  body('specialRequests').optional().isLength({ max: 400 })
    .withMessage('Special requests cannot exceed 400 characters'),
];

const statusRules = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid status'),
];

const idRule = [param('id').isMongoId().withMessage('Invalid reservation ID')];

// ── Public routes ─────────────────────────────────────────────────────────────

// POST /api/reservations  (optionally authenticated — attaches user if token present)
router.post('/', reservationRules, validate, (req, res, next) => {
  // Try to decode token but don't block if absent
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    try {
      const decoded = jwt.verify(
        authHeader.split(' ')[1],
        process.env.JWT_SECRET
      );
      User.findById(decoded.id)
        .select('-password')
        .then((user) => {
          if (user) req.user = user;
          next();
        })
        .catch(() => next());
    } catch {
      next();
    }
  } else {
    next();
  }
}, createReservation);

// ── Authenticated user routes ─────────────────────────────────────────────────

// GET /api/reservations/my
router.get('/my', protect, getMyReservations);

// PUT /api/reservations/:id/cancel
router.put('/:id/cancel', protect, idRule, validate, cancelReservation);

// ── Admin routes ──────────────────────────────────────────────────────────────

// GET    /api/reservations              ?status= &date=
router.get('/', protect, adminOnly, getAllReservations);

// PUT    /api/reservations/:id/status
router.put('/:id/status', protect, adminOnly, idRule, statusRules, validate, updateReservationStatus);

// DELETE /api/reservations/:id
router.delete('/:id', protect, adminOnly, idRule, validate, deleteReservation);

module.exports = router;
