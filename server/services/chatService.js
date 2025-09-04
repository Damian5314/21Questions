const { getGeminiModel } = require('../config/gemini');
const { searchDocuments } = require('./documentService');

const generateChatResponse = async (message) => {
  const relevantDocs = searchDocuments(message);
  
  console.log(`Searching for: "${message}"`);
  console.log(`Found ${relevantDocs.length} relevant documents:`, relevantDocs.map(doc => doc.filename));
  
  let context = '';
  if (relevantDocs.length > 0) {
    context = `\n\nRelevant documents:\n${relevantDocs.map(doc => 
      `${doc.filename}: ${doc.content}`
    ).join('\n\n')}`;
  }

  const model = getGeminiModel();
  
  const prompt = `Je bent een AI-assistent voor 21Qubz en 21south. 

Vraag: ${message}${context}

INSTRUCTIES:
${relevantDocs.length > 0 
  ? '- Er zijn relevante documenten gevonden, dus beantwoord de vraag in het Nederlands gebaseerd op deze documentinformatie.' 
  : '- Als de vraag gerelateerd is aan 21Qubz, 21south, afvalinzameling, ERP-systemen of gerelateerde onderwerpen, beantwoord dan in het Nederlands.\n- Als de vraag NIET gerelateerd is aan deze onderwerpen, antwoord dan: "Sorry, ik kan alleen vragen beantwoorden die gerelateerd zijn aan 21Qubz en 21south. Heb je vragen over onze diensten of processen?"'
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return {
    response: text,
    sources: relevantDocs.map(doc => doc.filename)
  };
};

module.exports = { generateChatResponse };