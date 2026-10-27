import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

let io: Server | null = null;

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`⚡ Client connected to WebSocket: ${socket.id}`);

    // when client enter a projet in kanban
    socket.on("join:project", (projectId: string) => {
      socket.join(`project:${projectId}`);
      console.log(`📌 Socket ${socket.id} joined room: project:${projectId}`);
    });

    // when client quit the projet
    socket.on("leave:project", (projectId: string) => {
      socket.leave(`project:${projectId}`);
      console.log(`🚪 Socket ${socket.id} left room: project:${projectId}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Fonction exportable for use it in controllers or services
export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io is not initialized! Call initSocket first.");
  }
  return io;
};
