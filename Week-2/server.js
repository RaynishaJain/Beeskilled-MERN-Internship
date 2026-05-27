import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';

dotenv.config();
const app = express();

// Run the MongoDB initialization process
connectDB();

// Middleware to cleanly parse raw incoming JSON objects
app.use(express.json());

// Main App Endpoint Mounting
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => res.send("Week 2 Backend System Engine Active!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));