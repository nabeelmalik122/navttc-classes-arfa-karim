const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/users
// @desc    Create a new user
router.post('/', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    // Create a new user instance and save it to the database
    const user = await User.create({ name, email, age });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/users
// @desc    Get all users
router.get('/', async (req, res) => {
  try {
    // Find all users in the database
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get a user by ID
router.get('/:id', async (req, res) => {
  try {
    // Find a user by their unique ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/:id
// @desc    Update a user by ID
router.put('/:id', async (req, res) => {
  try {
    // Find the user by ID and update with the data from the request body
    // { new: true } returns the updated document, runValidators ensures schema validation
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    // Find the user by ID and delete them
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
