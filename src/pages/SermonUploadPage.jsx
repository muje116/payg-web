import React, { useState } from "react";
import { postSermon } from "../api/sermons";
import Sidebar from "../components/Sidebar";

export default function SermonUploadPage() {
  const [form, setForm] = useState({ title: "", dateLoaded: "", preacher: "", sermonLink: "", imageUrl: "" });
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
      await postSermon(form);
      setSuccess("Sermon uploaded!");
      setForm({ title: "", dateLoaded: "", preacher: "", sermonLink: "", imageUrl: "" });
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
          <h2 className="text-2xl font-extrabold text-blue-800 mb-6 text-center drop-shadow">Upload Sermon</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input name="title" type="text" placeholder="Title" value={form.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 transition placeholder-gray-400 shadow-sm" />
            <input name="dateLoaded" type="datetime-local" value={form.dateLoaded} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 transition placeholder-gray-400 shadow-sm" />
            <input name="preacher" type="text" placeholder="Preacher" value={form.preacher} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 transition placeholder-gray-400 shadow-sm" />
            <input name="sermonLink" type="url" placeholder="Sermon MP3 URL" value={form.sermonLink} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 transition placeholder-gray-400 shadow-sm" />
            <input name="imageUrl" type="url" placeholder="Cover Image URL (optional)" value={form.imageUrl} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 transition placeholder-gray-400 shadow-sm" />
            <button disabled={submitting} type="submit" className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all duration-150">{submitting ? 'Uploading...' : 'Upload'}</button>
          </form>
          {error && <div className="text-red-500 mt-4 text-center animate-pulse">{error}</div>}
          {success && <div className="text-green-600 mt-4 text-center animate-fade-in">{success}</div>}
        </div>
      </main>
    </div>
  );
}
