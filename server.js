import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import initializeWebSocket from "./websocket.js";
import { Server } from "socket.io";

const app = express();
const server = http.Server(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initializeWebSocket(io);

// Middleware setup
app.use(cors({ credentials: false, origin: "*" })); // CORS configuration
app.use(express.json()); // Parse JSON request bodies

// Serve static files from the 'public/' directory
const staticPath = path.resolve("public/");
app.use(express.static(staticPath));

// Serve index.html for non-API routes
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next(); // Skip handling API routes here
  }
  res.sendFile(path.join(staticPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
