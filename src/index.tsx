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
        De chat widget staat rechts onderin 
      </p>
      
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>Uitleg</h2>
        <p>
          Dit is de demo pagina van de ai chatbot genaamd 21Questions (ik ben nog niet zeker over de naam), zal later met mendix pluggable widgets moeten werken.
        </p>
        
        <h3>Key Features:</h3>
        <ul>
          <li>Floating knop waar je op moet drukken</li>
          <li>Integratie met Gemini AI via Node.js proxy</li>
          <li>Documenten via locale bestanden (voor nu) voor kennisbank (om de ai te leren over qubz)</li>
        </ul>
        
        <h3>Gebruik:</h3>
        <p>
          Later via de mendix widget plugin importeren naar 21QUBZ, ik moet nog uitzoeken hoe precies...
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