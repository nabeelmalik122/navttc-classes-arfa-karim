const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

// ── Validation rules ──────────────────────────────────────────────────────────

const orderItemsRule = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.menuItem').notEmpty().withMessage('Menu item ID is required')
    .isMongoId().withMessage('Invalid menu item ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('type')
    .optional()
    .isIn(['dine-in', 'takeaway', 'delivery'])
    .withMessage('Invalid order type'),
];

const statusRule = [
  body('status')
    .optional()
    .isIn(['pending', 'preparing', 'ready', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('paymentStatus')
    .optional()
    .isIn(['unpaid', 'paid', 'refunded'])
    .withMessage('Invalid payment status'),
];

const idRule = [param('id').isMongoId().withMessage('Invalid order ID')];

// ── Admin stats route (before /:id to avoid shadowing) ────────────────────────

// GET /api/orders/stats
router.get('/stats', protect, adminOnly, getOrderStats);

// ── Public / guest routes ─────────────────────────────────────────────────────

// POST /api/orders
router.post('/', orderItemsRule, validate, (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
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
}, createOrder);

// ── Authenticated user routes ─────────────────────────────────────────────────

// GET /api/orders/my
router.get('/my', protect, getMyOrders);

// GET /api/orders/:id
router.get('/:id', protect, idRule, validate, getOrderById);

// ── Admin routes ──────────────────────────────────────────────────────────────

// GET    /api/orders           ?status= &type=
router.get('/', protect, adminOnly, getAllOrders);

// PUT    /api/orders/:id/status
router.put('/:id/status', protect, adminOnly, idRule, statusRule, validate, updateOrderStatus);

module.exports = router;
