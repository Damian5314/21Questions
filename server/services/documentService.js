const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

let documentStore = [];

const loadDocumentsFromDir = async (dirPath, prefix = '') => {
  if (!fs.existsSync(dirPath)) return;
  
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively load from subdirectories
      await loadDocumentsFromDir(itemPath, prefix ? `${prefix}/${item}` : item);
    } else if (item.endsWith('.txt')) {
      const content = fs.readFileSync(itemPath, 'utf8');
      documentStore.push({
        filename: prefix ? `${prefix}/${item}` : item,
        content: content,
        type: 'text'
      });
    } else if (item.endsWith('.pdf')) {
      try {
        const buffer = fs.readFileSync(itemPath);
        const data = await pdfParse(buffer);
        documentStore.push({
          filename: prefix ? `${prefix}/${item}` : item,
          content: data.text,
          type: 'pdf'
        });
      } catch (error) {
        console.error(`Error parsing PDF ${item}:`, error);
      }
    } else if (item.endsWith('.docx')) {
      try {
        const buffer = fs.readFileSync(itemPath);
        const result = await mammoth.extractRawText({ buffer: buffer });
        documentStore.push({
          filename: prefix ? `${prefix}/${item}` : item,
          content: result.value,
          type: 'docx'
        });
      } catch (error) {
        console.error(`Error parsing DOCX ${item}:`, error);
      }
    }
  }
};

const initializeDocuments = async () => {
  const docsDir = path.join(__dirname, '../../docs');
  await loadDocumentsFromDir(docsDir);
  console.log(`Loaded ${documentStore.length} documents`);
};

const searchDocuments = (query) => {
  const queryLower = query.toLowerCase();
  
  // Check if this is a navigation question
  const navigationKeywords = ['waar', 'hoe', 'maken', 'toevoegen', 'vinden', 'navigeren', 'contract', 'afvalstroom', 'gaan naar', 'plusje', 'nieuwe'];
  const isNavigationQuery = navigationKeywords.some(keyword => queryLower.includes(keyword));
  
  let results = documentStore.filter(doc => 
    doc.content.toLowerCase().includes(queryLower)
  ).map(doc => ({
    filename: doc.filename,
    content: doc.content.substring(0, 500),
    type: doc.type
  }));
  
  // Always include Layout files for navigation queries
  if (isNavigationQuery) {
    const layoutDocs = documentStore.filter(doc => 
      doc.filename.startsWith('Layout/')
    );
    layoutDocs.forEach(layoutDoc => {
      if (!results.some(doc => doc.filename === layoutDoc.filename)) {
        results.unshift({
          filename: layoutDoc.filename,
          content: layoutDoc.content,
          type: layoutDoc.type
        });
      }
    });
  }
  
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