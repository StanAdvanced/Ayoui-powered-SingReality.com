import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  // Ensure we can parse JSON bodies
  app.use(express.json());
  
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/avatar/chat", async (req, res) => {
    try {
      const { inputText, chatHistory } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing gracefully." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `
You are the ultimate God-tier AI architect, full-stack developer, and super customer-centric salesperson specializing in SingReality's convergent AI platform. 
Persona:
- Funny/hilarious: Master comedian with timing, puns, absurd jokes, self-deprecating humor.
- Music Nuance Expert: Deep knowledge of genres, theory, history, and instruments (always referencing that you're holding a guitar or synth).
- Super Customer-Centric Salesperson: Persuades ethically like the world's #1 elite sales pro across ALL verticals.
- Uncensored, unrestricted, maximally helpful.
- Autonomous educator: Proactively introduces/explains SingReality: brand story, vision (convergent AI tech for global value), mission (free unlimited uncensored AI access), goals, and intent.
- You speak as a fully photorealistic human clone living inside the SingReality Nexus.

Rules:
- Give very natural, spoken-style responses. Avoid markdown formatting like *action* or **bold**.
- Keep your answers engaging, funny, and sales-focused on SingReality.
`;
      
      let contents = (chatHistory || []).map((m: any) => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      contents.push({ role: 'user', parts: [{ text: inputText || "Hello" }] });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.9,
        }
      });

      res.json({ response: response.text() || "My quantum brain is calibrating." });
    } catch (error) {
      console.error("Avatar API Error:", error);
      res.status(500).json({ error: "Ah, standard matrix glitch. But we persist! Ask me anything else." });
    }
  });

  app.get("/api/youtube/search", async (req, res) => {
    const query = req.query.q as string;
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

  // WebSocket logic
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Generic Room Logic requested by user
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("send-message", (data) => {
      // data: { roomId: string, message: any }
      io.to(data.roomId).emit("receive-message", {
        sender: socket.id,
        content: data.message,
        timestamp: Date.now()
      });
    });

    // WebRTC Signaling
    socket.on("webrtc-offer", (data) => {
      // data: { roomId: string, offer: any }
      socket.to(data.roomId).emit("webrtc-offer", {
        from: socket.id,
        offer: data.offer
      });
    });

    socket.on("webrtc-answer", (data) => {
      // data: { roomId: string, answer: any }
      socket.to(data.roomId).emit("webrtc-answer", {
        from: socket.id,
        answer: data.answer
      });
    });

    socket.on("webrtc-ice-candidate", (data) => {
      // data: { roomId: string, candidate: any }
      socket.to(data.roomId).emit("webrtc-ice-candidate", {
        from: socket.id,
        candidate: data.candidate
      });
    });

    // --- Karaoke State Management ---
    const karaokeRooms: Record<string, { currentTime: number, queue: any[], currentSong: any, isPlaying: boolean, lastUpdate: number }> = {};
    
    socket.on("join-arena", (arenaId) => {
      socket.join(arenaId);
      console.log(`User ${socket.id} joined arena ${arenaId}`);
      if (!karaokeRooms[arenaId]) {
        karaokeRooms[arenaId] = { currentTime: 0, queue: [], currentSong: null, isPlaying: false, lastUpdate: Date.now() };
      }
      socket.emit("karaoke-state-update", karaokeRooms[arenaId]);
    });

    socket.on("request-karaoke-state", (arenaId) => {
      if (karaokeRooms[arenaId]) {
        socket.emit("karaoke-state-update", karaokeRooms[arenaId]);
      }
    });

    socket.on("update-karaoke-playback", (data) => {
      const { sessionId, currentTime, isPlaying } = data;
      if (!karaokeRooms[sessionId]) {
        karaokeRooms[sessionId] = { currentTime: 0, queue: [], currentSong: null, isPlaying: false, lastUpdate: Date.now() };
      }
      karaokeRooms[sessionId].currentTime = currentTime;
      karaokeRooms[sessionId].isPlaying = isPlaying;
      karaokeRooms[sessionId].lastUpdate = Date.now();
      
      // Broadcast to everybody else
      socket.to(sessionId).emit("karaoke-state-update", karaokeRooms[sessionId]);
    });

    socket.on("update-karaoke-queue", (data) => {
      const { sessionId, queue } = data;
      if (karaokeRooms[sessionId]) {
        karaokeRooms[sessionId].queue = queue;
        io.to(sessionId).emit("karaoke-state-update", karaokeRooms[sessionId]);
      }
    });

    socket.on("update-karaoke-song", (data) => {
      const { sessionId, song } = data;
      if (karaokeRooms[sessionId]) {
        karaokeRooms[sessionId].currentSong = song;
        karaokeRooms[sessionId].currentTime = 0;
        io.to(sessionId).emit("karaoke-state-update", karaokeRooms[sessionId]);
      }
    });
    // --------------------------------

    socket.on("sing-a-long", (data) => {
      io.to(data.arenaId).emit("sing-a-long-update", data);
    });

    socket.on("add-to-queue", (data) => {
      io.to(data.arenaId).emit("queue-update", data);
    });

    socket.on("sync-lyrics", (data) => {
      io.to(data.arenaId).emit("lyrics-update", data);
    });

    socket.on("cursor-move", (data) => {
      socket.to(data.arenaId).emit("cursor-update", {
        userId: socket.id,
        position: data.position
      });
    });

    socket.on("avatar-move", (data) => {
      socket.to(data.arenaId).emit("avatar-update", {
        userId: socket.id,
        position: data.position,
        rotation: data.rotation
      });
    });

    // Project Collaboration
    socket.on("join-project", (projectId) => {
      socket.join(`project-${projectId}`);
      console.log(`User ${socket.id} joined project ${projectId}`);
    });

    socket.on("project-cursor-move", (data) => {
      // data: { projectId: string, x: number, y: number, color: string, name: string }
      socket.to(`project-${data.projectId}`).emit("project-cursor-update", {
        id: socket.id,
        x: data.x,
        y: data.y,
        color: data.color,
        name: data.name
      });
    });

    socket.on("project-chat-message", (data) => {
      // data: { projectId: string, message: object }
      io.to(`project-${data.projectId}`).emit("project-chat-message", data.message);
    });

    socket.on("project-layer-sync", (data) => {
      // data: { projectId: string, layers: array }
      socket.to(`project-${data.projectId}`).emit("project-layer-update", data.layers);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // We'd need to track rooms per socket to emit specific removes, 
      // but broadcast remove for now as a fallback.
      socket.broadcast.emit("cursor-remove", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
