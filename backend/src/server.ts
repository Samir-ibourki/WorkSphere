import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import prisma from "./prisma/client.js";
import http from "http";
import { initSocket } from "./config/socket.js";

import authRouter from "./modules/auth/auth.routes.js";
import projectRouter from "./modules/projects/project.routes.js";
import taskRouter from "./modules/tasks/task.routes.js";
import organizationRouter from "./modules/organizations/organization.routes.js";
import dashboardRouter from "./modules/dashboard/dashboard.routes.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import "./jobs/email.worker.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

// create le serveur HTTP et attacher Socket.io
const httpServer = http.createServer(app);
initSocket(httpServer);

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// rate limiting (DoS protection for all /api endpoints)
app.use("/api", generalLimiter);

// routes
app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/organizations", organizationRouter);
app.use("/api/dashboard", dashboardRouter);

// health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Centralized error handling middleware (catches database/system errors and returns clean responses)
app.use(errorHandler);

// Start server
async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("Database connected successfully");

    httpServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`WebSocket server is ready`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

main();
