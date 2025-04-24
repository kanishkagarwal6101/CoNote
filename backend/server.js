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

const activeUsersPerNote = {}; // { noteId: { userId: user } }
const socketToUserMap = {}; // socket.id => { noteId, userId }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinNote", ({ noteId, user }) => {
    socket.join(noteId);
    socketToUserMap[socket.id] = { noteId, userId: user.userId };

    if (!activeUsersPerNote[noteId]) {
      activeUsersPerNote[noteId] = {};
    }

    activeUsersPerNote[noteId][user.userId] = user;

    const usersArray = Object.values(activeUsersPerNote[noteId]);
    io.to(noteId).emit("activeUsers", usersArray);
    console.log(`${user.name} joined note ${noteId}`);
  });

  socket.on("editNote", async ({ noteId, title, content }) => {
    console.log("Editing Note:", noteId, title, content);
    await Note.findByIdAndUpdate(noteId, { title, content });
    socket.to(noteId).emit("noteUpdated", { title, content });
  });

  socket.on("disconnect", () => {
    const socketData = socketToUserMap[socket.id];
    if (socketData) {
      const { noteId, userId } = socketData;
      if (activeUsersPerNote[noteId]) {
        delete activeUsersPerNote[noteId][userId];
        const usersArray = Object.values(activeUsersPerNote[noteId]);
        io.to(noteId).emit("activeUsers", usersArray);
        console.log(`User ${userId} disconnected from note ${noteId}`);
      }
      delete socketToUserMap[socket.id];
    }
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
