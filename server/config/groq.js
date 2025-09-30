const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'your-api-key'
});

const getGroqModel = () => {
  return groq;
};

module.exports = { getGroqModel };