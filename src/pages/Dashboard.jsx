import React, { useEffect, useState, useContext } from "react";
import { getSermons } from "../api/sermons";
import { getThemes } from "../api/themes";
import { getImages } from "../api/images";
import { AppContext } from "../contexts/AppContext";

export default function Dashboard() {
  const [sermonCount, setSermonCount] = useState(0);
  const [themeCount, setThemeCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const { playlist, favorites, removeFromPlaylist, toggleFavorite } = useContext(AppContext);

  useEffect(() => {
    async function loadCounts() {
      try {
        const [sermonsRes, themesRes, imagesRes] = await Promise.all([
          getSermons().catch(() => ({ data: [] })),
          getThemes().catch(() => ({ data: [] })),
          getImages().catch(() => ({ data: [] })),
        ]);
        const sermons = sermonsRes.data || [];
        const themes = themesRes.data || [];
        const images = imagesRes.data || [];
        setSermonCount(Array.isArray(sermons) ? sermons.length : 0);
        setThemeCount(Array.isArray(themes) ? themes.filter(t => !t.voided).length : 0);
        setImageCount(Array.isArray(images) ? images.length : 0);
      } catch (e) {
        // ignore errors for now
      }
    }
    loadCounts();
  }, []);

  return (
    <div className="space-y-10">
      {/* Stats Cards with Premium Look */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Total Sermons", count: sermonCount, icon: "M9 19V6h6v13m-6 0a2 2 0 01-2-2V6a2 2 0 012-2h6a2 2 0 012 2v11a2 2 0 01-2 2m-6 0h6", color: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20" },
          { label: "Active Themes", count: themeCount, icon: "M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 0a8 8 0 110 16 8 8 0 010-16z", color: "from-purple-500 to-indigo-500", shadow: "shadow-purple-500/20" },
          { label: "Total Images", count: imageCount, icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", color: "from-pink-500 to-rose-500", shadow: "shadow-pink-500/20" },
          { label: "User Views", count: "2.4K", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", color: "from-orange-500 to-amber-500", shadow: "shadow-orange-500/20" }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-white/5 ${stat.shadow} hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 -mr-4 -mt-4 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}></div>
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-4xl font-black text-white tracking-tight">{stat.count}</h3>
              </div>
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Playlist Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Your Playlist</h3>
                <p className="text-gray-400 text-sm">Continue where you left off</p>
              </div>
              <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
                {playlist.length} Items
              </span>
            </div>
            <div className="p-4">
              {playlist.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {playlist.map((sermon) => (
                    <div key={sermon.id} className="group flex items-center p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-white/10">
                      <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-700 mr-6 shadow-xl relative group-hover:scale-105 transition-transform">
                        <img
                          src={sermon.imageUrl || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80"}
                          alt={sermon.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold truncate group-hover:text-blue-400 transition-colors">{sermon.title}</h4>
                        <p className="text-gray-400 text-sm">{sermon.preacher}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => toggleFavorite(sermon)}
                          className={`p-2 rounded-xl transition-all duration-300 ${favorites.find(f => f.id === sermon.id) ? 'text-rose-500 bg-rose-500/10' : 'text-gray-500 hover:text-rose-500 bg-white/5'}`}
                        >
                          <svg className={`w-6 h-6 ${favorites.find(f => f.id === sermon.id) ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeFromPlaylist(sermon.id)}
                          className="p-2 bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-xl transition-all duration-300"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-600">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold">Your playlist is empty</p>
                    <p className="text-gray-400 text-sm">Add sermons from the library to build your collection</p>
                    <a href="/sermons" className="mt-4 inline-block text-blue-400 font-bold hover:text-blue-300 transition-colors">Browse Sermons &rarr;</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-8">
          {/* Favorites List */}
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-rose-500/10 to-transparent">
              <h3 className="text-xl font-bold text-white">Favorites</h3>
              <svg className="w-6 h-6 text-rose-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className="p-6">
              {favorites.length > 0 ? (
                <div className="space-y-4">
                  {favorites.slice(0, 5).map((fav) => (
                    <div key={fav.id} className="flex items-center space-x-4 group cursor-pointer p-2 rounded-2xl hover:bg-white/5 transition-all">
                      <div className="h-12 w-12 rounded-xl bg-gray-700 overflow-hidden ring-2 ring-transparent group-hover:ring-rose-500/50 transition-all">
                        <img src={fav.imageUrl || "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80"} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-bold truncate group-hover:text-rose-400 transition-colors">{fav.title}</p>
                        <p className="text-gray-500 text-xs truncate">Added Recently</p>
                      </div>
                    </div>
                  ))}
                  {favorites.length > 5 && (
                    <button className="w-full py-3 text-gray-400 text-sm font-bold hover:text-white transition-colors text-center border-t border-white/5 mt-4">
                      View all {favorites.length} favorites
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 opacity-50">
                  <p className="text-gray-400 text-sm italic">Nothing saved yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats/Actions */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L1 21h22L12 2zm0 3.45l8.15 14.1H3.85L12 5.45z" />
              </svg>
            </div>
            <div className="relative">
              <h4 className="text-xl font-black mb-4">Go Premium</h4>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">Unlock advanced features, infinite playlists, and offline sermons.</p>
              <button className="w-full py-4 bg-white text-blue-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-xl">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
