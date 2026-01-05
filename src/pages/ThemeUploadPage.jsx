import React, { useState } from "react";
import { postTheme } from "../api/themes";
import Sidebar from "../components/Sidebar";

export default function ThemeUploadPage() {
  const [form, setForm] = useState({ title: "", date: "", content: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");
    try {
      await postTheme(form);
      setSuccess("Theme uploaded!");
      setForm({ title: "", date: "", content: "" });
    } catch {
      setError("Upload failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg mx-auto bg-white/60 rounded-2xl shadow-2xl p-8 backdrop-blur-lg border border-white/30">
          <h2 className="text-2xl font-extrabold text-indigo-800 mb-6 text-center drop-shadow">Upload Theme</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="text" placeholder="Title" value={form.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 transition placeholder-gray-400 shadow-sm" />
            <input type="date" placeholder="Date" value={form.date} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 transition placeholder-gray-400 shadow-sm" />
            <textarea placeholder="Content" value={form.content} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 transition placeholder-gray-400 shadow-sm" />
            <button disabled={submitting} type="submit" className="w-full py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-indigo-700 hover:to-blue-700 active:scale-95 transition-all duration-150">{submitting ? 'Uploading...' : 'Upload'}</button>
          </form>
          {error && <div className="text-red-500 mt-4 text-center animate-pulse">{error}</div>}
          {success && <div className="text-green-600 mt-4 text-center animate-fade-in">{success}</div>}
        </div>
      </main>
    </div>
  );
}
