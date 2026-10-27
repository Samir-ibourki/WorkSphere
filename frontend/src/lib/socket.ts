import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3030";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
});
