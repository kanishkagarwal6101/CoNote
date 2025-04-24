import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  joinNoteRoom,
  leaveNoteRoom,
  emitNoteEdit,
  listenNoteUpdates,
  listenActiveUsers,
  removeSocketListeners,
} from "../socket";

const NotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [note, setNote] = useState({ title: "", content: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate(`/login?redirect=${location.pathname}`);
      return;
    }

    const loadData = async () => {
      try {
        await axios.post(
          `https://conote-backend.onrender.com/api/notes/${id}/collaborate`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const [noteRes, userRes] = await Promise.all([
          axios.get(`https://conote-backend.onrender.com/api/notes/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://conote-backend.onrender.com/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setNote(noteRes.data);

        // ✅ Join socket and listen for updates
        joinNoteRoom(id, {
          userId: userRes.data._id,
          name: userRes.data.name,
        });

        listenNoteUpdates(({ title, content }) => {
          setNote({ title, content });
        });

        listenActiveUsers((users) => {
          setActiveUsers(users);
        });
      } catch (err) {
        console.error("Error loading note:", err);
        alert("Error loading note or user.");
        navigate("/dashboard");
      }
    };

    loadData();

    return () => {
      leaveNoteRoom();
      removeSocketListeners();
    };
  }, [id, token, navigate, location.pathname]);

  const handleChange = (e) => {
    const updatedNote = { ...note, [e.target.name]: e.target.value };
    setNote(updatedNote);
    emitNoteEdit(id, updatedNote);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(
        `https://conote-backend.onrender.com/api/notes/${id}`,
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
