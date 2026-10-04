// client/src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Award, Zap, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast) => {
    const id = Date.now() + Math.random().toString();
    const newToast = {
      id,
      type: toast.type || 'info', // 'success' | 'points' | 'badge' | 'error' | 'info'
      title: toast.title,
      message: toast.message,
      points: toast.points,
      duration: toast.duration || 4500
    };

    if (toast.type === 'badge' || (toast.points && toast.points >= 50)) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b']
      });
    }

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '380px',
        width: '100%',
        pointerEvents: 'none'
      }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(16px)',
              border: t.type === 'points'
                ? '1px solid rgba(245, 158, 11, 0.5)'
                : t.type === 'badge'
                ? '1px solid rgba(139, 92, 246, 0.5)'
                : t.type === 'success'
                ? '1px solid rgba(16, 185, 129, 0.5)'
                : '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'slideIn 0.25s ease-out'
            }}
          >
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              {t.type === 'points' && <Zap size={22} color="#f59e0b" fill="#f59e0b" />}
              {t.type === 'badge' && <Award size={22} color="#a78bfa" />}
              {t.type === 'success' && <CheckCircle2 size={22} color="#10b981" />}
              {t.type === 'error' && <AlertCircle size={22} color="#f43f5e" />}
              {t.type === 'info' && <Info size={22} color="#06b6d4" />}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {t.title && (
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc', marginBottom: '2px' }}>
                  {t.title}
                </div>
              )}
              <div style={{ fontSize: '0.825rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                {t.message}
              </div>
              {t.points && (
                <div style={{
                  display: 'inline-block',
                  marginTop: '6px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  +{t.points} Points Earned
                </div>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
