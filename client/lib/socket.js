import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: true, withCredentials: true });
  }
  return socket;
};

export const joinRoom = (room) => {
  const s = getSocket();
  s.emit("join-room", { room });
};

export const leaveRoom = (room) => {
  const s = getSocket();
  s.emit("leave-room", { room });
};
