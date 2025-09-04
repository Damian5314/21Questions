const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

let documentStore = [];

const initializeDocuments = async () => {
  const docsDir = path.join(__dirname, '../../docs');
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
};

const searchDocuments = (query) => {
  const queryLower = query.toLowerCase();
  const results = documentStore.filter(doc => 
    doc.content.toLowerCase().includes(queryLower)
  ).map(doc => ({
    filename: doc.filename,
    content: doc.content.substring(0, 500),
    type: doc.type
  }));
  return results.slice(0, 3);
};

const addDocument = (filename, content, type) => {
  documentStore.push({
    filename: filename,
    content: content,
    type: type
  });
};

const getDocuments = () => {
  return documentStore.map(doc => ({
    filename: doc.filename,
    type: doc.type,
    preview: doc.content.substring(0, 100)
  }));
};

module.exports = {
  initializeDocuments,
  searchDocuments,
  addDocument,
  getDocuments
};