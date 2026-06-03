import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route Imports
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

// Load environment variables
dotenv.config();

// Connect to Cloud Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows our server to read JSON bodies from requests

// Base API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Simple Health Check Route
app.get('/', (req, res) => {
  res.send('E-Commerce Backend API Engine is Running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});