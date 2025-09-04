const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { addDocument } = require('../services/documentService');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const filename = req.file.originalname;
    
    let content = '';
    
    if (filename.endsWith('.pdf')) {
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      content = data.text;
    } else if (filename.endsWith('.txt')) {
      content = fs.readFileSync(filePath, 'utf8');
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Only PDF and TXT files are supported' });
    }

    addDocument(filename, content, filename.endsWith('.pdf') ? 'pdf' : 'text');
    fs.unlinkSync(filePath);

    res.json({ message: 'Document uploaded successfully' });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error processing upload' });
  }
});

module.exports = router;