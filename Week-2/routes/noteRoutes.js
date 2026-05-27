import express from 'express';
import Note from '../models/Note.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
});

router.post('/', async (req, res) => {
    try {
        const newNote = await Note.create({ user: req.user.id, title: req.body.title, content: req.body.content });
        res.status(201).json(newNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNote);
});

router.delete('/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note removed successfully' });
});

export default router;