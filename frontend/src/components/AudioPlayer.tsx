'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, FileText } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  transcript?: string;
}

export default function AudioPlayer({ src, transcript }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const fullSrc = src.startsWith('http') ? src : `http://localhost:8080${src}`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-black border border-blue-950 rounded-2xl p-5 shadow-xl text-white my-4">
      <audio ref={audioRef} src={fullSrc} preload="metadata" />
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 flex items-center justify-center text-white shadow-lg transition active:scale-95 shrink-0"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        <button
          onClick={restart}
          className="p-2 text-slate-400 hover:text-white transition shrink-0"
          title="Restart audio"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Progress Bar & Time */}
        <div className="flex-1 w-full space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-900"
          />
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Mute & Transcript toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleMute}
            className="p-2 text-slate-400 hover:text-white transition"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-slate-500" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {transcript && (
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                showTranscript
                  ? 'bg-blue-950 border-blue-800 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Transcript</span>
            </button>
          )}
        </div>
      </div>

      {showTranscript && transcript && (
        <div className="mt-4 pt-4 border-t border-slate-900 text-sm text-slate-300 bg-blue-950/40 p-4 rounded-xl font-sans leading-relaxed border border-blue-900/50">
          <p className="font-semibold text-xs text-white uppercase tracking-wider mb-1">Audio Transcript</p>
          <p className="italic">{transcript}</p>
        </div>
      )}
    </div>
  );
}
