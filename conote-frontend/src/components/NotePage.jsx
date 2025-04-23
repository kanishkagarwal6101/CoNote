import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("wss://7fcd-3-147-9-79.ngrok-free.app", {
  transports: ["websocket"],
});

const NotePage = () => {
  const { id } = useParams(); // note ID
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [note, setNote] = useState({ title: "", content: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]); // 👥 For presence

  useEffect(() => {
    if (!token) {
      navigate(`/login?redirect=${location.pathname}`);
      return;
    }

    const loadNoteAndUser = async () => {
      try {
        const [noteRes, userRes] = await Promise.all([
          axios.get(`https://7fcd-3-147-9-79.ngrok-free.app/api/notes/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://7fcd-3-147-9-79.ngrok-free.app/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setNote(noteRes.data);

        // 🧠 Emit join event with user info
        socket.emit("joinNote", {
          noteId: id,
          user: { userId: userRes.data._id, name: userRes.data.name },
        });
      } catch (err) {
        alert("Error loading note or user.");
        navigate("/dashboard");
      }
    };

    loadNoteAndUser();

    // 👀 Listen for real-time updates
    socket.on("noteUpdated", ({ title, content }) => {
      setNote({ title, content });
    });

    socket.on("activeUsers", (users) => {
      setActiveUsers(users);
    });

    return () => {
      socket.off("noteUpdated");
      socket.off("activeUsers");
    };
  }, [id, token, navigate, location.pathname]);

  const handleChange = (e) => {
    const updatedNote = { ...note, [e.target.name]: e.target.value };
    setNote(updatedNote);
    socket.emit("editNote", { noteId: id, ...updatedNote });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(
        `https://7fcd-3-147-9-79.ngrok-free.app/api/notes/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Note deleted successfully!");
      navigate("/dashboard");
    } catch {
      alert("Failed to delete note");
    }
  };

  const handleShare = () => {
    const noteURL = `${window.location.origin}/note/${id}`;
    navigator.clipboard.writeText(noteURL).then(() => {
      alert("Note link copied! Share it with collaborators.");
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--text)] p-6">
      {/* 🔄 Active Users Section */}
      <div className="w-full max-w-3xl mb-4 text-left text-sm">
        <button
          onClick={() => navigate("/dashboard")}
          className="self-start mb-4 px-4 py-2 bg-gray-800 text-white rounded-md shadow-md border border-black hover:scale-105 transition"
        >
          ← Back to Dashboard
        </button>
        {activeUsers.length > 0 && (
          <div className="bg-white/60 px-4 py-2 rounded-md border border-black shadow">
            <p className="font-semibold">Currently Editing:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {activeUsers.map((user) => (
                <span
                  key={user.userId}
                  className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs border border-green-400"
                >
                  🟢 {user.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🔏 Note Card UI */}
      <div className="w-full max-w-3xl bg-[#00ffa0] p-8 rounded-xl border-[4px] border-[#05060f] shadow-[8px_8px_0px_0px_#05060f] text-black">
        <div className="flex justify-between items-center mb-6">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={note.title}
              onChange={handleChange}
              className="text-3xl font-bold border-b border-black w-full p-2 bg-transparent focus:outline-none"
            />
          ) : (
            <h2 className="text-3xl font-bold">{note.title}</h2>
          )}

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md border-2 border-black hover:scale-105 transition"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* Content Section */}
        {isEditing ? (
          <textarea
            name="content"
            value={note.content}
            onChange={handleChange}
            className="w-full p-3 border-2 border-black rounded-md bg-transparent focus:outline-none"
            rows="6"
          />
        ) : (
          <p className="text-lg">{note.content}</p>
        )}

        {/* Actions */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleShare}
            className="px-6 py-3 bg-yellow-500 text-black rounded-md shadow-md border-2 border-black hover:scale-105 transition"
          >
            Share with Users
          </button>

          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 bg-green-600 text-white rounded-md shadow-md border-2 border-black hover:scale-105 transition"
            >
              Save Changes
            </button>
          )}

          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-600 text-white rounded-md shadow-md border-2 border-black hover:scale-105 transition"
          >
            Delete Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotePage;
