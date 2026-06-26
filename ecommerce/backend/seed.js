// seed.js
// Run this script once (node seed.js) to populate the database
// with sample electronics products for TechStore.

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

// Sample electronics product data
const sampleProducts = [
  {
    name: "Apple iPhone 15",
    price: 79999,
    image: "https://images.unsplash.com/photo-1697284960036-1f74f8aa1f1a?w=500",
    description: "6.1-inch Super Retina display, A16 Bionic chip, 128GB storage, dual-camera system.",
    category: "Mobiles",
  },
  {
    name: "Samsung Galaxy S24",
    price: 69999,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
    description: "Dynamic AMOLED 2X display, Snapdragon 8 Gen 3, AI-powered camera features.",
    category: "Mobiles",
  },
  {
    name: "Dell XPS 13 Laptop",
    price: 109999,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
    description: "13.4-inch FHD+ display, Intel Core i7, 16GB RAM, 512GB SSD, ultra-portable design.",
    category: "Laptops",
  },
  {
    name: "ASUS ROG Gaming Laptop",
    price: 149999,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
    description: "15.6-inch 144Hz display, RTX 4060 GPU, AMD Ryzen 9, 16GB RAM, RGB keyboard.",
    category: "Laptops",
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    price: 29999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    description: "Industry-leading noise cancellation, 30-hour battery life, premium sound quality.",
    category: "Accessories",
  },
  {
    name: "Apple Watch Series 9",
    price: 41999,
    image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500",
    description: "Always-On Retina display, advanced health sensors, GPS, water resistant.",
    category: "Wearables",
  },
  {
    name: "Logitech MX Master 3S Mouse",
    price: 8999,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    description: "8K DPI sensor, quiet clicks, ergonomic design, multi-device connectivity.",
    category: "Accessories",
  },
  {
    name: "Samsung 55-inch QLED TV",
    price: 64999,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500",
    description: "4K QLED display, Quantum HDR, smart TV with built-in streaming apps.",
    category: "Electronics",
  },
  {
    name: "iPad Air (5th Gen)",
    price: 54999,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
    description: "10.9-inch Liquid Retina display, M1 chip, all-day battery life, Apple Pencil support.",
    category: "Tablets",
  },
  {
    name: "JBL Flip 6 Bluetooth Speaker",
    price: 9999,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e750?w=500",
    description: "Portable waterproof speaker, punchy JBL sound, 12-hour playtime.",
    category: "Accessories",
  },
  {
    name: "Canon EOS R10 Camera",
    price: 89999,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
    description: "24.2MP APS-C sensor, 4K video recording, fast autofocus, lightweight mirrorless body.",
    category: "Electronics",
  },
  {
    name: "Anker 10000mAh Power Bank",
    price: 2499,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500",
    description: "Fast charging power bank, compact design, compatible with phones and tablets.",
    category: "Accessories",
  },
];

// Connect to MongoDB and insert sample data
const seedDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce"
    );
    console.log("MongoDB Connected for seeding...");

    // Clear existing products to avoid duplicates
    await Product.deleteMany();
    console.log("Existing products removed.");

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} sample products added successfully!`);

    process.exit(0); // Exit script successfully
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();
