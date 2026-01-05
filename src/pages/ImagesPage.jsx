import React, { useEffect, useState } from "react";
import { getImages } from "../api/images";
import Loader from "../components/Loader";
import Gallery from "../components/Gallery";
// Sidebar not used on this page; using top nav to match Sermons layout

export default function ImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setError("");
      try {
        const res = await getImages();
        setImages(res.data);
      } catch (e) {
        setError("Failed to load images");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
                <a href="/themes" className="hover:text-blue-200">Themes</a>
                <a href="/images" className="hover:text-blue-200 font-medium">Images</a>
              </div>
            </div>
            <a href="/login" className="hover:text-blue-200">Logout</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Images</h2>
            <a href="/images/upload" className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-200">Upload Image</a>
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
                <div className="flex justify-center items-center min-h-[200px]">
                  <Loader />
                </div>
              ) : (
                <Gallery images={images} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
