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
          await uploadSermonImage(sermonId, file);
          // Refresh sermons to get the updated image
          const updatedSermons = await getSermons();
          setSermons(updatedSermons.data);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          setError("Sermon saved, but there was an error uploading the image");
        }
      }
      
      setShowModal(false);
    } catch (e) {
      console.error("Error saving sermon:", e);
      setError("Failed to save sermon");
    } finally {
      setActionLoading(false);
    }
  }

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
                <a href="/sermons" className="hover:text-blue-200 font-medium">Sermons</a>
                <a href="/themes" className="hover:text-blue-200">Themes</a>
                <a href="/images" className="hover:text-blue-200">Images</a>
              </div>
            </div>
            <a href="/login" className="hover:text-blue-200">Logout</a>
          </div>
        </div>
      </nav>

      {/* Main Content and Modal Wrapper */}
      <div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Sermons</h2>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-200"
            >
              Add New Sermon
            </button>
          </div>
          {/* Filters and Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "all" 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handleTab("all")}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "recent" 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handleTab("recent")}
              >
                Recent
              </button>
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 text-sm"
                value={selectedTheme}
                onChange={handleThemeChange}
              >
                <option value="">All Themes</option>
                {themes.map(theme => (
                  <option key={theme.id} value={theme.id}>{theme.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 text-sm"
                  placeholder="Search sermons by title or preacher..."
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
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500 text-lg">Loading sermons...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <SermonsTable
                sermons={filteredSermons()}
                onEdit={handleEdit}
                onDelete={handleDelete}
                page={page}
                pageSize={pageSize}
                total={filteredSermons().length}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
        {/* Enhanced Modal for Add/Edit Sermon */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 scale-100">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {editSermon ? "Edit Sermon" : "Add New Sermon"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {editSermon ? "Update sermon information" : "Create a new sermon entry"}
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
                <SermonForm
                  initial={editSermon}
                  onSubmit={handleSubmit}
                  loading={actionLoading}
                  submitLabel={editSermon ? "Update Sermon" : "Create Sermon"}
                  themes={themes}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
