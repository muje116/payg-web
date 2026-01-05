import React, { useState } from "react";
import { uploadImage } from "../api/images";
import Sidebar from "../components/Sidebar";

export default function ImageUploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => setFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");
    const data = new FormData();
    if (title) data.append("title", title);
    if (file) data.append("image", file);
    try {
      await uploadImage(data);
      setSuccess("Image uploaded!");
      setTitle("");
      setFile(null);
    } catch (e) {
      setError("Upload failed.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg mx-auto bg-white/60 rounded-2xl shadow-2xl p-8 backdrop-blur-lg border border-white/30">
          <h2 className="text-2xl font-extrabold text-pink-800 mb-6 text-center drop-shadow">Upload Image</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/80 transition placeholder-gray-400 shadow-sm" />
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/80" />
            <button disabled={submitting} type="submit" className="w-full py-2 bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-pink-700 hover:to-indigo-700 active:scale-95 transition-all duration-150">{submitting ? 'Uploading...' : 'Upload'}</button>
          </form>
          {error && <div className="text-red-500 mt-4 text-center animate-pulse">{error}</div>}
          {success && <div className="text-green-600 mt-4 text-center animate-fade-in">{success}</div>}
        </div>
      </main>
    </div>
  );
}
