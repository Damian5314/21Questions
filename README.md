# 21Questions Chat Widget

Een framework-agnostische React chat widget met Groq API integratie en geavanceerde document retrieval functionaliteiten voor 21Qubz en 21south.

## Features

- Zwevende chat-knop die uitklapt tot een chat-paneel met animaties
- Integratie met Groq API (Llama 3.1-8b-instant model) via Node.js proxy
- Geavanceerde document retrieval (PDF, TXT en DOCX bestanden)
- Intelligente zoekfunctionaliteit met synoniemen en prioriteiten
- Begroetingsdetectie en business context validatie
- Navigatiepaden ondersteuning voor Layout-bestanden
- TypeScript ondersteuning
- Aanpasbare thema's (licht/donker) en positionering
- Framework-agnostische ontwerp voor eenvoudige integratie in elke applicatie

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Get your Groq API key from [Groq Console](https://console.groq.com/keys)

3. Update `.env` with your API key:
   ```
   GROQ_API_KEY=your_actual_groq_api_key_here
   PORT=3001
   ```

### 3. Add Documents (Optional)

Create a `docs` folder in the root directory and add your PDF, TXT or DOCX files:
```
21Questions/
├── docs/
│   ├── document1.pdf
│   ├── document2.txt
│   ├── document3.docx
│   ├── Layout/
│   │   ├── relaties.txt
│   │   ├── contract-management.txt
│   │   └── ...
│   └── ...
```

### 4. Start the Application

Run both the server and client in development mode:
```bash
npm run dev
```

This will start:
- Node.js server on `http://localhost:3001`
- Webpack dev server on `http://localhost:3000`

### 5. Production Build

To build the widget for production use:
```bash
npm run build
```

This creates a `dist/ChatWidget.js` file that can be imported into any application.

## Usage

### Basic Integration

```tsx
import ChatWidget from './src/ChatWidget';

function App() {
  return (
    <div>
      {/* Your app content */}
      <ChatWidget 
        apiUrl="http://localhost:3001"
        theme="light"
        position="bottom-right"
      />
    </div>
  );
}
```

### Props

- `apiUrl` (optional): URL of the backend server (default: "http://localhost:3001")
- `theme` (optional): "light" or "dark" (default: "light")
- `position` (optional): "bottom-right", "bottom-left", "top-right", or "top-left" (default: "bottom-right")

### Mendix Integration

The widget is designed to be easily integrated into Mendix pluggable widgets:

1. Build the production version: `npm run build`
2. Copy `dist/ChatWidget.js` to your Mendix widget project
3. Import and use the widget in your Mendix component

## API Endpoints

The Node.js server provides these endpoints:

- `POST /api/chat` - Send a message and get AI response with Groq integration
- `POST /api/upload` - Upload documents (PDF/TXT/DOCX)
- `GET /api/documents` - List uploaded documents

## File Structure

```
21Questions/
├── src/
│   ├── ChatWidget.tsx      # Main chat widget component
│   ├── hooks/
│   │   └── useChat.ts      # Chat functionality hook
│   ├── types.ts            # TypeScript interfaces
│   └── index.tsx           # Demo application
├── server/
│   ├── index.js            # Express server main file
│   ├── config/
│   │   └── groq.js         # Groq API configuration
│   ├── routes/
│   │   ├── chatRoutes.js   # Chat API endpoints
│   │   ├── uploadRoutes.js # Document upload endpoints
│   │   └── documentRoutes.js # Document management endpoints
│   └── services/
│       ├── chatService.js  # Groq integration and chat logic
│       └── documentService.js # Document processing and search
├── public/
│   └── index.html          # Demo HTML template
├── docs/                   # Place your documents here (PDF/TXT/DOCX)
│   └── Layout/            # Navigation paths documentation
├── package.json
├── tsconfig.json
├── webpack.dev.js
└── webpack.prod.js
```

## Development

- `npm run dev` - Start development mode
- `npm run build` - Build production version
- `npm run server:dev` - Start server only
- `npm run client:dev` - Start client only

## Troubleshooting

1. **API Key Issues**: Make sure your Groq API key is correctly set in the `.env` file
2. **CORS Issues**: The server is configured to allow requests from any origin for development
3. **Document Loading**: Place documents in the `docs/` folder and restart the server. Supported formats: PDF, TXT, DOCX
4. **Build Issues**: Ensure all dependencies are installed with `npm install`
5. **Search Issues**: Ensure Layout files are properly placed in `docs/Layout/` for navigation path support

## AI Model Details

The chat widget uses Groq's Llama 3.1-8b-instant model which provides:
- Fast response times
- Support for Nederlandse taal
- Business context awareness for 21Qubz and 21south
- Intelligent document retrieval with synonym matching
- Greeting detection and appropriate responses