import React, { useEffect, useState } from "react";
import {
  getSermons,
  getRecentSermons,
  getSermonsPerTheme,
  deleteSermon,
  putSermon,
  postSermon,
  uploadSermonImage
} from "../api/sermons";
import { getThemes } from "../api/themes";
import Loader from "../components/Loader";
import SermonsTable from "../components/SermonsTable";
import SermonForm from "../components/SermonForm";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, RefreshCw } from "lucide-react";

export default function SermonsPage() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSermon, setEditSermon] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, recent, theme
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchSermons();
    fetchThemes();
  }, []);

  async function fetchSermons() {
    setLoading(true);
    try {
      const res = await getSermons();
      setSermons(res.data);
    } catch (e) {
      setError("Failed to load sermons");
    }
    setLoading(false);
  }

  async function fetchThemes() {
    try {
      const res = await getThemes();
      setThemes(res.data);
    } catch (e) {
      console.error("Failed to load themes", e);
    }
  }

  async function handleTab(tab) {
    setLoading(true);
    setActiveTab(tab);
    setSelectedTheme("");
    setError("");
    setPage(1);
    try {
      if (tab === "recent") {
        const res = await getRecentSermons();
        setSermons(res.data);
      } else {
        const res = await getSermons();
        setSermons(res.data);
      }
    } catch (e) {
      setError("Failed to load sermons");
    }
    setLoading(false);
  }

  async function handleThemeChange(e) {
    const themeId = e.target.value;
    setSelectedTheme(themeId);
    setActiveTab("theme");
    setLoading(true);
    setError("");
    setPage(1);
    try {
      if (themeId) {
        const res = await getSermonsPerTheme(themeId);
        setSermons(res.data);
      } else {
        const res = await getSermons();
        setSermons(res.data);
      }
    } catch (e) {
      setError("Failed to load sermons by theme");
    }
    setLoading(false);
  }

  function filteredSermons() {
    if (!search) return sermons;
    const q = search.toLowerCase();
    return sermons.filter(srm =>
      (srm.title || "").toLowerCase().includes(q) ||
      (srm.preacher || "").toLowerCase().includes(q)
    );
  }

  function handleAdd() {
    setEditSermon(null);
    setShowModal(true);
  }

  function handleEdit(sermon) {
    setEditSermon(sermon);
    setShowModal(true);
  }

  async function handleDelete(sermon) {
    if (!window.confirm(`Delete sermon: ${sermon.title}?`)) return;
    setActionLoading(true);
    setError("");
    try {
      await deleteSermon(sermon.id);
      setSermons(s => s.filter(srm => srm.id !== sermon.id));
    } catch (e) {
      setError("Failed to delete sermon");
    }
    setActionLoading(false);
  }

  async function handleSubmit(form) {
    setActionLoading(true);
    setError("");
    try {
      let sermonId;
      let uploadDetails = "";
      const file = form.file;
      const { file: _, ...sermonData } = form;

      if (editSermon) {
        await putSermon(editSermon.id, sermonData);
        sermonId = editSermon.id;
        setSermons(s => s.map(srm => srm.id === editSermon.id ? { ...sermonData, id: editSermon.id } : srm));
      } else {
        const res = await postSermon(sermonData);
        sermonId = res.data.id;
        setSermons(s => [...s, res.data]);
      }

      if (file) {
        try {
          const uploadRes = await uploadSermonImage(sermonId, file);
          uploadDetails = typeof uploadRes.data === 'string'
            ? uploadRes.data
            : JSON.stringify(uploadRes.data);

          const updatedSermons = await getSermons();
          setSermons(updatedSermons.data);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          const msg = uploadError.response?.data?.message || uploadError.response?.data || "Error uploading image";
          setError(`Sermon saved, but image upload failed: ${msg}`);
          return;
        }
      }

      setShowModal(false);
      if (uploadDetails) {
        // Optional: Show success toast
      }
    } catch (e) {
      console.error("Error saving sermon:", e);
      const msg = e.response?.data?.message || e.response?.data || "Failed to save sermon";
      setError(`Error: ${msg}`);
    } finally {
      setActionLoading(false);
    }
  }

  const currentFilteredSermons = filteredSermons();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 min-h-[calc(100vh-100px)]"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Sermons Library</h2>
          <p className="text-gray-400 mt-1">Manage, upload and organize your sermons</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New Sermon</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-gray-800/50 p-4 rounded-2xl border border-gray-700 backdrop-blur-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search sermons..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-gray-900/50 border border-gray-600 text-white pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-4 overflow-x-auto">
          <button 
            onClick={() => handleTab("all")}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeTab === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            All Sermons
          </button>
          <button 
            onClick={() => handleTab("recent")}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeTab === 'recent' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            Recent
          </button>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={selectedTheme}
              onChange={handleThemeChange}
              className={`pl-10 pr-8 py-2.5 rounded-xl font-medium text-sm appearance-none outline-none cursor-pointer transition-all ${selectedTheme ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              <option value="">Filter by Theme</option>
              {themes.map(theme => (
                <option key={theme.id} value={theme.id} className="text-gray-900">{theme.name}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => fetchSermons()}
            className="p-2.5 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white rounded-xl transition-all"
            title="Refresh"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader />
      ) : (
        <SermonsTable 
          sermons={currentFilteredSermons}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          pageSize={pageSize}
          total={currentFilteredSermons.length}
          onPageChange={setPage}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-2xl font-bold text-white">{editSermon ? "Edit Sermon" : "Add New Sermon"}</h3>
               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <SermonForm 
              initial={editSermon} 
              onSubmit={handleSubmit} 
              loading={actionLoading}
              submitLabel={editSermon ? "Save Changes" : "Create Sermon"}
              themes={themes}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-24 right-8 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-4 z-50">
          {error}
        </div>
      )}
    </motion.div>
  );
}
