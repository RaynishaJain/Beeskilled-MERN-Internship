import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Fetch all available store catalog items
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// FIXED: Changed from .post to .get so your web browser can execute it cleanly!
router.get('/seed', async (req, res) => {
  try {
    // FIXED: Force delete old data blocks first so it cleans out the database
    await Product.deleteMany({});

    const sampleProducts = [
      { name: 'Developer Mechanical Keyboard', description: 'RGB tactile switches optimal for clean coding layout blocks.', price: 99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', category: 'Electronics', countInStock: 10 },
      { name: 'Ergonomic Developer Chair', description: 'High-back mesh support intended for prolonged sprint sessions.', price: 249, image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500', category: 'Office', countInStock: 5 },
      { name: 'UltraWide Code Monitor', description: '34-inch curved display layout built to observe frontends side-by-side.', price: 399, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', category: 'Electronics', countInStock: 7 },
      { name: 'Wireless Precision Mouse', description: 'Lag-free tracking to accelerate canvas layout dragging operations.', price: 59, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500', category: 'Electronics', countInStock: 15 }
    ];

    await Product.insertMany(sampleProducts);
    res.status(201).json({ message: 'Catalog seeded successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;