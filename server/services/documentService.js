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

  // Check if this is a greeting
  const greetingKeywords = ['hallo', 'hello', 'hi', 'hey', 'goedemorgen', 'goedemiddag', 'goedenavond', 'goededag'];
  const isGreeting = greetingKeywords.some(greeting => queryLower.trim() === greeting || queryLower.trim().startsWith(greeting + ' ') || queryLower.trim().endsWith(' ' + greeting));

  // For greetings, return a special indicator
  if (isGreeting) {
    return [{ filename: 'GREETING', content: '', type: 'greeting' }];
  }

  // Define business domain keywords that indicate the query is related to 21Qubz/21south
  const businessKeywords = [
    // Core business terms
    '21qubz', '21south', 'afval', 'afvalinzameling', 'klant', 'klanten', 'relatie', 'relaties',
    'contract', 'contracten', 'overeenkomst', 'personeel', 'medewerker', 'planning', 'plannen',
    'plaatsing', 'plaatsingen', 'order', 'orders', 'factuur', 'facturatie', 'wetgeving',
    'afvalstroom', 'afvalstromen', 'beheer', 'erp', 'systeem',
    // Action terms in business context
    'aanmaken', 'toevoegen', 'creëren', 'nieuwe', 'bewerken', 'wijzigen', 'verwijderen',
    'inloggen', 'gebruiker', 'toegang', 'rechten', 'rol', 'rollen'
  ];

  // Check if query contains any business-related terms
  const hasBusinessContext = businessKeywords.some(keyword => queryLower.includes(keyword));

  // If no business context is found, return empty results
  if (!hasBusinessContext) {
    return [];
  }

  // Define synonym mappings for better search
  const synonyms = {
    'klant': ['klanten', 'klant', 'relatie', 'relaties', 'customer'],
    'maken': ['toevoegen', 'aanmaken', 'creëren', 'nieuwe', 'plus', 'plusje'],
    'contract': ['contracten', 'overeenkomst', 'overeenkomsten'],
    'afvalstroom': ['afvalstromen', 'afvalstroommen', 'afval'],
    'personeel': ['medewerker', 'medewerkers', 'werknemers'],
    'planning': ['plannen', 'plannings', 'inplannen'],
    'plaatsing': ['plaatsingen', 'historische plaatsingen', 'lopende plaatsingen']
  };

  // Expand query with synonyms
  let searchTerms = [queryLower];
  for (const [key, values] of Object.entries(synonyms)) {
    if (queryLower.includes(key) || values.some(synonym => queryLower.includes(synonym))) {
      searchTerms.push(...values);
      searchTerms.push(key);
    }
  }

  // Check if this is a navigation question with business context
  const navigationKeywords = ['waar', 'hoe', 'maken', 'toevoegen', 'vinden', 'navigeren', 'contract', 'afvalstroom', 'gaan naar', 'plusje', 'nieuwe', 'klant', 'aanmaken', 'creëren'];
  const isNavigationQuery = navigationKeywords.some(keyword => queryLower.includes(keyword));
  
  // Search with expanded terms
  let results = documentStore.filter(doc => {
    const contentLower = doc.content.toLowerCase();
    return searchTerms.some(term => contentLower.includes(term));
  }).map(doc => ({
    filename: doc.filename,
    content: doc.content.substring(0, 500),
    type: doc.type
  }));
  
  // Prioritize specific Layout files based on query content
  if (isNavigationQuery) {
    const queryPriorities = {
      'klant': 'Layout/relaties.txt',
      'relatie': 'Layout/relaties.txt',
      'contract': 'Layout/contract-management.txt',
      'personeel': 'Layout/personeel.txt',
      'planning': 'Layout/planningen.txt',
      'plaatsing': 'Layout/plaatsingen.txt',
      'order': 'Layout/orders.txt',
      'factuur': 'Layout/facturatie.txt',
      'wetgeving': 'Layout/wetgeving.txt',
      'afvalstroom': 'Layout/wetgeving.txt',
      'beheer': 'Layout/beheer.txt'
    };
    
    // Find the most relevant Layout file
    let priorityFile = null;
    for (const [keyword, filename] of Object.entries(queryPriorities)) {
      if (queryLower.includes(keyword)) {
        priorityFile = filename;
        break;
      }
    }
    
    // Add priority file first if found
    if (priorityFile) {
      const priorityDoc = documentStore.find(doc => doc.filename === priorityFile);
      if (priorityDoc && !results.some(doc => doc.filename === priorityFile)) {
        results.unshift({
          filename: priorityDoc.filename,
          content: priorityDoc.content,
          type: priorityDoc.type
        });
      }
    }
    
    // Add other Layout files
    const layoutDocs = documentStore.filter(doc => 
      doc.filename.startsWith('Layout/') && doc.filename !== priorityFile
    );
    layoutDocs.forEach(layoutDoc => {
      if (!results.some(doc => doc.filename === layoutDoc.filename)) {
        results.push({
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