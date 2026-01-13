import React from "react";

export default function ImageCard({ image }) {
  return (
    <div className="group relative bg-gray-800/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="aspect-square overflow-hidden relative">
        <img
          src={image.url}
          alt={image.title || "PAYG"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

        {/* Quick Actions Overlay */}
        <div className="absolute top-4 right-4 flex space-x-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button className="p-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl text-white transition-colors border border-white/10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors uppercase tracking-wider">{image.title || "Untitled Asset"}</h3>
        <p className="text-[10px] font-black text-gray-500 mt-1 uppercase tracking-widest">Image Content</p>
      </div>
    </div>
  );
}
