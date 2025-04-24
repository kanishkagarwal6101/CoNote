import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Creator
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ New field
});

const Note = mongoose.model("Note", NoteSchema);
export default Note;
