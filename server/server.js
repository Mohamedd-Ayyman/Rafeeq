import http from "http";
import { Server } from "socket.io";
import { config } from "./config/config.js";
import { connectDB } from "./config/dbConfig.js";
import { createApp } from "./app.js";

const start = async () => {
  await connectDB();

  const app = createApp();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: config.clientUrl,
      credentials: true,
    },
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join-room", ({ room }) => {
      if (room) socket.join(room);
    });

    socket.on("leave-room", ({ room }) => {
      if (room) socket.leave(room);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  server.listen(config.port, () => {
    console.log(`Rafeeq server running on port ${config.port}`);
  });
};

start();
