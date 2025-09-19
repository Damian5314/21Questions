const { getGroqModel } = require('../config/groq');
const { getGeminiModel } = require('../config/gemini');
const { searchDocuments } = require('./documentService');
const fs = require('fs').promises;
const path = require('path');

class AIBenchmarkService {
  constructor() {
    this.groqModel = getGroqModel();
    this.geminiModel = getGeminiModel();
    this.results = [];
  }

  async benchmarkProvider(provider, prompt, testName) {
    const startTime = Date.now();
    let response = null;
    let error = null;
    let tokenInfo = {};
    let relevantDocs = [];

    try {
      // Search for relevant documents (same as chatService)
      relevantDocs = searchDocuments(prompt);

      let context = '';
      if (relevantDocs.length > 0) {
        context = `\n\nRelevant documents:\n${relevantDocs.map(doc =>
          `${doc.filename}: ${doc.content}`
        ).join('\n\n')}`;
      }

      // Build the same prompt structure as chatService
      const fullPrompt = `Je bent een AI-assistent voor 21Qubz en 21south.

Vraag: ${prompt}${context}

INSTRUCTIES:
BELANGRIJK: Als er gevraagd wordt waar je iets kunt maken, toevoegen, vinden, of navigeren in het systeem, raadpleeg dan eerst de navigatiepaden in de Layout bestanden (zoals Layout/relaties.txt, Layout/contract-management.txt, enz.) voor de juiste stappen.
${relevantDocs.length > 0
  ? '- Er zijn relevante documenten gevonden, dus beantwoord de vraag in het Nederlands gebaseerd op deze documentinformatie.'
  : '- Als de vraag gerelateerd is aan 21Qubz, 21south, afvalinzameling, ERP-systemen of gerelateerde onderwerpen, beantwoord dan in het Nederlands.\n- Als de vraag NIET gerelateerd is aan deze onderwerpen, antwoord dan: "Sorry, ik kan alleen vragen beantwoorden die gerelateerd zijn aan 21Qubz en 21south. Heb je vragen over onze diensten of processen?"'
}`;

      if (provider === 'groq') {
        const result = await this.groqModel.chat.completions.create({
          messages: [{ role: "user", content: fullPrompt }],
          model: "llama-3.1-8b-instant",
          temperature: 0.7,
          max_tokens: 1000
        });

        response = result.choices[0]?.message?.content || '';
        tokenInfo = {
          promptTokens: result.usage?.prompt_tokens || 0,
          completionTokens: result.usage?.completion_tokens || 0,
          totalTokens: result.usage?.total_tokens || 0
        };
      }
      else if (provider === 'gemini') {
        const result = await this.geminiModel.generateContent(fullPrompt);
        response = result.response.text();

        // Gemini heeft andere token info structuur
        const usage = result.response.usageMetadata;
        tokenInfo = {
          promptTokens: usage?.promptTokenCount || 0,
          completionTokens: usage?.candidatesTokenCount || 0,
          totalTokens: usage?.totalTokenCount || 0
        };
      }
    } catch (err) {
      error = err.message;
      console.error(`Error with ${provider}:`, err);
    }

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    return {
      provider,
      testName,
      prompt,
      response,
      responseTime,
      tokenInfo,
      error,
      timestamp: new Date().toISOString(),
      responseLength: response ? response.length : 0,
      success: !error,
      relevantDocs: relevantDocs.map(doc => doc.filename),
      docsFound: relevantDocs.length
    };
  }

  async runBenchmark(testScenarios) {
    console.log('Starting AI Provider Benchmark...');
    const allResults = [];

    for (const scenario of testScenarios) {
      console.log(`\nTesting scenario: ${scenario.name}`);

      // Test beide providers voor elke scenario
      const groqResult = await this.benchmarkProvider('groq', scenario.prompt, scenario.name);
      const geminiResult = await this.benchmarkProvider('gemini', scenario.prompt, scenario.name);

      allResults.push(groqResult, geminiResult);

      console.log(`Groq: ${groqResult.responseTime}ms ${groqResult.success ? '✓' : '✗'}`);
      console.log(`Gemini: ${geminiResult.responseTime}ms ${geminiResult.success ? '✓' : '✗'}`);

      // Kleine pauze tussen tests om rate limiting te voorkomen
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.results = allResults;
    return allResults;
  }

  generateSummaryStats() {
    const groqResults = this.results.filter(r => r.provider === 'groq' && r.success);
    const geminiResults = this.results.filter(r => r.provider === 'gemini' && r.success);

    const calculateStats = (results) => ({
      count: results.length,
      avgResponseTime: results.reduce((sum, r) => sum + r.responseTime, 0) / results.length,
      minResponseTime: Math.min(...results.map(r => r.responseTime)),
      maxResponseTime: Math.max(...results.map(r => r.responseTime)),
      avgResponseLength: results.reduce((sum, r) => sum + r.responseLength, 0) / results.length,
      totalTokens: results.reduce((sum, r) => sum + r.tokenInfo.totalTokens, 0),
      avgTokensPerRequest: results.reduce((sum, r) => sum + r.tokenInfo.totalTokens, 0) / results.length,
      successRate: results.length / this.results.filter(r => r.provider === results[0].provider).length
    });

    return {
      groq: groqResults.length > 0 ? calculateStats(groqResults) : null,
      gemini: geminiResults.length > 0 ? calculateStats(geminiResults) : null,
      totalTests: this.results.length / 2, // Gedeeld door 2 omdat elke test op beide providers wordt uitgevoerd
      timestamp: new Date().toISOString()
    };
  }

  async saveResults(filename = null) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultFilename = `benchmark-results-${timestamp}.json`;
    const filepath = path.join(__dirname, '../benchmarks', filename || defaultFilename);

    // Zorg dat de benchmarks directory exists
    const benchmarksDir = path.dirname(filepath);
    try {
      await fs.mkdir(benchmarksDir, { recursive: true });
    } catch (err) {
      // Directory bestaat al
    }

    const output = {
      summary: this.generateSummaryStats(),
      detailedResults: this.results,
      generatedAt: new Date().toISOString()
    };

    await fs.writeFile(filepath, JSON.stringify(output, null, 2));
    console.log(`Results saved to: ${filepath}`);
    return filepath;
  }

  printSummary() {
    const stats = this.generateSummaryStats();

    console.log('\n' + '='.repeat(60));
    console.log('AI PROVIDER BENCHMARK SUMMARY');
    console.log('='.repeat(60));

    if (stats.groq && stats.gemini) {
      console.log('\nGROQ vs GEMINI COMPARISON:');
      console.log(`Average Response Time: Groq ${stats.groq.avgResponseTime.toFixed(0)}ms vs Gemini ${stats.gemini.avgResponseTime.toFixed(0)}ms`);
      console.log(`Fastest Response: Groq ${stats.groq.minResponseTime}ms vs Gemini ${stats.gemini.minResponseTime}ms`);
      console.log(`Success Rate: Groq ${(stats.groq.successRate * 100).toFixed(1)}% vs Gemini ${(stats.gemini.successRate * 100).toFixed(1)}%`);
      console.log(`Average Response Length: Groq ${stats.groq.avgResponseLength.toFixed(0)} chars vs Gemini ${stats.gemini.avgResponseLength.toFixed(0)} chars`);
      console.log(`Average Tokens per Request: Groq ${stats.groq.avgTokensPerRequest.toFixed(0)} vs Gemini ${stats.gemini.avgTokensPerRequest.toFixed(0)}`);

      const winner = stats.groq.avgResponseTime < stats.gemini.avgResponseTime ? 'Groq' : 'Gemini';
      const speedDiff = Math.abs(stats.groq.avgResponseTime - stats.gemini.avgResponseTime).toFixed(0);
      console.log(`\n🏆 SPEED WINNER: ${winner} (${speedDiff}ms faster on average)`);
    }

    console.log(`\nTotal tests performed: ${stats.totalTests}`);
    console.log('='.repeat(60));
  }
}

module.exports = { AIBenchmarkService };