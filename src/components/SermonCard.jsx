import React from "react";
import AudioPlayer from "./AudioPlayer";

export default function SermonCard({ sermon }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold text-lg">{sermon.title}</h3>
      <div className="text-sm text-gray-600">{sermon.speaker} | {sermon.date}</div>
      <AudioPlayer src={sermon.audioUrl} />
      {/* Add edit/delete buttons if needed */}
    </div>
  );
}
