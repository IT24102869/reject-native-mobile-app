import React, { createContext, useState, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className="card" 
            style={{ 
              minWidth: '300px', 
              padding: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              boxShadow: 'var(--shadow-lg)',
              borderLeft: `4px solid ${n.type === 'success' ? 'var(--success)' : n.type === 'error' ? 'var(--danger)' : 'var(--primary)'}`,
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {n.type === 'success' && <CheckCircle size={20} color="var(--success)" />}
            {n.type === 'error' && <AlertCircle size={20} color="var(--danger)" />}
            {n.type === 'info' && <Info size={20} color="var(--primary)" />}
            
            <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: '500' }}>{n.message}</span>
            
            <button onClick={() => removeNotification(n.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
