import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [notes, setNotes] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user name
    axios
      .get("https://62f3-3-147-9-79.ngrok-free.app/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserName(res.data.name))
      .catch(() => alert("Failed to load user details"));

    // Fetch notes
    axios
      .get("https://62f3-3-147-9-79.ngrok-free.app/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setNotes(res.data);
        } else {
          console.error("Notes response is not an array:", res.data);
          setNotes([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load notes:", err);
        alert("Failed to load notes");
        setNotes([]);
      });
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] font-[var(--font-family)] p-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {userName ? `Hello, ${userName}!` : "Loading..."}
        </h1>
        <Link
          to="/note/new"
          className="bg-[var(--text)] text-[var(--background)] px-6 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition"
        >
          + Create New Note
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md border-2 border-black hover:scale-105 transition"
        >
          Logout
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl place-items-center">
        {Array.isArray(notes) &&
          notes.map((note) => (
            <Link
              key={note._id}
              to={`/note/${note._id}`}
              className="w-[350px] h-[235px] p-6 bg-white rounded-2xl shadow-lg cursor-pointer transition-transform hover:scale-105 bg-gradient-to-b from-yellow-100 to-white flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold">{note.title}</h2>
                <p className="text-sm text-gray-600">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm text-gray-700 mt-4">
                {note.content.substring(0, 80)}...
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Dashboard;
