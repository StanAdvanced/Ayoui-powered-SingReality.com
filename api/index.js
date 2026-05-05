import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// WebSocket logic
io.on("connection", (socket) => {
  console.log("User connected (Vercel Simulation):", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("send-message", (data) => {
    io.to(data.roomId).emit("receive-message", {
      sender: socket.id,
      content: data.message,
      timestamp: Date.now()
    });
  });

  // WebRTC Signaling
  socket.on("webrtc-offer", (data) => {
    socket.to(data.roomId).emit("webrtc-offer", { from: socket.id, offer: data.offer });
  });

  socket.on("webrtc-answer", (data) => {
    socket.to(data.roomId).emit("webrtc-answer", { from: socket.id, answer: data.answer });
  });

  socket.on("webrtc-ice-candidate", (data) => {
    socket.to(data.roomId).emit("webrtc-ice-candidate", { from: socket.id, candidate: data.candidate });
  });
});

// Mock health check for Vercel
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", environment: "vercel" });
});

// YouTube Search API
app.get("/api/youtube/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${process.env.YOUTUBE_API_KEY}&maxResults=10`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("YouTube API Error:", error);
    res.status(500).json({ error: "Failed to fetch from YouTube" });
  }
});

// In Vercel, we can't really do persistent WebSockets without a dedicated server,
// but we can provide the API routes. 
// For full-stack on Vercel, this file acts as the serverless entry.

export default app;
