import React, { useEffect, useState } from "react";
import { getImages } from "../api/images";
import Loader from "../components/Loader";
import Gallery from "../components/Gallery";
// Sidebar not used on this page; using top nav to match Sermons layout

export default function ImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setError("");
      try {
        const res = await getImages();
        setImages(res.data);
      } catch (e) {
        setError("Failed to load images");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Image Assets</h2>
          <p className="text-gray-400 mt-1">Manage high-quality visuals for your sermons</p>
        </div>
        <a
          href="/images/upload"
          className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-pink-500/20 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>Upload Image</span>
        </a>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center space-x-3 text-rose-400">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-bold">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-20 flex flex-col items-center justify-center space-y-4 border border-white/5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/5 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-400 font-bold animate-pulse">Developing the negatives...</p>
        </div>
      ) : (
        <div className="bg-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-white/5">
          <Gallery images={images} />
        </div>
      )}
    </div>
  );
}
