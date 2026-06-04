import express from 'express';
import multer from 'multer';

const router = express.Router();

// Configure where to store files and what to name them
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to make sure only images are allowed
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// FIX HERE: Changed parameter from (req, file) to (req, res)
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return the URL of the saved image to the frontend
    res.status(201).json({
      message: 'Image uploaded successfully!',
      imageUrl: `http://localhost:5000/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;