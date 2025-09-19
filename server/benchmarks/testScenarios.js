// Test scenarios voor AI provider vergelijking
// Deze scenarios testen verschillende aspecten: snelheid, complexiteit, domein specifieke kennis, etc.

const testScenarios = [
  {
    name: "Simple Question",
    description: "Test basic response speed with simple question",
    prompt: "Wat is de hoofdstad van Nederland?",
    expectedResponseType: "short_factual"
  },
  {
    name: "21Qubz Domain Question",
    description: "Test domain-specific knowledge about 21Qubz services",
    prompt: "Leg uit wat 21Qubz doet en welke diensten zij aanbieden in de afvalinzameling.",
    expectedResponseType: "domain_specific"
  },
  {
    name: "Complex Technical Question",
    description: "Test handling of complex technical queries",
    prompt: "Hoe werkt een ERP-systeem en wat zijn de voordelen ervan voor afvalinzamelingsbedrijven? Geef concrete voorbeelden.",
    expectedResponseType: "technical_detailed"
  },
  {
    name: "Short Answer Request",
    description: "Test ability to provide concise responses",
    prompt: "Geef een korte definitie van duurzame afvalinzameling in maximaal 2 zinnen.",
    expectedResponseType: "concise"
  },
  {
    name: "Step-by-Step Explanation",
    description: "Test structured response generation",
    prompt: "Leg stap voor stap uit hoe een nieuwe klant een afvalinzamelingscontract kan afsluiten bij 21Qubz.",
    expectedResponseType: "structured_steps"
  },
  {
    name: "Problem Solving",
    description: "Test problem-solving and analytical thinking",
    prompt: "Een klant klaagt dat hun afval niet op tijd wordt opgehaald. Wat zijn mogelijke oorzaken en oplossingen?",
    expectedResponseType: "problem_solving"
  },
  {
    name: "Creative Writing",
    description: "Test creative capabilities",
    prompt: "Schrijf een korte, vriendelijke e-mail aan een klant om hen te bedanken voor hun samenwerking met 21Qubz.",
    expectedResponseType: "creative"
  },
  {
    name: "Numerical/Analytical",
    description: "Test handling of numerical and analytical queries",
    prompt: "Als een bedrijf 500kg afval per week produceert, hoeveel containers van 240 liter hebben ze nodig per maand?",
    expectedResponseType: "numerical"
  },
  {
    name: "Long Form Content",
    description: "Test generation of longer, detailed content",
    prompt: "Schrijf een uitgebreide uitleg over de verschillende typen afval (restafval, gft, papier, etc.) en hoe deze door 21Qubz worden verwerkt. Gebruik subkoppen en geef praktische tips.",
    expectedResponseType: "long_form"
  },
  {
    name: "Edge Case Question",
    description: "Test handling of unusual or edge case queries",
    prompt: "Wat gebeurt er als een container vol zit met gevaarlijk afval dat niet gemeld was? Welke protocollen volgt 21Qubz?",
    expectedResponseType: "edge_case"
  }
];

// Snelle test set voor development - 21Qubz specifiek
const quickTestScenarios = [
  {
    name: "21Qubz Bedrijfsinfo",
    description: "Basic company information",
    prompt: "Wat doet 21Qubz en welke diensten bieden jullie aan?",
    expectedResponseType: "company_info"
  },
  {
    name: "Nieuwe Klant Toevoegen",
    description: "Navigation question about adding clients",
    prompt: "Hoe maak ik een nieuwe klant aan in het systeem?",
    expectedResponseType: "navigation_help"
  },
  {
    name: "Contract Management",
    description: "Contract-related question",
    prompt: "Waar kan ik contracten beheren en nieuwe contracten aanmaken?",
    expectedResponseType: "contract_management"
  }
];

// Stress test scenarios voor performance onder load
const stressTestScenarios = [
  {
    name: "Stress Test 1",
    description: "Complex multilayered question",
    prompt: "Analyseer de impact van nieuwe EU-wetgeving op circulaire economie voor afvalinzamelingsbedrijven zoals 21Qubz. Geef concrete aanbevelingen voor implementatie, kostenanalyse en tijdschema. Gebruik praktische voorbeelden en verwijs naar relevante stakeholders.",
    expectedResponseType: "complex_analysis"
  },
  {
    name: "Stress Test 2",
    description: "Multiple question prompt",
    prompt: "1. Wat zijn de nieuwste trends in afvalinzameling? 2. Hoe beïnvloedt digitalisering deze sector? 3. Welke rol speelt AI in optimalisatie van routes? 4. Wat zijn de milieu-impact overwegingen? Beantwoord elke vraag uitgebreid.",
    expectedResponseType: "multiple_questions"
  }
];

module.exports = {
  testScenarios,
  quickTestScenarios,
  stressTestScenarios
};