const { getGeminiModel } = require('../config/gemini');
const { searchDocuments } = require('./documentService');

const generateChatResponse = async (message) => {
  const relevantDocs = searchDocuments(message);
  
  let context = '';
  if (relevantDocs.length > 0) {
    context = `\n\nRelevant documents:\n${relevantDocs.map(doc => 
      `${doc.filename}: ${doc.content}`
    ).join('\n\n')}`;
  }

  const model = getGeminiModel();
  
  const prompt = `Answer this question: ${message}${context}

Please provide a helpful response based on the question${relevantDocs.length > 0 ? ' and the relevant document content provided' : ''}.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return {
    response: text,
    sources: relevantDocs.map(doc => doc.filename)
  };
};

module.exports = { generateChatResponse };