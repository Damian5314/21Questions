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

  // Check if this is a greeting
  const isGreeting = relevantDocs.length === 1 && relevantDocs[0].filename === 'GREETING';

  const prompt = `Je bent een AI-assistent voor 21Qubz en 21south.

Vraag: ${message}${context}

INSTRUCTIES:
BELANGRIJK: Als er gevraagd wordt waar je iets kunt maken, toevoegen, vinden, of navigeren in het systeem, raadpleeg dan eerst de navigatiepaden in de Layout bestanden (zoals Layout/relaties.txt, Layout/contract-management.txt, enz.) voor de juiste stappen.
${isGreeting
  ? '- Dit is een begroeting. Beantwoord vriendelijk met een begroeting terug en stel je kort voor als AI-assistent voor 21Qubz en 21south. Vraag hoe je kunt helpen met vragen over de diensten of processen.'
  : relevantDocs.length > 0
  ? '- Er zijn relevante documenten gevonden, dus beantwoord de vraag in het Nederlands gebaseerd op deze documentinformatie.'
  : '- Er zijn geen relevante documenten gevonden. Dit betekent dat de vraag NIET gerelateerd is aan 21Qubz, 21south, afvalinzameling, ERP-systemen of gerelateerde onderwerpen. Antwoord ALTIJD met: "Sorry, ik kan alleen vragen beantwoorden die gerelateerd zijn aan 21Qubz en 21south. Heb je vragen over onze diensten of processen?"'
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