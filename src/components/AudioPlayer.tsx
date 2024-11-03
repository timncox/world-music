import React, { useState, useRef } from 'react';
import { Play, Pause, Download } from 'lucide-react';

interface AudioPlayerProps {
  isUnlocked: boolean;
  audioUrl: string;
}

export default function AudioPlayer({ isUnlocked, audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current || !isUnlocked) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    if (!isUnlocked) return;
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'arushi-jain-my-people-have-deep-roots.m4a';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-indigo-950/50 p-4 rounded-lg space-y-3">
      <audio 
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
      />
      <button
        onClick={togglePlay}
        disabled={!isUnlocked}
        className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
          isUnlocked ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-gray-600'
        } transition-colors disabled:cursor-not-allowed`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
        <span>{isUnlocked ? (isPlaying ? 'Pause' : 'Play') : 'Locked'}</span>
      </button>

      {isUnlocked && (
        <button
          onClick={handleDownload}
          className="w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <Download className="w-6 h-6" />
          <span>Download Track</span>
        </button>
      )}
    </div>
  );
}