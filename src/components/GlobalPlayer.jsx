import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { Play, Pause, SkipForward, Volume2, Maximize2, Minimize2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    seek,
    volume,
    changeVolume,
    playbackRate,
    changePlaybackRate,
    isExpanded,
    setIsExpanded
  } = usePlayer();

  if (!currentTrack) return null;

  const handleSpeedChange = () => {
    const speeds = [1, 1.25, 1.5, 2, 0.5];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    changePlaybackRate(speeds[nextIndex]);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={`fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 z-50 transition-all duration-300 ${isExpanded ? 'h-full flex flex-col justify-center' : 'h-20'}`}
      >
        <div className={`max-w-7xl mx-auto w-full px-4 h-full flex ${isExpanded ? 'flex-col space-y-8 p-8' : 'items-center justify-between'}`}>
          
          {/* Track Info */}
          <div className={`flex items-center ${isExpanded ? 'flex-col text-center space-y-4' : 'space-x-4 w-1/3'}`}>
            <div className={`bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden ${isExpanded ? 'w-64 h-64 shadow-2xl' : 'w-12 h-12'}`}>
               {currentTrack.image ? (
                 <img src={currentTrack.image} alt={currentTrack.title} className="w-full h-full object-cover" />
               ) : (
                 <Music className={`text-gray-400 ${isExpanded ? 'w-24 h-24' : 'w-6 h-6'}`} />
               )}
            </div>
            <div className="min-w-0">
              <h4 className={`font-bold text-white truncate ${isExpanded ? 'text-2xl' : 'text-sm'}`}>{currentTrack.title || 'Unknown Title'}</h4>
              <p className={`text-gray-400 truncate ${isExpanded ? 'text-lg' : 'text-xs'}`}>{currentTrack.artist || 'Unknown Artist'}</p>
            </div>
          </div>

          {/* Controls & Progress */}
          <div className={`flex flex-col items-center ${isExpanded ? 'w-full max-w-2xl space-y-6' : 'flex-1 max-w-xl mx-4'}`}>
            <div className="flex items-center space-x-6">
              <button 
                onClick={togglePlay}
                className={`rounded-full bg-white hover:bg-gray-200 text-black flex items-center justify-center transition-all ${isExpanded ? 'w-16 h-16' : 'w-10 h-10'}`}
              >
                {isPlaying ? <Pause size={isExpanded ? 32 : 20} fill="currentColor" /> : <Play size={isExpanded ? 32 : 20} fill="currentColor" className="ml-1" />}
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <SkipForward size={isExpanded ? 32 : 24} />
              </button>
              <button 
                onClick={handleSpeedChange}
                className="text-xs font-bold text-gray-400 hover:text-white transition-colors border border-gray-600 rounded px-2 py-1 min-w-[3rem]"
              >
                {playbackRate}x
              </button>
            </div>

            <div className="w-full flex items-center space-x-3 mt-2">
              <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
              <div className="flex-1 relative group h-2">
                 <div className="absolute inset-0 bg-gray-700 rounded-full"></div>
                 <div 
                   className="absolute inset-y-0 left-0 bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-colors"
                   style={{ width: `${(currentTime / duration) * 100}%` }}
                 ></div>
                 <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume & Expand */}
          <div className={`flex items-center justify-end space-x-4 ${isExpanded ? 'hidden' : 'w-1/3'}`}>
            <div className="flex items-center space-x-2 w-32 group">
              <Volume2 size={20} className="text-gray-400" />
              <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-400 group-hover:bg-white transition-colors"
                  style={{ width: `${volume * 100}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
                className="absolute w-24 h-8 opacity-0 cursor-pointer"
              />
            </div>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>

           {/* Close Expand Button */}
           {isExpanded && (
            <button 
              onClick={() => setIsExpanded(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-white"
            >
              <Minimize2 size={32} />
            </button>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
