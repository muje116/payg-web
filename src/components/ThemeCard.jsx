import React from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, Music, ListMusic } from "lucide-react";

export default function ThemeCard({ theme, onEdit, onDelete, onClick }) {
  // Generate a random gradient based on the theme id or name to ensure consistency
  const gradients = [
    "from-purple-500 to-indigo-500",
    "from-pink-500 to-rose-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-amber-500",
    "from-blue-500 to-cyan-500"
  ];
  const gradient = gradients[(theme.id || theme.name.length) % gradients.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="group relative bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-700"
      onClick={onClick}
    >
      {/* Cover Image / Gradient */}
      <div className={`h-40 bg-gradient-to-br ${gradient} p-6 flex items-center justify-center relative overflow-hidden`}>
         <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
         <Music className="text-white/50 w-16 h-16 group-hover:scale-110 transition-transform duration-500" />
         
         {/* Action Buttons (Overlay) */}
         <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(theme); }}
              className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(theme); }}
              className="p-2 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md rounded-full text-red-200 hover:text-white transition-colors"
            >
              <Trash2 size={16} />
            </button>
         </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-xl text-white mb-1 truncate">{theme.name}</h3>
        <p className="text-gray-400 text-sm mb-4 flex items-center">
           <span className="bg-gray-700 px-2 py-0.5 rounded text-xs mr-2">Theme</span>
           Added by {theme.addedBy || 'Admin'}
        </p>
        
        <div className="flex items-center justify-between text-gray-400 text-xs">
           <div className="flex items-center space-x-1">
             <ListMusic size={14} />
             <span>View Sermons</span>
           </div>
           <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
}
