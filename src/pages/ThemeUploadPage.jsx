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
    <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-white tracking-tight">Create Theme</h2>
        <p className="text-gray-400">Establish a new thematic guide for your sermons</p>
      </div>

      <div className="bg-gray-800/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-700"></div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Theme Title</label>
            <input name="title" type="text" placeholder="The Fruit of the Spirit" value={form.title} onChange={handleChange} required className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-gray-600 transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Establishment Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} required className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Theme Description</label>
            <textarea name="content" placeholder="Describe the core message and objectives of this theme..." value={form.content} onChange={handleChange} required className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-gray-600 transition-all min-h-[150px] resize-none" />
          </div>

          <button
            disabled={submitting}
            type="submit"
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Establishing Theme...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                </svg>
                <span>Initialize Theme</span>
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
