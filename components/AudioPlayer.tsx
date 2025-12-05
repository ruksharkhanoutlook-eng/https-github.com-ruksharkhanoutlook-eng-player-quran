import React, { useRef, useEffect, useState } from 'react';
import { Surah, Reciter } from '../types';

interface AudioPlayerProps {
  surah: Surah | null;
  reciter: Reciter;
  onNext: () => void;
  onPrev: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ surah, reciter, onNext, onPrev }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Reset fallback state when surah or reciter changes
  useEffect(() => {
    setUseFallback(false);
  }, [surah?.number, reciter.id]);

  useEffect(() => {
    if (surah && audioRef.current) {
      setLoading(true);
      setError(false);
      setIsPlaying(false);
      setProgress(0);
      
      let url = '';
      if (useFallback && reciter.fallbackServer && reciter.fallbackFolder) {
         // Construct Fallback URL (MP3Quran pattern)
         url = `${reciter.fallbackServer}${reciter.fallbackFolder}/${surah.number.toString().padStart(3, '0')}.mp3`;
      } else {
         // Construct Primary URL (QuranicAudio pattern)
         url = `https://download.quranicaudio.com/quran/${reciter.folder}/${surah.number.toString().padStart(3, '0')}.mp3`;
      }
      
      // Only change src if it's different
      if(audioRef.current.src !== url) {
          audioRef.current.src = url;
          audioRef.current.load();
      }

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setLoading(false);
          })
          .catch((err) => {
            console.warn("Auto-play prevented or paused:", err);
            setLoading(false);
          });
      }
    }
  }, [surah, reciter, useFallback]);

  const handleError = () => {
    if (!surah || !audioRef.current) return;
    
    // If we are NOT using fallback yet, and we HAVE a fallback config, try it.
    if (!useFallback && reciter.fallbackServer && reciter.fallbackFolder) {
      console.warn("Primary audio source failed. Switching to fallback server...");
      setUseFallback(true);
      // The useEffect dependency on [useFallback] will trigger re-load with new URL
      return;
    }

    // Otherwise, we failed on fallback or no fallback exists
    console.error("All audio sources failed for Surah", surah.number, "Reciter", reciter.name);
    setLoading(false);
    setError(true);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!audioRef.current || !surah) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = Number(e.target.value);
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if(audioRef.current) {
        audioRef.current.volume = vol;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!surah) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] px-4 py-3 z-50">
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setLoading(false);
        }}
        onError={handleError}
      />

      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        {/* Progress Bar */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <span>{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={progress}
            onChange={handleSeek}
            disabled={error}
            className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 hover:accent-emerald-700 transition-all"
          />
          <span>{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-3 w-1/3 overflow-hidden">
             <div className="flex flex-col">
                <p className="font-bold text-gray-800 text-sm md:text-base line-clamp-1">{surah.englishName}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="font-amiri line-clamp-1">{surah.name}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-emerald-600 font-medium truncate hidden sm:inline">{reciter.name}</span>
                </div>
                {error && <span className="text-red-500 text-[10px] font-sans">Audio Unavailable</span>}
                {useFallback && !error && <span className="text-amber-500 text-[10px] font-sans">Using Backup Server</span>}
             </div>
          </div>

          <div className="flex items-center justify-center gap-4 md:gap-8 w-1/3">
            <button onClick={onPrev} className="text-gray-400 hover:text-emerald-600 transition p-2">
              <i className="fa-solid fa-backward-step text-lg md:text-xl"></i>
            </button>
            
            <button 
              onClick={togglePlay}
              disabled={loading || error}
              className={`
                w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-lg transition transform hover:scale-105
                ${loading || error ? 'bg-gray-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}
              `}
            >
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : isPlaying ? (
                <i className="fa-solid fa-pause"></i>
              ) : (
                <i className="fa-solid fa-play ml-1"></i>
              )}
            </button>

            <button onClick={onNext} className="text-gray-400 hover:text-emerald-600 transition p-2">
              <i className="fa-solid fa-forward-step text-lg md:text-xl"></i>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 w-1/3">
            <i className={`fa-solid ${volume === 0 ? 'fa-volume-xmark' : 'fa-volume-high'} text-gray-400 text-xs hidden md:block`}></i>
             <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 md:w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500 hidden md:block"
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;