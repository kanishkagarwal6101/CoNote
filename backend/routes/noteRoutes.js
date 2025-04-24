import express from "express";
import Note from "../models/Notes.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create a new note
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const newNote = new Note({ userId: req.user, title, content });
    await newNote.save();

    res
      .status(201)
      .json({ message: "Note created successfully", note: newNote });
  } catch (err) {
    console.error("❌ Server Error in Note Creation:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get all notes (own + collaborated)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const notes = await Note.find({
      $or: [{ userId }, { collaborators: userId }],
    }).sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    console.error("❌ Server Error in Fetching Notes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get a single note (if owner or collaborator)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    const isOwner = note.userId.toString() === req.user;
    const isCollaborator = note.collaborators.some(
      (id) => id.toString() === req.user
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(note);
  } catch (err) {
    console.error("❌ Server Error in Fetching Single Note:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update a note (only owner)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { $set: req.body },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note updated successfully", note });
  } catch (err) {
    console.error("❌ Server Error in Updating Note:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete a note (only owner)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user,
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("❌ Server Error in Deleting Note:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Collaborate via shared link
router.post("/:id/collaborate", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: "Note not found" });

    const alreadyAdded =
      note.userId.toString() === req.user ||
      note.collaborators.includes(req.user);

    if (alreadyAdded)
      return res.status(200).json({ msg: "Already a collaborator" });

    note.collaborators.push(req.user);
    await note.save();

    res.json({ msg: "Added as collaborator", note });
  } catch (err) {
    console.error("❌ Error in collaborator route:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
