import express from 'express';
import jwt from 'jsonwebtoken';
import Cart from '../models/Cart.js';

const router = express.Router();

// Middleware inline function to verify session tokens before executing cart actions
const protect = (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith('Bearer')) {
    try {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id; // Assign parsed user identity straight to the request pipeline
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Session expired or invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Access denied, no security token provided' });
  }
};

// Fetch individual user's active shopping cart items
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
    if (!cart) {
      cart = await Cart.create({ userId: req.userId, items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Append an item straight into the authenticated user's cart array
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      cart = await Cart.create({ userId: req.userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity; // Increment volume tracking if item exists
      } else {
        cart.items.push({ productId, quantity });
      }
      await cart.save();
    }
    res.status(200).json({ message: 'Product added to cart safely!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;