const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password, phone });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Login user & return JWT
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Fetch user with password field (select: false by default)
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone || '',
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update logged-in user profile (name, phone, password)
// @route   PUT /api/auth/profile
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Update allowed fields
  if (req.body.name) user.name = req.body.name;
  if (req.body.phone !== undefined) user.phone = req.body.phone;

  // Password change — require current password confirmation
  if (req.body.newPassword) {
    if (!req.body.currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is required to set a new password',
      });
    }
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = req.body.newPassword;
  }

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all users (admin)
// @route   GET /api/auth/users
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a user (admin)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
  }
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted successfully' });
});

module.exports = { register, login, getMe, updateProfile, getAllUsers, deleteUser };
