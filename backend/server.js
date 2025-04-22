import express from "express";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Note from "./models/Notes.js";
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/noteRoutes.js";
import { Server } from "socket.io";
import cors from "cors";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ CORS Configuration (unchanged)
const corsOptions = {
  origin: "*", // Allow all origins for now (change later for security)
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// ✅ Socket.io for Real-Time Collaboration
const io = new Server(server, {
  cors: corsOptions,
});

const activeUsersPerNote = {}; // { noteId: [{ userId, name }] }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ Join note with user info
  socket.on("joinNote", ({ noteId, user }) => {
    socket.join(noteId);
    socket.noteId = noteId;
    socket.user = user;

    if (!activeUsersPerNote[noteId]) activeUsersPerNote[noteId] = [];

    const alreadyExists = activeUsersPerNote[noteId].some(
      (u) => u.userId === user.userId
    );

    if (!alreadyExists) {
      activeUsersPerNote[noteId].push(user);
    }

    // Broadcast updated list of active users
    io.to(noteId).emit("activeUsers", activeUsersPerNote[noteId]);
    console.log(`${user.name} joined note ${noteId}`);
  });

  // ✅ Handle real-time editing
  socket.on("editNote", async ({ noteId, title, content }) => {
    console.log("Editing Note:", noteId, title, content);

    // Update in DB
    await Note.findByIdAndUpdate(noteId, { title, content });

    // Broadcast update
    socket.to(noteId).emit("noteUpdated", { title, content });
  });

  // ✅ Handle disconnection
  socket.on("disconnect", () => {
    const noteId = socket.noteId;
    const user = socket.user;

    if (noteId && user && activeUsersPerNote[noteId]) {
      activeUsersPerNote[noteId] = activeUsersPerNote[noteId].filter(
        (u) => u.userId !== user.userId
      );
      io.to(noteId).emit("activeUsers", activeUsersPerNote[noteId]);
      console.log(`${user.name} disconnected from note ${noteId}`);
    }

    console.log("User disconnected:", socket.id);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
