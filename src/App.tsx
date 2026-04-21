import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { VideoItem, VideoSourceType } from './types';
import { VideoTile } from './components/VideoTile';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [urlInput, setUrlInput] = useState('');
  const [activeUrl, setActiveUrl] = useState('');
  const [gridSize, setGridSize] = useState(100);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLooping, setIsLooping] = useState(true);

  // Initialize with a sample if empty
  useEffect(() => {
    const saved = localStorage.getItem('loop-dashboard-url');
    if (saved) {
      setActiveUrl(saved);
      setUrlInput(saved);
    } else {
      const sample = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      setActiveUrl(sample);
      setUrlInput(sample);
    }
  }, []);

  useEffect(() => {
    if (activeUrl) {
      localStorage.setItem('loop-dashboard-url', activeUrl);
    }
  }, [activeUrl]);

  const handleApply = () => {
    setActiveUrl(urlInput);
  };

  const videoType = useMemo((): VideoSourceType => {
    if (activeUrl.includes('youtube.com') || activeUrl.includes('youtu.be')) {
      return 'youtube';
    }
    return 'mp4';
  }, [activeUrl]);

  const videoList = useMemo(() => {
    return Array.from({ length: gridSize }).map((_, i) => ({
      id: `video-${i}-${activeUrl}`,
      url: activeUrl,
      type: videoType,
    }));
  }, [activeUrl, gridSize, videoType]);

  return (
    <div className="h-screen bg-[#050505] text-[#E5E5E5] flex flex-col overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Top Controller Bar */}
      <header className="z-50 bg-[#080808] border-b border-[#1a1a1a] p-4 flex flex-col gap-4 shadow-2xl">
        <div className="flex items-center justify-between gap-6">
          <div className="huge-text text-2xl !leading-none hidden md:block">
            LOOP<span className="text-blue-500">.</span>DSH
          </div>

          <div className="flex-1 flex items-center gap-2 max-w-2xl">
            <input 
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste Video URL (YouTube or MP4)..."
              className="flex-1 bg-[#111] border border-[#222] px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all font-mono"
            />
            <button 
              onClick={handleApply}
              className="bg-blue-600 hover:bg-white hover:text-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all"
            >
              Apply
            </button>
          </div>

          <div className="flex items-center gap-2 border-l border-[#222] pl-6 hidden sm:flex">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Grid</span>
            <select 
              value={gridSize} 
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="bg-[#111] border border-[#222] px-2 py-1 text-xs outline-none focus:border-blue-500"
            >
              <option value={25}>25 Nodes</option>
              <option value={50}>50 Nodes</option>
              <option value={100}>100 Nodes</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#1a1a1a] pt-4">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsPlaying(!isPlaying)} className="control-btn !px-4">
               {isPlaying ? 'Pause All' : 'Play All'}
             </button>
             <button onClick={() => setIsMuted(!isMuted)} className="control-btn !px-4">
               {isMuted ? 'Unmute All' : 'Mute All'}
             </button>
             <button onClick={() => setIsLooping(!isLooping)} className={`control-btn !px-4 ${isLooping ? 'bg-blue-900/40 text-blue-400 border-blue-500/50' : ''}`}>
               Loop: {isLooping ? 'ON' : 'OFF'}
             </button>
          </div>
          
          <div className="flex items-center gap-4 text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono">
            <span>Status: {activeUrl ? 'Active' : 'Awaiting Input'}</span>
            <span className="text-blue-500">Nodes: {gridSize}</span>
          </div>
        </div>
      </header>

      {/* Main Grid Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505] p-2">
        <div 
          className="grid gap-1 h-fit"
          style={{ 
            gridTemplateColumns: `repeat(auto-fill, minmax(${gridSize === 100 ? '100px' : gridSize === 50 ? '150px' : '200px'}, 1fr))` 
          }}
        >
          {videoList.map((item) => (
            <div key={item.id} className="aspect-video bg-black border border-[#111] overflow-hidden group">
              <VideoTile 
                video={{
                  ...item,
                  title: '',
                  isMuted,
                  isPlaying,
                  isLooping,
                  volume: isMuted ? 0 : 0.5,
                }}
                minimal
              />
            </div>
          ))}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 0; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #333; }
      `}</style>
    </div>
  );
}
