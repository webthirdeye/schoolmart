import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const VideoPlayer = ({ src, className, autoPlay = true, loop = true }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, []);

  return (
    <div className={`relative group/video ${className} overflow-hidden rounded-inherit`}>
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
      />
      
      {/* Center Play Button Overlay (Big) */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-transform">
            <Play size={32} fill="currentColor" className="ml-1" />
          </div>
        </div>
      )}

      {/* Control Bar - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-3 bg-gradient-to-t from-black/0 to-transparent opacity-0 group-hover/video:opacity-100 transition-opacity flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={togglePlay}
            className="text-white hover:text-blue-400 transition-colors bg-white/10 p-1.5 rounded-lg backdrop-blur-sm border border-white/10"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
        </div>

        <button 
          onClick={toggleMute}
          className="text-white hover:text-blue-400 transition-colors bg-white/10 p-1.5 rounded-lg backdrop-blur-sm border border-white/10 flex items-center gap-2 px-3"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">{isMuted ? 'Unmute' : 'Mute'}</span>
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
