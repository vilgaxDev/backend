// websocket.js

import { createServer } from "http";
import { Server as socketIOServer } from "socket.io";
import Transcriber from "./transcriber.js"; // Assuming Transcriber is implemented in transcriber.js

// Initialize WebSocket server
const initializeWebSocket = (httpServer) => {
  // Create an HTTP server (if not already created)
  const server = httpServer || createServer();

  // Create Socket.IO server
  const io = new socketIOServer(server, {
    cors: {
      origin: "*", // Allow requests from any origin (for demo purposes)
    },
  });

  // Handle WebSocket connections
  io.on("connection", (socket) => {
    console.log(`Connection made (${socket.id})`);

    let transcriber = null;

    // Handle configuration of the stream
    socket.on("configure-stream", async (config) => {
      try {
        // Initialize transcriber with provided configuration
        transcriber = new Transcriber(config);
        socket.emit("transcriber-ready");

        // Handle incoming audio data
        socket.on("incoming-audio", async (audioData) => {
          processAudio(audioData); // Process the incoming audio data
        });

        // Handle stop-stream event
        socket.on("stop-stream", () => {
          transcriber.stop(); // Stop the transcriber
        });

      } catch (error) {
        console.error("Error configuring stream:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Socket disconnected (${socket.id})`);
      if (transcriber) {
        transcriber.stop(); // Stop the transcriber if it exists
      }
    });
  });

  return server;
};

// Example function to process incoming audio data
const processAudio = async (audioData) => {
  // Implement your logic here to handle incoming audio data
  console.log("Received audio data:", audioData);
  // Example: Perform transcription or other processing tasks
};

// Export the initializeWebSocket function
export default initializeWebSocket;
