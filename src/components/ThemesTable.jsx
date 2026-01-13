import React from "react";

export default function ThemesTable({ themes, onEdit, onDelete }) {
  return (
    <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Image</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Added By</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {themes.map((theme) => (
              <tr key={theme.id} className="hover:bg-white/5 transition-all duration-300 group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-12 w-12 rounded-xl overflow-hidden shadow-xl border border-white/10 group-hover:scale-110 transition-transform">
                    {theme.imageUrl ? (
                      <img src={theme.imageUrl} alt={theme.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gray-700 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{theme.name}</div>
                  <div className="text-xs text-gray-500">Created: {theme.dateAdded ? new Date(theme.dateAdded).toLocaleDateString() : "-"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-400">{theme.addedBy || "Internal"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${theme.voided
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                    {theme.voided ? 'Voided' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(theme)}
                      className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-all"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(theme)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-white/5 rounded-lg transition-all"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
