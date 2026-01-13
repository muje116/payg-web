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
    <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-white tracking-tight">Image Asset</h2>
        <p className="text-gray-400">Add a high-resolution visual to your media library</p>
      </div>

      <div className="bg-gray-800/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-colors duration-700"></div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Asset Title</label>
            <input name="title" type="text" placeholder="Majestic Cathedral Sunset" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none text-white placeholder-gray-600 transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Static Resource File</label>
            <div className="relative group/file">
              <input
                type="file"
                accept="image/*"
                onChange={e => setFile(e.target.files[0])}
                className="hidden"
                id="image-asset-upload"
              />
              <label
                htmlFor="image-asset-upload"
                className="flex flex-col items-center justify-center w-full h-40 px-6 py-4 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-pink-500/50 transition-all"
              >
                <div className="flex flex-col items-center space-y-3 text-gray-400 group-hover/file:text-white transition-colors">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-bold">{file ? file.name : "Drop file here or click to browse"}</span>
                  <p className="text-[10px] uppercase tracking-widest text-gray-600">Supports JPG, PNG, WEBP</p>
                </div>
              </label>
            </div>
          </div>

          <button
            disabled={submitting}
            type="submit"
            className="w-full py-5 bg-pink-600 hover:bg-pink-500 text-white font-black rounded-2xl shadow-xl shadow-pink-500/20 active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Uploading Asset...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                </svg>
                <span>Deploy Static Resource</span>
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
