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
    return themes.filter(t => (t.name||"").toLowerCase().includes(q) || (t.addedBy||"").toLowerCase().includes(q));
  }
  function filteredThemes() {
    const filtered = filteredThemesRaw();
    return filtered.slice((page-1)*pageSize, page*pageSize);
  }
  const totalPages = Math.max(1, Math.ceil(filteredThemesRaw().length / pageSize));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <div className="hidden md:flex space-x-6">
                <a href="/dashboard" className="hover:text-blue-200">Dashboard</a>
                <a href="/sermons" className="hover:text-blue-200">Sermons</a>
                <a href="/themes" className="hover:text-blue-200 font-medium">Themes</a>
                <a href="/images" className="hover:text-blue-200">Images</a>
              </div>
            </div>
            <a href="/login" className="hover:text-blue-200">Logout</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="w-full mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 0a8 8 0 110 16 8 8 0 010-16z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Themes</h2>
                  <p className="text-gray-500">Organize and manage your sermon themes</p>
                </div>
              </div>
              
              <button
                onClick={handleAdd}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Theme
              </button>
            </div>
            
            {/* Search */}
            <div className="mt-6">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-700 text-sm"
                  placeholder="Search themes by name or added by..."
                  value={search}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
              {loading ? (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex flex-col items-center justify-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-500 text-lg">Loading themes...</p>
                  </div>
                </div>
              ) : (
                <>
                  <ThemesTable themes={filteredThemes()} onEdit={handleEdit} onDelete={handleDelete} />
                  <div className="flex justify-center mt-6 gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        className={`px-3 py-1 rounded ${page === i+1 ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 border"}`}
                        onClick={() => setPage(i+1)}
                      >{i+1}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        </div>
      {/* Enhanced Modal for Add/Edit Theme */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {editTheme ? "Edit Theme" : "Add New Theme"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {editTheme ? "Update theme information" : "Create a new theme entry"}
                    </p>
                  </div>
                </div>
                <button
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
                  onClick={() => setShowModal(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="px-8 py-6">
              <ThemeForm
                initial={editTheme}
                onSubmit={handleSubmit}
                loading={actionLoading}
                submitLabel={editTheme ? "Update Theme" : "Create Theme"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
