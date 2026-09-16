const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize the Express application
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Define Routes
app.use('/api/users', userRoutes);

// Basic route for testing the server
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Define the port (default to 5000 if not specified in .env)
const PORT = process.env.PORT || 5000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
