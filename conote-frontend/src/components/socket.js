import { io } from "socket.io-client";

const socket = io("https://conote-backend.onrender.com", {
  transports: ["websocket"],
  autoConnect: false, // you control when it connects
});

export const joinNoteRoom = (noteId, user) => {
  socket.connect();
  socket.emit("joinNote", { noteId, user });
};

export const leaveNoteRoom = () => {
  socket.disconnect();
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

export default socket;
