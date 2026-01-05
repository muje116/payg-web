import React from "react";

export default function ImageCard({ image }) {
  return (
    <div className="bg-white rounded shadow">
      <img src={image.url} alt={image.title || "PAYG"} className="w-full h-32 object-cover rounded-t" />
      <div className="p-2 text-sm">{image.title}</div>
      {/* Add delete button if needed */}
    </div>
  );
}
