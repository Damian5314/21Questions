import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatWidget from './ChatWidget';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <div style={{ 
      height: '100vh', 
      backgroundColor: '#f0f2f5',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>
        21Questions Demo
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
        The chat widget appears in the bottom-right corner. Click it to start chatting!
      </p>
      
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>Sample Content</h2>
        <p>
          This is a demo page showing how the chat widget works. The widget is framework-agnostic 
          and can be easily integrated into any application, including Mendix pluggable widgets.
        </p>
        
        <h3>Key Features:</h3>
        <ul>
          <li>Floating button that expands to chat panel</li>
          <li>Integration with Gemini AI via Node.js proxy</li>
          <li>Document retrieval from local files</li>
          <li>TypeScript support</li>
          <li>Customizable themes and positioning</li>
        </ul>
        
        <h3>Usage:</h3>
        <p>
          Simply import the ChatWidget component and add it to your application. 
          It will appear as a floating button in the configured position.
        </p>
      </div>
      
      <ChatWidget 
        apiUrl="http://localhost:3001"
        theme="light"
        position="bottom-right"
      />
    </div>
  </React.StrictMode>
);