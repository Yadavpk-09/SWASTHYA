// client/src/components/chatbot/FitBotChatDrawer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, ShieldAlert, User } from 'lucide-react';
import { api } from '../../services/api.js';

export const FitBotChatDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Namaste! I'm your SWASTHYA AI Assistant. Ask me anything about personalized workout plans, asana alignments, breathing techniques, hydration, sleep, or macro nutrition guidance.",
      category: 'Welcome'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const suggestedChips = [
    'How do I fix squat knee pain?',
    'Best asana for lower back stiffness',
    'How much water should I drink daily?',
    'High protein vegetarian meals',
    'Explain 4-7-8 breathing'
  ];

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const res = await api.chat.ask(query);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: res.reply,
          category: res.category,
          disclaimer: res.disclaimer || 'General guidance only, not medical advice.'
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I'm having trouble retrieving that answer right now. Please try again or explore our Exercise & Yoga libraries!",
          category: 'Error'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
          border: 'none',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.45)',
          color: '#ffffff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 90,
          transition: 'transform 0.2s ease'
        }}
        className="hover-scale"
        title="Ask SWASTHYA Assistant"
      >
        {isOpen ? <X size={24} /> : <Bot size={26} />}
      </button>

      {/* Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 32px)',
          height: '520px',
          maxHeight: 'calc(100vh - 120px)',
          background: '#0d1424',
          border: '1px solid var(--border-glass-bright)',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 95,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px',
            background: 'rgba(15, 23, 42, 0.8)',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={18} color="var(--emerald-primary)" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', color: '#f8fafc' }}>SWASTHYA AI Assistant</h4>
                <span style={{ fontSize: '0.7rem', color: 'var(--emerald-primary)' }}>Online • Knowledge Base</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Medical Disclaimer Note (FR10.3) */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.72rem',
            color: '#fbbf24'
          }}>
            <ShieldAlert size={14} style={{ flexShrink: 0 }} />
            <span>General guidance only, not intended as medical diagnosis.</span>
          </div>

          {/* Messages list */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                {m.sender === 'bot' && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <Bot size={13} color="var(--emerald-primary)" />
                  </div>
                )}

                <div style={{
                  background: m.sender === 'user' ? 'var(--emerald-primary)' : 'rgba(255, 255, 255, 0.06)',
                  color: m.sender === 'user' ? '#ffffff' : '#f8fafc',
                  border: m.sender === 'user' ? 'none' : '1px solid var(--border-glass)',
                  padding: '10px 14px',
                  borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  fontSize: '0.85rem',
                  lineHeight: 1.45
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                <Bot size={14} />
                <span>Thinking...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{
            padding: '8px 12px',
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            background: 'rgba(11, 16, 28, 0.6)'
          }}>
            {suggestedChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '999px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input form */}
          <div style={{
            padding: '12px',
            background: 'rgba(15, 23, 42, 0.9)',
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              placeholder="Ask fitness, yoga, or nutrition question..."
              className="input-field"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputVal.trim() || isTyping}
              className="btn-primary"
              style={{ padding: '8px 14px' }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
