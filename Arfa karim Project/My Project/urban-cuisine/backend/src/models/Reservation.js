const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // allow guest reservations
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Reservation date is required'],
    },
    time: {
      type: String,
      required: [true, 'Reservation time is required'],
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest is required'],
      max: [20, 'Maximum 20 guests per reservation'],
    },
    occasion: {
      type: String,
      enum: ['none', 'birthday', 'anniversary', 'business', 'date', 'other'],
      default: 'none',
    },
    specialRequests: {
      type: String,
      maxlength: [400, 'Special requests cannot exceed 400 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    tableNumber: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for admin dashboard queries
reservationSchema.index({ date: 1, status: 1 });
reservationSchema.index({ email: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
