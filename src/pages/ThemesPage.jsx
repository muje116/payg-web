import React, { useEffect, useState } from "react";
import { getThemes, postTheme, putTheme, deleteTheme } from "../api/themes";
import Loader from "../components/Loader";
// Using top navigation layout to match Sermons page
import ThemeForm from "../components/ThemeForm";
import ThemesTable from "../components/ThemesTable";

export default function ThemesPage() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTheme, setEditTheme] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchThemes();
  }, []);

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
  function handleSearch(e) {
    setSearch(e.target.value);
  }
  function filteredThemesRaw() {
    if (!search) return themes;
    const q = search.toLowerCase();
    return themes.filter(t => (t.name || "").toLowerCase().includes(q) || (t.addedBy || "").toLowerCase().includes(q));
  }
  function filteredThemes() {
    const filtered = filteredThemesRaw();
    return filtered.slice((page - 1) * pageSize, page * pageSize);
  }
  const totalPages = Math.max(1, Math.ceil(filteredThemesRaw().length / pageSize));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Themes</h2>
          <p className="text-gray-400 mt-1">Manage and organize your sermon themes</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
          </svg>
          <span>Create New Theme</span>
        </button>
      </div>

      {/* Modern Search Tray */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
        <div className="relative group max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-gray-500 text-sm transition-all"
            placeholder="Search themes by name or author..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {error && (
          <div className="mt-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center space-x-3 text-rose-400">
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
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-400 font-bold animate-pulse">Loading visual styles...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <ThemesTable themes={filteredThemes()} onEdit={handleEdit} onDelete={handleDelete} />

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 ${page === i + 1
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Enhanced Modal for Add/Edit Theme */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-gray-900 rounded-[2.5rem] border border-white/10 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {editTheme ? "Edit Theme" : "Add Theme"}
                  </h3>
                  <p className="text-gray-400 text-sm">Define the look and feel</p>
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

            <div className="px-10 py-8 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
              <ThemeForm
                initial={editTheme}
                onSubmit={handleSubmit}
                loading={actionLoading}
                submitLabel={editTheme ? "Save Theme Configuration" : "Initialize New Theme"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
