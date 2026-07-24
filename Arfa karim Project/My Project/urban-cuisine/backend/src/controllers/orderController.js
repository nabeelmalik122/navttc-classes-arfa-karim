const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const asyncHandler = require('../utils/asyncHandler');

const TAX_RATE = 0.08; // 8%

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create an order
// @route   POST /api/orders
// @access  Public (guest or logged-in)
// ─────────────────────────────────────────────────────────────────────────────
const createOrder = asyncHandler(async (req, res) => {
  const { items, type, deliveryAddress, notes, guestName, guestEmail } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
  }

  // Resolve menu items and build order lines
  const orderItems = [];
  let subtotal = 0;

  for (const line of items) {
    const menuItem = await MenuItem.findById(line.menuItem);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: `Menu item not found: ${line.menuItem}`,
      });
    }
    if (!menuItem.isAvailable) {
      return res.status(400).json({
        success: false,
        message: `"${menuItem.name}" is currently unavailable`,
      });
    }

    const qty = Math.max(1, parseInt(line.quantity) || 1);
    subtotal += menuItem.price * qty;

    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: qty,
    });
  }

  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));

  const payload = {
    items: orderItems,
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax,
    total,
    type: type || 'dine-in',
    notes,
  };

  if (req.user) {
    payload.user = req.user._id;
  } else {
    payload.guestName = guestName;
    payload.guestEmail = guestEmail;
  }

  if (type === 'delivery' && deliveryAddress) {
    payload.deliveryAddress = deliveryAddress;
  }

  const order = await Order.create(payload);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: order,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get current user's orders
// @route   GET /api/orders/my
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get single order by id
// @route   GET /api/orders/:id
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Allow owner or admin
  if (order.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  res.json({ success: true, data: order });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const getAllOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;

  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: orders.length, data: orders });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  await order.save();

  res.json({ success: true, message: 'Order updated', data: order });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get dashboard summary stats (admin)
// @route   GET /api/orders/stats
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const getOrderStats = asyncHandler(async (req, res) => {
  const [totalOrders, revenue, pending, byType] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments({ status: 'pending' }),
    Order.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      totalOrders,
      totalRevenue: revenue[0]?.total || 0,
      pendingOrders: pending,
      ordersByType: byType,
    },
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
};
