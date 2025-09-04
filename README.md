# 21Questions Chat Widget

A framework-agnostic React chat widget with Gemini AI integration and document retrieval capabilities.

## Features

- Floating chat button that expands into a chat panel
- Integration with Google Gemini AI via Node.js proxy
- Local document retrieval (PDF and TXT files)
- TypeScript support
- Customizable themes (light/dark) and positioning
- Framework-agnostic design for easy integration into any application

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

2. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. Update `.env` with your API key:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3001
   ```

### 3. Add Documents (Optional)

Create a `docs` folder in the root directory and add your PDF or TXT files:
```
21Questions/
├── docs/
│   ├── document1.pdf
│   ├── document2.txt
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

- `POST /api/chat` - Send a message and get AI response
- `POST /api/upload` - Upload documents (PDF/TXT)
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
│   └── index.js            # Express server with Gemini integration
├── public/
│   └── index.html          # Demo HTML template
├── docs/                   # Place your documents here
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

1. **API Key Issues**: Make sure your Gemini API key is correctly set in the `.env` file
2. **CORS Issues**: The server is configured to allow requests from any origin for development
3. **Document Loading**: Place documents in the `docs/` folder and restart the server
4. **Build Issues**: Ensure all dependencies are installed with `npm install`