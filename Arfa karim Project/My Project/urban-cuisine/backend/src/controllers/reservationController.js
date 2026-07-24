const Reservation = require('../models/Reservation');
const asyncHandler = require('../utils/asyncHandler');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a reservation (guest or logged-in user)
// @route   POST /api/reservations
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const createReservation = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  // Attach logged-in user if present
  if (req.user) {
    payload.user = req.user._id;
  }

  // Prevent reservations in the past
  const reservationDate = new Date(payload.date);
  if (reservationDate < new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Reservation date must be in the future',
    });
  }

  const reservation = await Reservation.create(payload);

  res.status(201).json({
    success: true,
    message: 'Reservation submitted successfully. We will confirm shortly.',
    data: reservation,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get current user's reservations
// @route   GET /api/reservations/my
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id }).sort({ date: -1 });
  res.json({ success: true, count: reservations.length, data: reservations });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Cancel a reservation (owner only)
// @route   PUT /api/reservations/:id/cancel
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ success: false, message: 'Reservation not found' });
  }

  // Verify ownership (or admin)
  if (
    reservation.user?.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  if (reservation.status === 'cancelled') {
    return res.status(400).json({ success: false, message: 'Reservation already cancelled' });
  }

  reservation.status = 'cancelled';
  await reservation.save();

  res.json({ success: true, message: 'Reservation cancelled', data: reservation });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all reservations (admin)
// @route   GET /api/reservations
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const getAllReservations = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.date) {
    const day = new Date(req.query.date);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    filter.date = { $gte: day, $lt: nextDay };
  }

  const reservations = await Reservation.find(filter)
    .populate('user', 'name email')
    .sort({ date: 1, time: 1 });

  res.json({ success: true, count: reservations.length, data: reservations });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update reservation status (admin)
// @route   PUT /api/reservations/:id/status
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateReservationStatus = asyncHandler(async (req, res) => {
  const { status, tableNumber } = req.body;

  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    return res.status(404).json({ success: false, message: 'Reservation not found' });
  }

  reservation.status = status || reservation.status;
  if (tableNumber !== undefined) reservation.tableNumber = tableNumber;

  await reservation.save();

  res.json({ success: true, message: 'Reservation updated', data: reservation });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a reservation (admin)
// @route   DELETE /api/reservations/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByIdAndDelete(req.params.id);
  if (!reservation) {
    return res.status(404).json({ success: false, message: 'Reservation not found' });
  }
  res.json({ success: true, message: 'Reservation deleted' });
});

module.exports = {
  createReservation,
  getMyReservations,
  cancelReservation,
  getAllReservations,
  updateReservationStatus,
  deleteReservation,
};
