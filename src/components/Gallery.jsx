import React from "react";
import ImageCard from "./ImageCard";

export default function Gallery({ images }) {
  if (!images?.length) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-600">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-400 font-bold">No images yet</p>
        <p className="text-gray-500 text-sm">Upload your first image to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map(img => (
        <ImageCard key={img.id} image={img} />
      ))}
    </div>
  );
}
