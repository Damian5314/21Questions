# AI Provider Benchmark Tool 🚀

Een complete tool voor het vergelijken van Groq en Gemini AI providers op snelheid, token gebruik, en response kwaliteit.

## 📋 Overzicht

Deze benchmark tool helpt je bij het vergelijken van:
- **Groq** (llama-3.1-8b-instant)
- **Gemini** (gemini-1.5-flash-latest)

### Metrics die worden gemeten:
- ⚡ **Response tijd** (milliseconden)
- 💬 **Token gebruik** (prompt + completion tokens)
- 📏 **Response lengte** (aantal karakters)
- 🎯 **Success rate** (percentage succesvolle responses)
- ❌ **Error rate** (fouten en failures)

## 🔧 Setup

### 1. API Keys configureren
Zorg dat je geldige API keys hebt in je `.env` bestand:

```env
GROQ_API_KEY=jouw_groq_api_key_hier
GEMINI_API_KEY=jouw_gemini_api_key_hier
```

### 2. API Keys verkrijgen:
- **Groq**: https://console.groq.com/
- **Gemini**: https://ai.google.dev/

## 🚀 Gebruik

### Via Command Line

```bash
# Quick test (3 scenarios)
node server/benchmarks/runBenchmark.js quick

# Volledige test (10 scenarios)
node server/benchmarks/runBenchmark.js full

# Stress test (2 complexe scenarios)
node server/benchmarks/runBenchmark.js stress
```

### Via Web Interface

1. **Start de server** (als deze nog niet draait)
2. **Open visualizer**: http://localhost:3001/api/benchmark/visualizer
3. **Upload resultaten** en bekijk de grafieken

### Via API

```bash
# Run benchmark via API
curl -X POST http://localhost:3001/api/benchmark/run \
  -H "Content-Type: application/json" \
  -d '{"testType": "quick"}'

# Get alle resultaten
curl http://localhost:3001/api/benchmark/results

# Get specifiek resultaat
curl http://localhost:3001/api/benchmark/results/benchmark-quick-123456.json
```

## 📊 Test Scenarios

### Quick Test (3 scenarios)
- Basic greeting
- Simple 21Qubz vraag
- Eenvoudige uitleg

### Full Test (10 scenarios)
- Simple questions
- Domain-specific knowledge
- Technical complexity
- Step-by-step explanations
- Problem solving
- Creative writing
- Numerical analysis
- Long-form content
- Edge cases

### Stress Test (2 scenarios)
- Complex multilayered analysis
- Multiple questions in één prompt

## 📈 Resultaten Analyse

### Console Output
```
🏆 SPEED WINNER: Groq (+45ms sneller)
⚡ Groq Gemiddeld: 156ms
⚡ Gemini Gemiddeld: 201ms
🎯 Groq Success Rate: 100.0%
🎯 Gemini Success Rate: 100.0%
```

### JSON Resultaten
Resultaten worden opgeslagen in `server/benchmarks/` met gedetailleerde data:

```json
{
  "summary": {
    "groq": {
      "avgResponseTime": 156,
      "successRate": 1.0,
      "avgTokensPerRequest": 234
    },
    "gemini": {
      "avgResponseTime": 201,
      "successRate": 1.0,
      "avgTokensPerRequest": 189
    }
  },
  "detailedResults": [...],
  "generatedAt": "2025-01-17T14:03:57.123Z"
}
```

### Web Visualisatie
De HTML visualizer toont:
- 📊 **Bar charts**: Response tijd vergelijking
- 📈 **Line charts**: Response lengte trends
- 🍩 **Donut charts**: Success rates
- 📋 **Data tables**: Gedetailleerde resultaten

## 🎯 Onderzoeksdoeleinden

### Voor Performance Analyse:
1. **Run meerdere tests** op verschillende tijdstippen
2. **Vergelijk verschillende scenario types** (kort vs lang, simpel vs complex)
3. **Monitor consistency** over tijd
4. **Analyseer cost efficiency** (tokens per response)

### Voor Kwaliteit Beoordeling:
1. **Test domain-specific knowledge** (21Qubz vragen)
2. **Evalueer verschillende response types** (factual, creative, technical)
3. **Check edge case handling**
4. **Beoordeel Nederlandse taal kwaliteit**

## 📁 Bestandsstructuur

```
server/
├── services/
│   └── aiBenchmarkService.js     # Core benchmark logica
├── benchmarks/
│   ├── runBenchmark.js          # CLI interface
│   ├── testScenarios.js         # Test scenario definities
│   ├── visualizer.html          # Web visualisatie
│   └── [resultaten]             # JSON resultaat bestanden
├── routes/
│   └── benchmark.js             # API endpoints
└── config/
    ├── groq.js                  # Groq configuratie
    └── gemini.js                # Gemini configuratie
```

## 🔧 Uitbreiding

### Nieuwe Test Scenarios Toevoegen:
Edit `server/benchmarks/testScenarios.js`:

```javascript
{
  name: "Jouw Test Naam",
  description: "Beschrijving van de test",
  prompt: "Je test prompt hier",
  expectedResponseType: "type_category"
}
```

### Nieuwe Metrics Toevoegen:
Edit `server/services/aiBenchmarkService.js` om extra metrics te meten zoals:
- Response sentiment
- Technical accuracy scores
- Response completeness

## 📖 Tips voor Onderzoek

1. **Test op verschillende tijdstippen** - API latency kan variëren
2. **Gebruik consistente prompts** - voor eerlijke vergelijking
3. **Monitor token costs** - voor budget planning
4. **Save alle resultaten** - voor longitudinale analyse
5. **Test edge cases** - om robustheid te beoordelen

## 🚨 Troubleshooting

### API Key Errors:
- Controleer je `.env` bestand
- Verifieer dat keys geldig zijn
- Check API limits en quota

### Permission Errors:
- Zorg dat `server/benchmarks/` directory bestaat
- Check write permissions

### Memory Issues:
- Gebruik `quick` test voor ontwikkeling
- Run `stress` tests met voorzichtigheid

---

**Succes met je AI provider onderzoek! 🎉**