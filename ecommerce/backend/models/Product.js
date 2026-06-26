// models/Product.js
// Mongoose schema/model for a Product document

const mongoose = require("mongoose");

// Define the structure (schema) of a Product document in MongoDB
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"],
  },
  image: {
    type: String,
    required: [true, "Product image URL is required"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set when product is created
  },
});

// Create and export the Product model based on the schema
// Mongoose will create a "products" collection in MongoDB
module.exports = mongoose.model("Product", productSchema);
