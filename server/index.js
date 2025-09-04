const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

let documentStore = [];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-api-key');

async function initializeDocuments() {
  const docsDir = path.join(__dirname, '../docs');
  if (fs.existsSync(docsDir)) {
    const files = fs.readdirSync(docsDir);
    for (const file of files) {
      const filePath = path.join(docsDir, file);
      if (file.endsWith('.txt')) {
        const content = fs.readFileSync(filePath, 'utf8');
        documentStore.push({
          filename: file,
          content: content,
          type: 'text'
        });
      } else if (file.endsWith('.pdf')) {
        try {
          const buffer = fs.readFileSync(filePath);
          const data = await pdfParse(buffer);
          documentStore.push({
            filename: file,
            content: data.text,
            type: 'pdf'
          });
        } catch (error) {
          console.error(`Error parsing PDF ${file}:`, error);
        }
      }
    }
  }
  console.log(`Loaded ${documentStore.length} documents`);
}

function searchDocuments(query) {
  const queryLower = query.toLowerCase();
  const results = documentStore.filter(doc => 
    doc.content.toLowerCase().includes(queryLower)
  ).map(doc => ({
    filename: doc.filename,
    content: doc.content.substring(0, 500),
    type: doc.type
  }));
  return results.slice(0, 3);
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const relevantDocs = searchDocuments(message);
    
    let context = '';
    if (relevantDocs.length > 0) {
      context = `\n\nRelevant documents:\n${relevantDocs.map(doc => 
        `${doc.filename}: ${doc.content}`
      ).join('\n\n')}`;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Answer this question: ${message}${context}

Please provide a helpful response based on the question${relevantDocs.length > 0 ? ' and the relevant document content provided' : ''}.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ 
      response: text,
      sources: relevantDocs.map(doc => doc.filename)
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/upload', upload.single('document'), async (req, res) => {
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

    documentStore.push({
      filename: filename,
      content: content,
      type: filename.endsWith('.pdf') ? 'pdf' : 'text'
    });

    fs.unlinkSync(filePath);

    res.json({ message: 'Document uploaded successfully' });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error processing upload' });
  }
});

app.get('/api/documents', (req, res) => {
  res.json(documentStore.map(doc => ({
    filename: doc.filename,
    type: doc.type,
    preview: doc.content.substring(0, 100)
  })));
});

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  await initializeDocuments();
});