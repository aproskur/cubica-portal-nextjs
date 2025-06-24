'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const getPositionStyle = (position) => {
  switch (position) {
    case 'top-left':
      return { top: '1.5rem', left: '1.5rem' };
    case 'top-center':
      return { top: '1.5rem', left: '50%', transform: 'translateX(-50%)' };
    case 'top-right':
      return { top: '1.5rem', right: '1.5rem' };
    case 'bottom-left':
      return { bottom: '1.5rem', left: '1.5rem' };
    case 'bottom-center':
      return { bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)' };
    case 'bottom-right':
    default:
      return { bottom: '1.5rem', right: '1.5rem' };
  }
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [position, setPosition] = useState('bottom-center');

  const showToast = useCallback((message, duration = 3000, pos = 'bottom-center') => {
    setToast(message);
    setPosition(pos);
    setTimeout(() => setToast(null), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          style={{
            position: 'fixed',
            background: 'rgba(255, 255, 255, 0.95)',
            color: 'black',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
            zIndex: 9999,
            fontWeight: 'bold',
            ...getPositionStyle(position),
          }}
        >
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  );
};
