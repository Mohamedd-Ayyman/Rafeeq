"use client";

import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, type = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((n) => n.id !== id));
    }, 4500);
  }, []);

  return (
    <NotificationContext.Provider value={{ toasts, notify }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
