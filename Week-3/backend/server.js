import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // 1. Import the cors package
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import path from 'path';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();
const app = express();

connectDB();

// 2. Enable CORS so your React frontend (port 5173) can talk to your backend
app.use(cors()); 

app.use(express.json());
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => res.send("Week 2 Backend System Engine Active!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));