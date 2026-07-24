const MenuItem = require('../models/MenuItem');
const asyncHandler = require('../utils/asyncHandler');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all available menu items (with optional category filter)
// @route   GET /api/menu
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getMenuItems = asyncHandler(async (req, res) => {
  const filter = { isAvailable: true };

  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.featured === 'true') {
    filter.isFeatured = true;
  }
  if (req.query.vegetarian === 'true') {
    filter.isVegetarian = true;
  }

  const items = await MenuItem.find(filter).sort({ sortOrder: 1, createdAt: -1 });

  res.json({ success: true, count: items.length, data: items });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get single menu item by id
// @route   GET /api/menu/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getMenuItemById = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }
  res.json({ success: true, data: item });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a new menu item
// @route   POST /api/menu
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const createMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.status(201).json({ success: true, message: 'Menu item created', data: item });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }
  res.json({ success: true, message: 'Menu item updated', data: item });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }
  res.json({ success: true, message: 'Menu item deleted' });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all menu items including unavailable (admin view)
// @route   GET /api/menu/admin/all
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const getAllMenuItemsAdmin = asyncHandler(async (req, res) => {
  const items = await MenuItem.find({}).sort({ category: 1, sortOrder: 1 });
  res.json({ success: true, count: items.length, data: items });
});

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItemsAdmin,
};
