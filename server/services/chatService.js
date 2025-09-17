const { getGroqModel } = require('../config/groq');
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

  const groq = getGroqModel();

  const prompt = `Je bent een AI-assistent voor 21Qubz en 21south.

Vraag: ${message}${context}

INSTRUCTIES:
BELANGRIJK: Als er gevraagd wordt waar je iets kunt maken, toevoegen, vinden, of navigeren in het systeem, raadpleeg dan eerst de navigatiepaden in de Layout bestanden (zoals Layout/relaties.txt, Layout/contract-management.txt, enz.) voor de juiste stappen.
${relevantDocs.length > 0
  ? '- Er zijn relevante documenten gevonden, dus beantwoord de vraag in het Nederlands gebaseerd op deze documentinformatie.'
  : '- Als de vraag gerelateerd is aan 21Qubz, 21south, afvalinzameling, ERP-systemen of gerelateerde onderwerpen, beantwoord dan in het Nederlands.\n- Als de vraag NIET gerelateerd is aan deze onderwerpen, antwoord dan: "Sorry, ik kan alleen vragen beantwoorden die gerelateerd zijn aan 21Qubz en 21south. Heb je vragen over onze diensten of processen?"'
}`;

  const result = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.7,
    max_tokens: 1000
  });

  const text = result.choices[0]?.message?.content || '';

  return {
    response: text,
    sources: relevantDocs.map(doc => doc.filename)
  };
};

module.exports = { generateChatResponse };