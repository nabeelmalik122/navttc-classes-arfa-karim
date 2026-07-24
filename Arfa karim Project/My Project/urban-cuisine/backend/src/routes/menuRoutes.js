const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItemsAdmin,
} = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

// ── Validation rules ──────────────────────────────────────────────────────────

const menuItemRules = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['starters', 'mains', 'desserts', 'drinks', 'specials'])
    .withMessage('Invalid category'),
  body('image').trim().notEmpty().withMessage('Image URL is required').isURL().withMessage('Must be a valid URL'),
];

const idRule = [
  param('id').isMongoId().withMessage('Invalid item ID'),
];

// ── Public routes ─────────────────────────────────────────────────────────────

// GET  /api/menu          — list (filter: ?category= &featured= &vegetarian=)
router.get('/', getMenuItems);

// GET  /api/menu/admin/all — must come BEFORE /:id to avoid route shadowing
router.get('/admin/all', protect, adminOnly, getAllMenuItemsAdmin);

// GET  /api/menu/:id
router.get('/:id', idRule, validate, getMenuItemById);

// ── Admin routes ──────────────────────────────────────────────────────────────

// POST   /api/menu
router.post('/', protect, adminOnly, menuItemRules, validate, createMenuItem);

// PUT    /api/menu/:id
router.put('/:id', protect, adminOnly, idRule, validate, updateMenuItem);

// DELETE /api/menu/:id
router.delete('/:id', protect, adminOnly, idRule, validate, deleteMenuItem);

module.exports = router;
