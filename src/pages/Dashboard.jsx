import React, { useEffect, useState, useContext } from "react";
import { getSermons } from "../api/sermons";
import { getThemes } from "../api/themes";
import { getImages } from "../api/images";
import { AppContext } from "../contexts/AppContext";
import { usePlayer } from "../contexts/PlayerContext";
import { Play, Plus, Trash2, Heart, BarChart2, Folder, Image, Users } from "lucide-react";

export default function Dashboard() {
  const [sermonCount, setSermonCount] = useState(0);
  const [themeCount, setThemeCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const { playlist, favorites, removeFromPlaylist, toggleFavorite } = useContext(AppContext);
  const { playTrack, addToQueue } = usePlayer();

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

  const handlePlay = (sermon) => {
    playTrack({
      id: sermon.id,
      title: sermon.title,
      artist: sermon.preacher || sermon.speaker || "Unknown Speaker",
      url: sermon.sermonLink || sermon.audioUrl,
      image: sermon.imageUrl
    });
  };

  const handleAddToQueue = (sermon) => {
    addToQueue({
      id: sermon.id,
      title: sermon.title,
      artist: sermon.preacher || sermon.speaker || "Unknown Speaker",
      url: sermon.sermonLink || sermon.audioUrl,
      image: sermon.imageUrl
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Stats Cards with Premium Look */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Total Sermons", count: sermonCount, icon: BarChart2, color: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20" },
          { label: "Active Themes", count: themeCount, icon: Folder, color: "from-purple-500 to-indigo-500", shadow: "shadow-purple-500/20" },
          { label: "Total Images", count: imageCount, icon: Image, color: "from-pink-500 to-rose-500", shadow: "shadow-pink-500/20" },
          { label: "User Views", count: "2.4K", icon: Users, color: "from-orange-500 to-amber-500", shadow: "shadow-orange-500/20" }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-white/5 ${stat.shadow} hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 -mr-4 -mt-4 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}></div>
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-4xl font-black text-white tracking-tight">{stat.count}</h3>
              </div>
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500`}>
                <stat.icon className="w-8 h-8 text-white" />
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
                      <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-700 mr-6 shadow-xl relative group-hover:scale-105 transition-transform shrink-0">
                        <img
                          src={sermon.imageUrl || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80"}
                          alt={sermon.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handlePlay(sermon)} className="text-white hover:scale-110 transition-transform">
                                <Play size={24} fill="currentColor" />
                            </button>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 mr-4">
                        <h4 className="text-white font-bold truncate group-hover:text-blue-400 transition-colors">{sermon.title}</h4>
                        <p className="text-gray-400 text-sm">{sermon.preacher}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAddToQueue(sermon)}
                          className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all"
                          title="Add to Queue"
                        >
                          <Plus size={20} />
                        </button>
                        <button
                          onClick={() => toggleFavorite(sermon)}
                          className={`p-2 rounded-xl transition-all duration-300 ${favorites.find(f => f.id === sermon.id) ? 'text-rose-500 bg-rose-500/10' : 'text-gray-500 hover:text-rose-500 hover:bg-white/5'}`}
                        >
                          <Heart size={20} fill={favorites.find(f => f.id === sermon.id) ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={() => removeFromPlaylist(sermon.id)}
                          className="p-2 bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-xl transition-all duration-300"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-600">
                    <Plus size={32} />
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
              <Heart className="text-rose-500 fill-current" size={24} />
            </div>
            <div className="p-6">
              {favorites.length > 0 ? (
                <div className="space-y-4">
                  {favorites.slice(0, 5).map((fav) => (
                    <div key={fav.id} className="flex items-center space-x-4 group cursor-pointer p-2 rounded-2xl hover:bg-white/5 transition-all" onClick={() => handlePlay(fav)}>
                      <div className="h-12 w-12 rounded-xl bg-gray-700 overflow-hidden ring-2 ring-transparent group-hover:ring-rose-500/50 transition-all shrink-0">
                        <img src={fav.imageUrl || "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80"} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-bold truncate group-hover:text-rose-400 transition-colors">{fav.title}</p>
                        <p className="text-gray-500 text-xs truncate">Added Recently</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                          <Play size={16} className="text-white" fill="currentColor" />
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
               <BarChart2 size={128} />
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
