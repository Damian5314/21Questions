require('dotenv').config();
const { AIBenchmarkService } = require('../services/aiBenchmarkService');
const { testScenarios, quickTestScenarios, stressTestScenarios } = require('./testScenarios');
const { initializeDocuments } = require('../services/documentService');

async function runBenchmark(testType = 'quick') {
  console.log('AI Provider Benchmark Tool');
  console.log('===========================');

  let selectedScenarios;
  switch (testType.toLowerCase()) {
    case 'full':
      selectedScenarios = testScenarios;
      console.log('Running FULL benchmark with all test scenarios...');
      break;
    case 'stress':
      selectedScenarios = stressTestScenarios;
      console.log('Running STRESS TEST benchmark...');
      break;
    case 'quick':
    default:
      selectedScenarios = quickTestScenarios;
      console.log('Running QUICK benchmark...');
      break;
  }

  console.log(`Test scenarios selected: ${selectedScenarios.length}`);
  console.log('Providers to test: Groq (llama-3.1-8b-instant) vs Gemini (gemini-1.5-flash-latest)');
  console.log();

  // Initialize documents first
  console.log('Loading 21Qubz documentation...');
  await initializeDocuments();

  const benchmarkService = new AIBenchmarkService();

  try {
    const results = await benchmarkService.runBenchmark(selectedScenarios);

    // Print summary to console
    benchmarkService.printSummary();

    // Save results to file
    const filepath = await benchmarkService.saveResults(`benchmark-${testType}-${Date.now()}.json`);

    console.log(`\nBenchmark completed!`);
    console.log(`Results saved to: ${filepath}`);

    // Return results for potential further processing
    return {
      summary: benchmarkService.generateSummaryStats(),
      results: results,
      filepath: filepath
    };

  } catch (error) {
    console.error('Benchmark failed:', error);
    throw error;
  }
}

// CLI interface
if (require.main === module) {
  const testType = process.argv[2] || 'quick';

  console.log(`Starting benchmark with test type: ${testType}`);
  console.log('Available test types: quick, full, stress');
  console.log();

  runBenchmark(testType)
    .then(() => {
      console.log('\n✅ Benchmark completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Benchmark failed:', error.message);
      process.exit(1);
    });
}

module.exports = { runBenchmark };