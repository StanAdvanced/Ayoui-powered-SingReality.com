import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";

// Initialize Stripe gracefully
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16' as any
  });
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Use JSON parsing for normal API requests
  app.use('/api', express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured in environment" });
    }
    try {
      const { amount, currency = "usd" } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        automatic_payment_methods: { enabled: true },
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
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

    // Advanced WebRTC Live Broadcasting Rooms
    socket.on("join-broadcast", (roomId) => {
      socket.join(`broadcast-${roomId}`);
      console.log(`User ${socket.id} joined broadcast room ${roomId}`);
    });

    socket.on("broadcaster-webrtc-offer", (data) => {
      socket.to(`broadcast-${data.roomId}`).emit("broadcaster-webrtc-offer", {
        from: socket.id,
        offer: data.offer
      });
    });

    socket.on("broadcaster-webrtc-answer", (data) => {
      socket.to(`broadcast-${data.roomId}`).emit("broadcaster-webrtc-answer", {
        from: socket.id,
        answer: data.answer
      });
    });

    socket.on("broadcaster-ice-candidate", (data) => {
      socket.to(`broadcast-${data.roomId}`).emit("broadcaster-ice-candidate", {
        from: socket.id,
        candidate: data.candidate
      });
    });

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

    socket.on("webrtc-offer", (data) => {
      socket.to(data.roomId).emit("webrtc-offer", {
        from: socket.id,
        offer: data.offer
      });
    });

    socket.on("webrtc-answer", (data) => {
      socket.to(data.roomId).emit("webrtc-answer", {
        from: socket.id,
        answer: data.answer
      });
    });

    socket.on("webrtc-ice-candidate", (data) => {
      socket.to(data.roomId).emit("webrtc-ice-candidate", {
        from: socket.id,
        candidate: data.candidate
      });
    });

    socket.on("join-arena", (arenaId) => {
      socket.join(arenaId);
      console.log(`User ${socket.id} joined arena ${arenaId}`);
    });

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

    socket.on("join-project", (projectId) => {
      socket.join(`project-${projectId}`);
      console.log(`User ${socket.id} joined project ${projectId}`);
    });

    socket.on("project-cursor-move", (data) => {
      socket.to(`project-${data.projectId}`).emit("project-cursor-update", {
        id: socket.id,
        x: data.x,
        y: data.y,
        color: data.color,
        name: data.name
      });
    });

    socket.on("project-chat-message", (data) => {
      io.to(`project-${data.projectId}`).emit("project-chat-message", data.message);
    });

    socket.on("project-layer-sync", (data) => {
      socket.to(`project-${data.projectId}`).emit("project-layer-update", data.layers);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
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
