import React, { useState, useRef, useEffect } from 'react';
import { ChatWidgetProps } from './types';
import { useChat } from './hooks/useChat';

const ChatWidget: React.FC<ChatWidgetProps> = ({
  apiUrl = 'http://localhost:3001',
  theme = 'light',
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, sendMessage } = useChat(apiUrl);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOpenChat = () => {
    setShouldRender(true);
    // Force a reflow before starting animation
    requestAnimationFrame(() => {
      setIsOpen(true);
    });
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    // Remove from DOM after animation completes
    setTimeout(() => {
      setShouldRender(false);
    }, 400);
  };

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
        botBubble: '#404040',
        avatarBg: '#555555'
      }
    : {
        bg: '#ffffff',
        surface: '#f8f9fa',
        text: '#333333',
        textSecondary: '#666666',
        primary: '#02b875',
        border: '#e1e5e9',
        userBubble: '#02b875',
        botBubble: '#f1f3f4',
        avatarBg: '#e1e5e9'
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
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    color: 'white',
    fontSize: '24px'
  };

  const chatPanelStyle: React.CSSProperties = {
    width: '350px',
    height: '500px',
    backgroundColor: themeColors.bg,
    borderRadius: '12px',
    boxShadow: isOpen ? '0 20px 60px rgba(0, 0, 0, 0.2)' : '0 8px 32px rgba(0, 0, 0, 0.12)',
    border: `1px solid ${themeColors.border}`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transform: isOpen 
      ? 'scale(1) translateY(0px)' 
      : 'scale(0.7) translateY(30px)',
    opacity: isOpen ? 1 : 0,
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transformOrigin: position.includes('right') ? 'bottom right' : 'bottom left',
    visibility: shouldRender ? 'visible' : 'hidden',
    pointerEvents: isOpen ? 'auto' : 'none'
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
    gap: '16px'
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

  // Nieuwe stijlen voor betere onderscheiding
  const messageWrapperStyle = (sender: 'user' | 'bot'): React.CSSProperties => ({
    display: 'flex',
    flexDirection: sender === 'user' ? 'row-reverse' : 'row',
    gap: '8px',
    alignItems: 'flex-end',
    marginBottom: '4px'
  });

  const avatarStyle = (sender: 'user' | 'bot'): React.CSSProperties => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: sender === 'user' ? themeColors.primary : themeColors.avatarBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
    color: sender === 'user' ? 'white' : themeColors.text
  });

  const messageContentStyle = (sender: 'user' | 'bot'): React.CSSProperties => ({
    maxWidth: '250px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  });

  const messageLabelStyle = (sender: 'user' | 'bot'): React.CSSProperties => ({
    fontSize: '11px',
    color: themeColors.textSecondary,
    fontWeight: '500',
    marginLeft: sender === 'user' ? '0' : '4px',
    marginRight: sender === 'user' ? '4px' : '0',
    textAlign: sender === 'user' ? 'right' : 'left'
  });

  const messageStyle = (sender: 'user' | 'bot'): React.CSSProperties => ({
    padding: '12px 16px',
    borderRadius: sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    backgroundColor: sender === 'user' ? themeColors.userBubble : themeColors.botBubble,
    color: sender === 'user' ? 'white' : themeColors.text,
    fontSize: '14px',
    lineHeight: '1.4',
    wordBreak: 'break-word',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    position: 'relative'
  });

  const sourcesStyle: React.CSSProperties = {
    fontSize: '12px',
    color: themeColors.textSecondary,
    marginTop: '4px',
    fontStyle: 'italic',
    marginLeft: '8px'
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px'
  };

  const getAvatar = (sender: 'user' | 'bot') => {
    return sender === 'user' ? '👤' : '🤖';
  };

  const getSenderLabel = (sender: 'user' | 'bot') => {
    return sender === 'user' ? 'Jij' : '21Questions';
  };

  return (
    <div style={getPositionStyles()}>
      {!shouldRender && (
        <button
          style={floatingButtonStyle}
          onClick={handleOpenChat}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.15) rotate(-5deg)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
        >
          💬
        </button>
      )}
      
      {shouldRender && (
        <div style={chatPanelStyle}>
          <div style={headerStyle}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>21Questions</h3>
            <button
              style={closeButtonStyle}
              onClick={handleCloseChat}
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
              <div key={message.id} style={messageWrapperStyle(message.sender)}>
                <div style={messageContentStyle(message.sender)}>
                  <div style={messageLabelStyle(message.sender)}>
                    {getSenderLabel(message.sender)}
                  </div>
                  <div style={messageStyle(message.sender)}>
                    {message.text}
                  </div>
                  {message.sources && message.sources.length > 0 && (
                    <div style={sourcesStyle}>
                      Bronnen: {message.sources.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={messageWrapperStyle('bot')}>
                <div style={messageContentStyle('bot')}>
                  <div style={messageLabelStyle('bot')}>
                    21Questions
                  </div>
                  <div style={messageStyle('bot')}>
                    <span style={{ opacity: 0.7 }}>Aan het denken...</span>
                  </div>
                </div>
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