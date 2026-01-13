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
    <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-white tracking-tight">Upload Sermon</h2>
        <p className="text-gray-400">Add a new spiritual message to the global library</p>
      </div>

      <div className="bg-gray-800/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-700"></div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Sermon Title</label>
              <input name="title" type="text" placeholder="The Grace of God" value={form.title} onChange={handleChange} required className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-600 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Preacher</label>
              <input name="preacher" type="text" placeholder="Pastor John Doe" value={form.preacher} onChange={handleChange} required className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-600 transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Recording Date</label>
            <input name="dateLoaded" type="datetime-local" value={form.dateLoaded} onChange={handleChange} required className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Audio Source URL</label>
            <div className="relative">
              <input name="sermonLink" type="url" placeholder="https://cdn.church.org/audio/message.mp3" value={form.sermonLink} onChange={handleChange} required className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-600 transition-all" />
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Cover Artwork</label>
            <div className="relative group/file">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="sermon-file-upload"
              />
              <label
                htmlFor="sermon-file-upload"
                className="flex flex-col items-center justify-center w-full h-32 px-6 py-4 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-center space-x-3 text-gray-400 group-hover/file:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-bold">{selectedFile ? selectedFile.name : "Select cover image..."}</span>
                </div>
              </label>
            </div>
          </div>

          <button
            disabled={submitting}
            type="submit"
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Syncing with server...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                </svg>
                <span>Publish Sermon Record</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-8 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center space-x-3 text-rose-400 animate-in shake duration-500">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center space-x-3 text-emerald-400 animate-in zoom-in-95 duration-500">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-bold">{success}</span>
          </div>
        )}
      </div>
    </div>
  );
}
