import React from "react";

export default function ThemeCard({ theme }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold text-lg">{theme.title}</h3>
      <div className="text-sm text-gray-600">{theme.date}</div>
      <div>{theme.content}</div>
      {/* Add edit/delete buttons if needed */}
    </div>
  );
}
