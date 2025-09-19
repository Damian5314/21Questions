const fs = require('fs');
const path = require('path');

function showResults(filename) {
  try {
    const filepath = path.join(__dirname, filename);
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));

    console.log('\n' + '='.repeat(80));
    console.log('🚀 AI BENCHMARK RESULTATEN');
    console.log('='.repeat(80));

    // Summary
    const summary = data.summary;
    if (summary.groq && summary.gemini) {
      console.log('\n📊 SAMENVATTING:');
      console.log(`Groq gemiddeld: ${summary.groq.avgResponseTime.toFixed(0)}ms`);
      console.log(`Gemini gemiddeld: ${summary.gemini.avgResponseTime.toFixed(0)}ms`);
      const winner = summary.groq.avgResponseTime < summary.gemini.avgResponseTime ? 'Groq' : 'Gemini';
      const diff = Math.abs(summary.groq.avgResponseTime - summary.gemini.avgResponseTime).toFixed(0);
      console.log(`🏆 Winnaar: ${winner} (+${diff}ms sneller)`);
    }

    // Detailed table
    console.log('\n📋 GEDETAILLEERDE RESULTATEN:');
    console.log('┌─' + '─'.repeat(30) + '─┬─' + '─'.repeat(8) + '─┬─' + '─'.repeat(8) + '─┬─' + '─'.repeat(8) + '─┬─' + '─'.repeat(10) + '─┬─' + '─'.repeat(8) + '─┐');
    console.log('│ Test Scenario'.padEnd(31) + '│ Provider'.padEnd(9) + '│ Time(ms)'.padEnd(9) + '│ Tokens  '.padEnd(9) + '│ Length    '.padEnd(11) + '│ Status  '.padEnd(9) + '│');
    console.log('├─' + '─'.repeat(30) + '─┼─' + '─'.repeat(8) + '─┼─' + '─'.repeat(8) + '─┼─' + '─'.repeat(8) + '─┼─' + '─'.repeat(10) + '─┼─' + '─'.repeat(8) + '─┤');

    data.detailedResults.forEach(result => {
      const scenario = result.testName.substring(0, 30).padEnd(31);
      const provider = result.provider.toUpperCase().padEnd(9);
      const time = result.responseTime.toString().padEnd(9);
      const tokens = (result.tokenInfo.totalTokens || 0).toString().padEnd(9);
      const length = result.responseLength.toString().padEnd(11);
      const status = (result.success ? '✅ OK' : '❌ ERR').padEnd(9);

      console.log(`│ ${scenario}│ ${provider}│ ${time}│ ${tokens}│ ${length}│ ${status}│`);
    });

    console.log('└─' + '─'.repeat(30) + '─┴─' + '─'.repeat(8) + '─┴─' + '─'.repeat(8) + '─┴─' + '─'.repeat(8) + '─┴─' + '─'.repeat(10) + '─┴─' + '─'.repeat(8) + '─┘');

    // Document usage
    console.log('\n📚 DOCUMENTATIE GEBRUIK:');
    data.detailedResults.forEach(result => {
      if (result.relevantDocs && result.relevantDocs.length > 0) {
        console.log(`${result.testName} (${result.provider}): ${result.docsFound} docs - ${result.relevantDocs.join(', ')}`);
      }
    });

    console.log('\n✨ Voor volledige visualisatie: http://localhost:3001/api/benchmark/visualizer');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Fout bij laden van bestand:', error.message);
    console.log('\n📋 Beschikbare bestanden:');

    try {
      const files = fs.readdirSync(__dirname)
        .filter(f => f.endsWith('.json'))
        .sort((a, b) => {
          const statsA = fs.statSync(path.join(__dirname, a));
          const statsB = fs.statSync(path.join(__dirname, b));
          return statsB.mtime - statsA.mtime;
        });

      files.forEach((file, index) => {
        const stats = fs.statSync(path.join(__dirname, file));
        console.log(`${index + 1}. ${file} (${stats.mtime.toLocaleString()})`);
      });
    } catch (err) {
      console.error('Kon bestanden niet laden:', err.message);
    }
  }
}

// CLI usage
if (require.main === module) {
  const filename = process.argv[2];

  if (!filename) {
    console.log('📋 Gebruik: node showResults.js <filename.json>');
    console.log('\n📂 Beschikbare bestanden:');

    try {
      const files = fs.readdirSync(__dirname)
        .filter(f => f.endsWith('.json'))
        .sort((a, b) => {
          const statsA = fs.statSync(path.join(__dirname, a));
          const statsB = fs.statSync(path.join(__dirname, b));
          return statsB.mtime - statsA.mtime;
        });

      files.forEach((file, index) => {
        const stats = fs.statSync(path.join(__dirname, file));
        console.log(`${index + 1}. ${file} (${stats.mtime.toLocaleString()})`);
      });

      if (files.length > 0) {
        console.log(`\n💡 Bijvoorbeeld: node showResults.js ${files[0]}`);
      }
    } catch (err) {
      console.error('Kon bestanden niet laden:', err.message);
    }

    process.exit(1);
  }

  showResults(filename);
}

module.exports = { showResults };