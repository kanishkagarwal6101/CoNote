import express from "express";
import Note from "../models/Notes.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create a new note
router.post("/create", authMiddleware, async (req, res) => {
  try {
    console.log("✅ Received request to create note");
    console.log("User ID from token:", req.user);
    console.log("Request Body:", req.body);

    const { title, content } = req.body;
    if (!title || !content) {
      console.log("❌ Missing title or content");
      return res.status(400).json({ error: "Title and content are required" });
    }

    const newNote = new Note({ userId: req.user, title, content });
    await newNote.save();

    console.log("✅ Note successfully created:", newNote);
    res
      .status(201)
      .json({ message: "Note created successfully", note: newNote });
  } catch (err) {
    console.error("❌ Server Error in Note Creation:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("✅ Fetching all notes for user:", req.user);

    const userId = req.user;
    const notes = await Note.find({ userId }).sort({ createdAt: -1 });

    console.log("✅ Notes found:", notes.length);
    res.json(notes);
  } catch (err) {
    console.error("❌ Server Error in Fetching Notes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get a single note by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("✅ Fetching note:", req.params.id, "for user:", req.user);

    const note = await Note.findOne({ _id: req.params.id, userId: req.user });

    if (!note) {
      console.log("❌ Note not found");
      return res.status(404).json({ error: "Note not found" });
    }

    console.log("✅ Note found:", note);
    res.json(note);
  } catch (err) {
    console.error("❌ Server Error in Fetching Single Note:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update a note
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("✅ Updating note:", req.params.id, "for user:", req.user);
    console.log("New data:", req.body);

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      { $set: req.body },
      { new: true }
    );

    if (!note) {
      console.log("❌ Note not found for update");
      return res.status(404).json({ error: "Note not found" });
    }

    console.log("✅ Note updated successfully:", note);
    res.json({ message: "Note updated successfully", note });
  } catch (err) {
    console.error("❌ Server Error in Updating Note:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete a note
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("✅ Deleting note:", req.params.id, "for user:", req.user);

    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user,
    });

    if (!note) {
      console.log("❌ Note not found for deletion");
      return res.status(404).json({ error: "Note not found" });
    }

    console.log("✅ Note deleted successfully:", note);
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("❌ Server Error in Deleting Note:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
