import React, { useContext } from "react";
import { usePlayer } from "../contexts/PlayerContext";
import { AppContext } from "../contexts/AppContext";
import { Play, Heart, Plus, Edit2, Trash2, Calendar, User, ListPlus } from "lucide-react";

export default function SermonsTable({ sermons, onEdit, onDelete, page = 1, pageSize = 10, total = 0, onPageChange }) {
  const { playTrack, addToQueue } = usePlayer();
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
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pagedSermons.map((sermon) => (
              <tr key={sermon.id} className="hover:bg-white/5 transition-all duration-300 group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-12 w-12 rounded-xl overflow-hidden shadow-xl border border-white/10 group-hover:scale-110 transition-transform relative">
                    <img src={sermon.imageUrl || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80"} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => playTrack({
                                id: sermon.id,
                                title: sermon.title,
                                artist: sermon.preacher,
                                url: sermon.sermonLink,
                                image: sermon.imageUrl
                            })}
                            className="text-white hover:scale-110 transition-transform"
                        >
                            <Play size={20} fill="currentColor" />
                        </button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{sermon.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-400">
                    <User size={14} className="mr-1" />
                    {sermon.preacher}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {new Date(sermon.dateLoaded).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleFavorite({
                          id: sermon.id,
                          title: sermon.title,
                          artist: sermon.preacher,
                          url: sermon.sermonLink,
                          image: sermon.imageUrl
                      })}
                      className={`p-2 hover:bg-white/5 rounded-lg transition-all ${isFavorite(sermon.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                      title={isFavorite(sermon.id) ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <Heart size={18} fill={isFavorite(sermon.id) ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={() => addToPlaylist({
                          id: sermon.id,
                          title: sermon.title,
                          artist: sermon.preacher,
                          url: sermon.sermonLink,
                          image: sermon.imageUrl
                      })}
                      className="p-2 text-gray-400 hover:text-green-500 hover:bg-white/5 rounded-lg transition-all"
                      title="Add to Playlist"
                    >
                      <ListPlus size={18} />
                    </button>
                    <button
                      onClick={() => addToQueue({
                          id: sermon.id,
                          title: sermon.title,
                          artist: sermon.preacher,
                          url: sermon.sermonLink,
                          image: sermon.imageUrl
                      })}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white/5 rounded-lg transition-all"
                      title="Add to Queue"
                    >
                      <Plus size={18} />
                    </button>
                    <div className="h-4 w-px bg-white/10 mx-1"></div>
                    <button
                      onClick={() => onEdit(sermon)}
                      className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(sermon)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-white/5 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
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
