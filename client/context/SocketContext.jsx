"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSocket, joinRoom, leaveRoom } from "@/lib/socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    const handlers = {};
    const on = (event, fn) => {
      handlers[event] = fn;
      socket.on(event, fn);
    };

    on("streak-updated", (payload) => {
      setEvents((e) => [...e.slice(-50), { type: "streak-updated", payload, at: Date.now() }]);
    });
    on("achievement-unlocked", (payload) => {
      setEvents((e) => [...e.slice(-50), { type: "achievement-unlocked", payload, at: Date.now() }]);
    });
    on("buddy-notification", (payload) => {
      setEvents((e) => [...e.slice(-50), { type: "buddy-notification", payload, at: Date.now() }]);
    });
    on("challenge-progress", (payload) => {
      setEvents((e) => [...e.slice(-50), { type: "challenge-progress", payload, at: Date.now() }]);
    });
    on("wheel-result", (payload) => {
      setEvents((e) => [...e.slice(-50), { type: "wheel-result", payload, at: Date.now() }]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      Object.entries(handlers).forEach(([ev, fn]) => socket.off(ev, fn));
    };
  }, []);

  useEffect(() => {
    if (user) {
      joinRoom(`journey:${user._id}`);
      joinRoom(`role:${user.role}`);
    }
    return () => {
      if (user) {
        leaveRoom(`journey:${user._id}`);
        leaveRoom(`role:${user.role}`);
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ events, connected }}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
