// routes/productRoutes.js
// Defines REST API endpoints and maps them to controller functions

const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// GET /api/products       -> get all products (with optional ?search & ?category)
// POST /api/products      -> create a new product
router.route("/").get(getProducts).post(createProduct);

// GET /api/products/:id    -> get single product
// PUT /api/products/:id    -> update product
// DELETE /api/products/:id -> delete product
router
  .route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
