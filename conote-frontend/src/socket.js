import { io } from "socket.io-client";

// Create one socket instance only once
const socket = io("https://conote-backend.onrender.com", {
  transports: ["websocket"],
  autoConnect: false,
});

let currentNoteId = null;

export const connectSocket = () => {
  if (!socket.connected) socket.connect();
};

export const joinNoteRoom = (noteId, user) => {
  connectSocket();
  currentNoteId = noteId;
  socket.emit("joinNote", { noteId, user });
};

export const leaveNoteRoom = () => {
  if (currentNoteId) socket.emit("leaveNote", currentNoteId);
};

export const emitNoteEdit = (noteId, updatedNote) => {
  socket.emit("editNote", { noteId, ...updatedNote });
};

export const listenNoteUpdates = (callback) => {
  socket.on("noteUpdated", callback);
};

export const listenActiveUsers = (callback) => {
  socket.on("activeUsers", callback);
};

export const removeSocketListeners = () => {
  socket.off("noteUpdated");
  socket.off("activeUsers");
};
