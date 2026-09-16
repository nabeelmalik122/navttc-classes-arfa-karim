const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true, // Ensure email addresses are unique in the database
    },
    age: {
      type: Number,
      required: [true, 'Please add an age'],
    },
  },
  {
    timestamps: true, // Automatically create 'createdAt' and 'updatedAt' fields
  }
);

// Create and export the model based on the schema
module.exports = mongoose.model('User', userSchema);
