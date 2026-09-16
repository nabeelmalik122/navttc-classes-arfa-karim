const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables reliably from backend/.env
dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");

// Connect to MongoDB Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
app.use("/users", userRoutes); // Support both /api/users and /users

// Root Test Route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "🚀 Backend server is up and running successfully!",
    endpoints: {
      getAllUsers: "GET /api/users",
      getUserById: "GET /api/users/:id",
      createUser: "POST /api/users",
      updateUser: "PUT /api/users/:id",
      deleteUser: "DELETE /api/users/:id"
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (http://localhost:${PORT})`);
});
