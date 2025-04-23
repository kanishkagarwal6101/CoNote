import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewNote = () => {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        "https://62f3-3-147-9-79.ngrok-free.app//api/notes/create",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Note created successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create note");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--text)] p-6">
      <div className="w-full max-w-3xl bg-[#00ffa0] p-8 rounded-xl border-[4px] border-[#05060f] shadow-[8px_8px_0px_0px_#05060f] text-black">
        {/* Header */}
        <h2 className="text-3xl font-bold mb-6">Create a New Note</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title Input */}
          <input
            type="text"
            name="title"
            placeholder="Enter note title..."
            className="w-full p-3 border-2 border-black rounded-md bg-transparent focus:outline-none"
            onChange={handleChange}
            required
          />

          {/* Content Input */}
          <textarea
            name="content"
            placeholder="Write your note here..."
            className="w-full p-3 border-2 border-black rounded-md bg-transparent focus:outline-none"
            rows="6"
            onChange={handleChange}
            required
          />

          {/* Error Message */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-md shadow-md border-2 border-black hover:scale-105 transition"
            >
              Save Note
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-red-600 text-white rounded-md shadow-md border-2 border-black hover:scale-105 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewNote;
