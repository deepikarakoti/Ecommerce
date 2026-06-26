// server.js
// Main entry point of the backend application

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ---------- Middleware ----------
app.use(cors()); // Allow cross-origin requests (frontend <-> backend)
app.use(express.json()); // Parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form data

// (Optional) Serve the frontend folder as static files,
// so you can open the whole app from http://localhost:5000 as well.
app.use(express.static(path.join(__dirname, "../frontend")));

// ---------- API Routes ----------
app.use("/api/products", productRoutes);

// Simple health-check route
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running fine" });
});

// ---------- 404 Handler for unknown API routes ----------
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// ---------- Global Error Handler ----------
// Catches any errors passed via next(err) or thrown synchronously
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
