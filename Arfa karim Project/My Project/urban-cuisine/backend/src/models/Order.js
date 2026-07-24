const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    guestName: { type: String, trim: true },
    guestEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Order must contain at least one item',
      },
    },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      enum: ['dine-in', 'takeaway', 'delivery'],
      default: 'dine-in',
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'],
      default: 'pending',
    },
    deliveryAddress: {
      street: String,
      city: String,
      zip: String,
    },
    notes: {
      type: String,
      maxlength: [300, 'Notes cannot exceed 300 characters'],
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
  },
  { timestamps: true }
);

orderSchema.index({ status: 1 });
orderSchema.index({ user: 1 });

module.exports = mongoose.model('Order', orderSchema);
