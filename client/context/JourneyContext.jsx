"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { apiCall } from "@/lib/api";

const JourneyContext = createContext(null);

export function JourneyProvider({ children }) {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await apiCall("/api/journey/summary");
      setSummary(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [user]);

  return (
    <JourneyContext.Provider value={{ summary, loading, refresh }}>
      {children}
    </JourneyContext.Provider>
  );
}

export const useJourney = () => useContext(JourneyContext);
