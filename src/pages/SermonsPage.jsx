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
import Loader from "../components/Loader";
import SermonCard from "../components/SermonCard";
import Sidebar from "../components/Sidebar";
import SermonsTable from "../components/SermonsTable";
import SermonForm from "../components/SermonForm";

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
    getSermons().then(res => {
      setSermons(res.data); // Adjust as per API response
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // Load themes for filter dropdown
    import("../api/themes").then(({ getThemes }) => {
      getThemes().then(res => setThemes(res.data));
    });
  }, []);

  if (loading) return <Loader />;

  async function handleTab(tab) {
    setLoading(true);
    setActiveTab(tab);
    setSelectedTheme("");
    setError("");
    try {
      if (tab === "recent") {
        console.log("recent");
        const res = await getRecentSermons();
        console.log(res.data);
        setSermons(res.data);
      } else {
        console.log("no tab");
        const res = await getSermons();
        console.log(res.data);
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
    try {
      if (themeId) {
        console.log(themeId);
        const res = await getSermonsPerTheme(themeId);
        console.log(res.data);
        setSermons(res.data);
      } else {
        console.log("no themeId");
        const res = await getSermons();
        console.log(res.data);
        setSermons(res.data);
      }
    } catch (e) {
      setError("Failed to load sermons by theme");
    }
    setLoading(false);
  }
  function handleSearch(e) {
    setSearch(e.target.value);
    setPage(1);
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

      // Check if we have a file to upload
      const file = form.file;

      // Remove the file from form data before sending to sermon API
      const { file: _, ...sermonData } = form;

      if (editSermon) {
        // Update existing sermon
        await putSermon(editSermon.id, sermonData);
        sermonId = editSermon.id;
        setSermons(s => s.map(srm => srm.id === editSermon.id ? { ...sermonData, id: editSermon.id } : srm));
      } else {
        // Create new sermon
        const res = await postSermon(sermonData);
        sermonId = res.data.id;
        setSermons(s => [...s, res.data]);
      }

      // Upload image if a file was selected
      if (file) {
        try {
          const uploadRes = await uploadSermonImage(sermonId, file);
          console.log("Image upload response:", uploadRes.data);
          // Assuming the response data contains the filename or URI
          // If it's a string or object, we stringify if needed
          uploadDetails = typeof uploadRes.data === 'string'
            ? uploadRes.data
            : JSON.stringify(uploadRes.data);

          // Refresh sermons to get the updated image
          const updatedSermons = await getSermons();
          setSermons(updatedSermons.data);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          const msg = uploadError.response?.data?.message || uploadError.response?.data || "Error uploading image";
          setError(`Sermon saved, but image upload failed: ${msg}`);
          return; // Don't close modal if upload failed
        }
      }

      if (uploadDetails) {
        alert(`Sermon saved and image uploaded successfully!\n\nImage Details: ${uploadDetails}`);
      }

      setShowModal(false);
    } catch (e) {
      console.error("Error saving sermon:", e);
      const msg = e.response?.data?.message || e.response?.data || "Failed to save sermon";
      setError(`Error: ${msg}`);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Sermons</h2>
          <p className="text-gray-400 mt-1">Manage and organize your sermon library</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Sermon</span>
        </button>
      </div>

      {/* Modern Filters Tray */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-6 border border-white/5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex bg-white/5 p-1 rounded-2xl">
            <button
              className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === "all"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-gray-400 hover:text-white"
                }`}
              onClick={() => handleTab("all")}
            >
              All
            </button>
            <button
              className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === "recent"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-gray-400 hover:text-white"
                }`}
              onClick={() => handleTab("recent")}
            >
              Recent
            </button>
          </div>

          <div className="relative">
            <select
              className="w-full pl-4 pr-10 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white text-sm font-medium appearance-none transition-all cursor-pointer"
              value={selectedTheme}
              onChange={handleThemeChange}
            >
              <option value="" className="bg-gray-900">All Themes</option>
              {themes.map(theme => (
                <option key={theme.id} value={theme.id} className="bg-gray-900">{theme.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-500 text-sm transition-all"
                placeholder="Search sermons by title or preacher..."
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center space-x-3 text-rose-400">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-20 flex flex-col items-center justify-center space-y-4 border border-white/5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/5 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-400 font-bold animate-pulse">Consulting the library...</p>
        </div>
      ) : (
        <SermonsTable
          sermons={filteredSermons()}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          pageSize={pageSize}
          total={filteredSermons().length}
          onPageChange={setPage}
        />
      )}

      {/* Enhanced Modal for Add/Edit Sermon */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-gray-900 rounded-[2.5rem] border border-white/10 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {editSermon ? "Edit Sermon" : "Add Sermon"}
                  </h3>
                  <p className="text-gray-400 text-sm">Fill in the details below</p>
                </div>
              </div>
              <button
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all transform hover:rotate-90"
                onClick={() => setShowModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-10 py-8 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
              <SermonForm
                initial={editSermon}
                onSubmit={handleSubmit}
                loading={actionLoading}
                submitLabel={editSermon ? "Update Global Record" : "Publish to Library"}
                themes={themes}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
