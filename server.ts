import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Basic in-memory db for auth fallback since Firebase was declined
const users = new Map<string, any>();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-local-dev";

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

  // Middleware
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Authentication API
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, name } = req.body;
      if (users.has(email)) {
        return res.status(400).json({ error: "Email already exists" });
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const user = {
        id: Math.random().toString(36).substring(2, 10),
        email,
        password: hashedPassword,
        name,
        projects: []
      };
      
      users.set(email, user);
      
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = users.get(email);
      
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch(e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Profile / Projects
  app.get("/api/user/profile", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      let userDetails = null;
      for (const user of users.values()) {
        if (user.id === decoded.id) {
          userDetails = user;
          break;
        }
      }
      if (!userDetails) return res.status(404).json({ error: "User not found" });
      
      res.json({ 
        id: userDetails.id, 
        email: userDetails.email, 
        name: userDetails.name, 
        projects: userDetails.projects 
      });
    } catch(e) {
      res.status(401).json({ error: "Invalid token" });
    }
  });

  app.post("/api/user/projects", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const { project } = req.body;
      let userDetails = null;
      for (const user of users.values()) {
        if (user.id === decoded.id) {
          userDetails = user;
          break;
        }
      }
      
      if (userDetails) {
        // Just store a snapshot string or metadata
        userDetails.projects.push({ ...project, id: Math.random().toString(36).substring(2, 10) });
        res.json({ success: true, projects: userDetails.projects });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch(e) {
      res.status(401).json({ error: "Invalid token" });
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

    // Collaboration Session
    socket.on("join-collab", (sessionId, user) => {
      socket.join(`collab-${sessionId}`);
      console.log(`User ${user.name} joined collab session ${sessionId}`);
      io.to(`collab-${sessionId}`).emit("chat-update", { sender: "System", message: `${user.name} joined the session`, time: new Date() });
    });

    socket.on("leave-collab", (sessionId, user) => {
      socket.leave(`collab-${sessionId}`);
      io.to(`collab-${sessionId}`).emit("chat-update", { sender: "System", message: `${user.name} left the session`, time: new Date() });
    });

    socket.on("collab-cursor-move", (data) => {
      // data: { sessionId, userId, name, position: [x,y,z], color }
      socket.to(`collab-${data.sessionId}`).emit("collab-cursor-update", {
        userId: data.userId,
        name: data.name,
        position: data.position,
        color: data.color
      });
    });

    socket.on("collab-chat-message", (data) => {
      // data: { sessionId, sender, message, time }
      io.to(`collab-${data.sessionId}`).emit("chat-update", {
        sender: data.sender,
        message: data.message,
        time: data.time
      });
    });

    socket.on("collab-scene-update", (data) => {
      // Sync 3D objects
      socket.to(`collab-${data.sessionId}`).emit("scene-update", data.objects);
    });

    // Retro-compatibility with earlier arenas
    socket.on("join-arena", (arenaId) => {
      socket.join(arenaId);
    });

    socket.on("cursor-move", (data) => {
      socket.to(data.arenaId).emit("cursor-update", {
        userId: socket.id,
        position: data.position
      });
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

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      socket.broadcast.emit("cursor-remove", socket.id);
      socket.broadcast.emit("collab-cursor-remove", socket.id);
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
