import React, { useState, useRef } from "react";
import { postSermon, uploadSermonImage, getRecentSermons } from "../api/sermons";
import Sidebar from "../components/Sidebar";

export default function SermonUploadPage() {
  const [form, setForm] = useState({ title: "", dateLoaded: new Date().toISOString().slice(0, 16), preacher: "", sermonLink: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a cover image.");
      return;
    }
    setSubmitting(true);
    setSuccess("");
    setError("");
    try {
      // 1. Post Sermon
      const res = await postSermon(form);
      const sermonId = res.data.id;

      // 2. Upload Image
      const uploadRes = await uploadSermonImage(sermonId, selectedFile);
      const uploadDetails = typeof uploadRes.data === 'string'
        ? uploadRes.data
        : JSON.stringify(uploadRes.data);

      setSuccess(`Sermon uploaded successfully! Image Info: ${uploadDetails}`);
      setForm({ title: "", dateLoaded: new Date().toISOString().slice(0, 16), preacher: "", sermonLink: "" });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data || "Upload failed.";
      setError(`Error: ${msg}`);
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
            <input name="title" type="text" placeholder="Title" value={form.title} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 transition placeholder-gray-400 shadow-sm" />
            <input name="dateLoaded" type="datetime-local" value={form.dateLoaded} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 transition placeholder-gray-400 shadow-sm" />
            <input name="preacher" type="text" placeholder="Preacher" value={form.preacher} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 transition placeholder-gray-400 shadow-sm" />
            <input name="sermonLink" type="url" placeholder="Sermon MP3 URL" value={form.sermonLink} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 transition placeholder-gray-400 shadow-sm" />

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Cover Image *</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <button disabled={submitting} type="submit" className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all duration-150">
              {submitting ? 'Uploading...' : 'Upload'}
            </button>
          </form>
          {error && <div className="text-red-500 mt-4 text-center animate-pulse py-2 px-4 bg-red-50 rounded-lg border border-red-100">{error}</div>}
          {success && <div className="text-green-600 mt-4 text-center animate-fade-in py-2 px-4 bg-green-50 rounded-lg border border-green-100">{success}</div>}
        </div>
      </main>
    </div>
  );
}
