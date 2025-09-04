import React, { useState, useRef, useEffect } from 'react';
import { ChatWidgetProps } from './types';
import { useChat } from './hooks/useChat';

const ChatWidget: React.FC<ChatWidgetProps> = ({
  apiUrl = 'http://localhost:3001',
  theme = 'light',
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, sendMessage } = useChat(apiUrl);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const getPositionStyles = () => {
    const base = { position: 'fixed' as const, zIndex: 1000 };
    switch (position) {
      case 'bottom-left':
        return { ...base, bottom: '20px', left: '20px' };
      case 'top-right':
        return { ...base, top: '20px', right: '20px' };
      case 'top-left':
        return { ...base, top: '20px', left: '20px' };
      default:
        return { ...base, bottom: '20px', right: '20px' };
    }
  };

  const themeColors = theme === 'dark' 
    ? {
        bg: '#1a1a1a',
        surface: '#2d2d2d',
        text: '#ffffff',
        textSecondary: '#b0b0b0',
        primary: '#02b875',
        border: '#404040',
        userBubble: '#02b875',
        botBubble: '#2d2d2d'
      }
    : {
        bg: '#ffffff',
        surface: '#f8f9fa',
        text: '#333333',
        textSecondary: '#666666',
        primary: '#02b875',
        border: '#e1e5e9',
        userBubble: '#02b875',
        botBubble: '#f1f3f4'
      };

  const floatingButtonStyle: React.CSSProperties = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: themeColors.primary,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    color: 'white',
    fontSize: '24px'
  };

  const chatPanelStyle: React.CSSProperties = {
    width: '350px',
    height: '500px',
    backgroundColor: themeColors.bg,
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    border: `1px solid ${themeColors.border}`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  const headerStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: themeColors.primary,
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const messagesContainerStyle: React.CSSProperties = {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const inputContainerStyle: React.CSSProperties = {
    padding: '16px',
    borderTop: `1px solid ${themeColors.border}`,
    display: 'flex',
    gap: '8px'
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '12px',
    border: `1px solid ${themeColors.border}`,
    borderRadius: '24px',
    outline: 'none',
    backgroundColor: themeColors.surface,
    color: themeColors.text,
    fontSize: '14px'
  };

  const sendButtonStyle: React.CSSProperties = {
    padding: '12px 16px',
    backgroundColor: themeColors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  const messageStyle = (sender: 'user' | 'bot'): React.CSSProperties => ({
    padding: '12px 16px',
    borderRadius: '18px',
    maxWidth: '80%',
    alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
    backgroundColor: sender === 'user' ? themeColors.userBubble : themeColors.botBubble,
    color: sender === 'user' ? 'white' : themeColors.text,
    fontSize: '14px',
    lineHeight: '1.4',
    wordBreak: 'break-word'
  });

  const sourcesStyle: React.CSSProperties = {
    fontSize: '12px',
    color: themeColors.textSecondary,
    marginTop: '8px',
    fontStyle: 'italic'
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px'
  };

  return (
    <div style={getPositionStyles()}>
      {!isOpen ? (
        <button
          style={floatingButtonStyle}
          onClick={() => setIsOpen(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
        >
          💬
        </button>
      ) : (
        <div style={chatPanelStyle}>
          <div style={headerStyle}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>21Questions</h3>
            <button
              style={closeButtonStyle}
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
          
          <div style={messagesContainerStyle}>
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: themeColors.textSecondary,
                fontSize: '14px',
                margin: '20px 0'
              }}>
                Vraag me alles over 21QUBZ!
              </div>
            )}
            
            {messages.map((message) => (
              <div key={message.id}>
                <div style={messageStyle(message.sender)}>
                  {message.text}
                </div>
                {message.sources && message.sources.length > 0 && (
                  <div style={sourcesStyle}>
                    Bronnen: {message.sources.join(', ')}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div style={messageStyle('bot')}>
                <span style={{ opacity: 0.7 }}>Aan het denken...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} style={inputContainerStyle}>
            <input
              style={inputStyle}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Stel een vraag..."
              disabled={isLoading}
            />
            <button
              style={sendButtonStyle}
              type="submit"
              disabled={isLoading || !inputValue.trim()}
            >
              Verstuur
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;