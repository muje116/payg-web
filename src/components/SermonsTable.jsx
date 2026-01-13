import React, { useContext } from "react";
import AudioPlayer from "./AudioPlayer";
import { AppContext } from "../contexts/AppContext";

export default function SermonsTable({ sermons, onEdit, onDelete, page = 1, pageSize = 10, total = 0, onPageChange }) {
  const { addToPlaylist, toggleFavorite, isFavorite } = useContext(AppContext);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pagedSermons = sermons.slice(start, end);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Cover</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Preacher</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Audio</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pagedSermons.map((sermon) => (
              <tr key={sermon.id} className="hover:bg-white/5 transition-all duration-300 group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-12 w-12 rounded-xl overflow-hidden shadow-xl border border-white/10 group-hover:scale-110 transition-transform">
                    <img src={sermon.imageUrl || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80"} alt="" className="h-full w-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{sermon.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-400">{sermon.preacher}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sermon.dateLoaded).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <AudioPlayer src={sermon.sermonLink} title={sermon.title} className="w-48 scale-90" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleFavorite(sermon)}
                      className={`p-2 rounded-lg transition-all ${isFavorite(sermon.id) ? 'text-rose-500 bg-rose-500/10' : 'text-gray-400 hover:text-rose-500 hover:bg-white/5'}`}
                      title="Favorite"
                    >
                      <svg className={`w-5 h-5 ${isFavorite(sermon.id) ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => addToPlaylist(sermon)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white/5 rounded-lg transition-all"
                      title="Add to Playlist"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <div className="h-4 w-px bg-white/10 mx-1"></div>
                    <button
                      onClick={() => onEdit(sermon)}
                      className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-all"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(sermon)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-white/5 rounded-lg transition-all"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-6 border-t border-white/5 flex items-center justify-between text-gray-400">
          <p className="text-sm">Page {page} of {totalPages}</p>
          <div className="flex space-x-2">
            <button
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-xl transition-all font-bold text-xs"
            >
              Previous
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-xl transition-all font-bold text-xs"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
