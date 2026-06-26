// controllers/productController.js
// Contains the actual logic (Controller layer of MVC) for handling
// Product-related requests. Routes call these functions.

const Product = require("../models/Product");

// ------------------------------------------------------------------
// @desc    Get all products (supports optional search & category filter)
// @route   GET /api/products
// @access  Public
// Example:  GET /api/products?search=phone&category=Mobiles
// ------------------------------------------------------------------
const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    // Build a dynamic MongoDB query object
    let query = {};

    if (search) {
      // Case-insensitive search on product name or description
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    // Find matching products, newest first
    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch products",
      error: error.message,
    });
  }
};

// ------------------------------------------------------------------
// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
// ------------------------------------------------------------------
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    // Handles invalid ObjectId format as well as other errors
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch product",
      error: error.message,
    });
  }
};

// ------------------------------------------------------------------
// @desc    Create a new product
// @route   POST /api/products
// @access  Admin
// ------------------------------------------------------------------
const createProduct = async (req, res) => {
  try {
    const { name, price, image, description, category } = req.body;

    // Basic validation before hitting the database
    if (!name || !price || !image || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, price, image, description and category",
      });
    }

    const product = await Product.create({
      name,
      price,
      image,
      description,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to create product",
      error: error.message,
    });
  }
};

// ------------------------------------------------------------------
// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Admin
// ------------------------------------------------------------------
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // return the updated document
        runValidators: true, // re-run schema validation on update
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to update product",
      error: error.message,
    });
  }
};

// ------------------------------------------------------------------
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
// ------------------------------------------------------------------
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
