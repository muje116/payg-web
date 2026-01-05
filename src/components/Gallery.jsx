import React from "react";
import ImageCard from "./ImageCard";

export default function Gallery({ images }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map(img => (
        <ImageCard key={img.id} image={img} />
      ))}
    </div>
  );
}
