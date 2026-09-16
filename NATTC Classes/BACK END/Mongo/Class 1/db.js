const mongoose = require('mongoose');
require('dotenv').config(); // Ensure environment variables are loaded

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect to the database using the connection string from .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log the error and exit the process with failure if connection fails
    console.error(`Error: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;
