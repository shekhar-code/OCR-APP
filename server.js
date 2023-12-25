// server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ocrapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create OCR schema and model
const ocrSchema = new mongoose.Schema({
  result: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['success', 'failure'], required: true },
  error: { type: String },
});

const OCR = mongoose.model('OCR', ocrSchema);

// Express middleware for parsing JSON
app.use(express.json());

// API endpoints
app.post('/api/ocr', upload.single('idCard'), async (req, res) => {
  try {
    // Implement OCR processing logic here (you may use Google Vision API, Tesseract, etc.)
    // For simplicity, just reading the uploaded file as a string
    const result = req.file.buffer.toString();
    
    // Save OCR result to the database
    const newOCR = new OCR({
      result: result,
      status: 'success',
    });

    await newOCR.save();

    res.status(200).json({ success: true, result: newOCR });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/ocr', async (req, res) => {
  try {
    const ocrRecords = await OCR.find();
    res.status(200).json({ success: true, data: ocrRecords });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
