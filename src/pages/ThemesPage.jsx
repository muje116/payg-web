import React, { useEffect, useState } from "react";
import { getThemes, postTheme, putTheme, deleteTheme } from "../api/themes";
import { getSermonsPerTheme } from "../api/sermons";
import Loader from "../components/Loader";
import ThemeForm from "../components/ThemeForm";
import ThemeCard from "../components/ThemeCard";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Plus, Search, Folder } from "lucide-react";
import { usePlayer } from "../contexts/PlayerContext";

export default function ThemesPage() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTheme, setEditTheme] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [themeSermons, setThemeSermons] = useState([]);
  const [sermonsLoading, setSermonsLoading] = useState(false);

  const { playTrack, addToQueue } = usePlayer();

  useEffect(() => {
    fetchThemes();
  }, []);

  useEffect(() => {
    if (selectedTheme) {
      fetchSermonsForTheme(selectedTheme.id);
    }
  }, [selectedTheme]);

  async function fetchThemes() {
    setLoading(true);
    setError("");
    try {
      const res = await getThemes();
      setThemes(res.data);
    } catch {
      setError("Failed to load themes");
    }
    setLoading(false);
  }

  async function fetchSermonsForTheme(themeId) {
    setSermonsLoading(true);
    try {
      const res = await getSermonsPerTheme(themeId);
      setThemeSermons(res.data);
    } catch {
      console.error("Failed to load sermons for theme");
    }
    setSermonsLoading(false);
  }

  function handleAdd() {
    setEditTheme(null);
    setShowModal(true);
  }

  function handleEdit(theme) {
    setEditTheme(theme);
    setShowModal(true);
  }

  async function handleDelete(theme) {
    if (!window.confirm(`Delete theme: ${theme.name}?`)) return;
    setActionLoading(true);
    setError("");
    try {
      await deleteTheme(theme.id);
      setThemes(ts => ts.filter(t => t.id !== theme.id));
      if (selectedTheme?.id === theme.id) setSelectedTheme(null);
    } catch {
      setError("Failed to delete theme");
    }
    setActionLoading(false);
  }

  async function handleSubmit(form) {
    setActionLoading(true);
    setError("");
    try {
      if (editTheme) {
        await putTheme(editTheme.id, form);
        setThemes(ts => ts.map(t => t.id === editTheme.id ? { ...form, id: editTheme.id } : t));
      } else {
        const res = await postTheme(form);
        setThemes(ts => [...ts, res.data]);
      }
      setShowModal(false);
    } catch {
      setError("Failed to save theme");
    }
    setActionLoading(false);
  }

  const filteredThemes = themes.filter(t => 
    (t.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (t.addedBy || "").toLowerCase().includes(search.toLowerCase())
  );

  const playSermon = (sermon) => {
     playTrack({
         id: sermon.id,
         title: sermon.title,
         artist: sermon.speaker || sermon.preacher || 'Unknown Speaker',
         url: sermon.sermonLink || sermon.audioUrl, 
         image: sermon.imageUrl || null
     });
  };

  return (
    <div className="space-y-8 min-h-[calc(100vh-100px)]">
      <AnimatePresence mode="wait">
        {!selectedTheme ? (
          <motion.div 
            key="themes-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black text-white tracking-tight">Themes & Playlists</h2>
                <p className="text-gray-400 mt-1">Manage and organize your sermon collections</p>
              </div>
              <button
                onClick={handleAdd}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Create New Theme</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search themes..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {loading ? (
              <Loader />
            ) : filteredThemes.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-600">
                  <Folder size={32} className="text-gray-500" />
                </div>
                <p className="text-gray-400 font-bold">No themes found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or create a new theme</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredThemes.map(theme => (
                  <ThemeCard 
                    key={theme.id} 
                    theme={theme} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                    onClick={() => setSelectedTheme(theme)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="theme-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {/* Back Button & Header */}
            <div className="flex items-center space-x-4">
               <button 
                 onClick={() => setSelectedTheme(null)}
                 className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
               >
                 <ArrowLeft size={24} />
               </button>
               <div>
                 <h2 className="text-3xl font-bold text-white">{selectedTheme.name}</h2>
                 <p className="text-gray-400">Playlist by {selectedTheme.addedBy}</p>
               </div>
            </div>

            {/* Playlist Content */}
            {sermonsLoading ? (
               <Loader />
            ) : themeSermons.length === 0 ? (
               <div className="text-center py-20 text-gray-500">
                 <p>No sermons found in this theme.</p>
               </div>
            ) : (
               <div className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden">
                 <table className="w-full text-left">
                   <thead className="bg-gray-900/50 text-gray-400 text-sm uppercase">
                     <tr>
                       <th className="px-6 py-4 font-medium">#</th>
                       <th className="px-6 py-4 font-medium">Title</th>
                       <th className="px-6 py-4 font-medium">Speaker</th>
                       <th className="px-6 py-4 font-medium text-right">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-700">
                     {themeSermons.map((sermon, index) => (
                       <tr key={sermon.id} className="hover:bg-gray-700/50 transition-colors group">
                         <td className="px-6 py-4 text-gray-500 w-12 text-center">
                           <span className="group-hover:hidden">{index + 1}</span>
                           <button onClick={() => playSermon(sermon)} className="hidden group-hover:inline-block text-indigo-400 hover:text-white">
                             <Play size={16} fill="currentColor" />
                           </button>
                         </td>
                         <td className="px-6 py-4 text-white font-medium">{sermon.title}</td>
                         <td className="px-6 py-4 text-gray-400">{sermon.speaker || 'Unknown'}</td>
                         <td className="px-6 py-4 text-right">
                           <button 
                             onClick={() => addToQueue({
                                 id: sermon.id,
                                 title: sermon.title,
                                 artist: sermon.speaker || sermon.preacher,
                                 url: sermon.sermonLink || sermon.audioUrl,
                                 image: sermon.imageUrl
                             })}
                             className="text-xs border border-gray-600 hover:border-indigo-500 text-gray-400 hover:text-indigo-400 px-3 py-1 rounded-full transition-all"
                           >
                             Add to Queue
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal (Keep existing logic) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">{editTheme ? "Edit Theme" : "Create Theme"}</h3>
            <ThemeForm 
              initial={editTheme} 
              onSubmit={handleSubmit} 
              onCancel={() => setShowModal(false)} 
              loading={actionLoading}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-24 right-8 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-4">
          {error}
        </div>
      )}
    </div>
  );
}
