const Contact = require('../models/Contact');
const asyncHandler = require('../utils/asyncHandler');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const contact = await Contact.create({ name, email, phone, subject, message });

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out! We will get back to you within 24 hours.',
    data: { _id: contact._id },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all contact messages (admin)
// @route   GET /api/contact
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const getAllContacts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.unread === 'true') filter.isRead = false;

  const contacts = await Contact.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: contacts.length, data: contacts });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get single contact message (admin)
// @route   GET /api/contact/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  // Auto-mark as read on open
  if (!contact.isRead) {
    contact.isRead = true;
    await contact.save();
  }

  res.json({ success: true, data: contact });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Mark contact as read / replied (admin)
// @route   PUT /api/contact/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  if (req.body.isRead !== undefined) contact.isRead = req.body.isRead;
  if (req.body.replied) contact.repliedAt = new Date();

  await contact.save();

  res.json({ success: true, message: 'Contact updated', data: contact });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a contact message (admin)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }
  res.json({ success: true, message: 'Message deleted' });
});

module.exports = {
  submitContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
