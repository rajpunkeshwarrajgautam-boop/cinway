"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Play, Pause, Maximize, Volume2, VolumeX } from "lucide-react";
import { MOVIE_DATABASE } from "@/lib/data";
import "../watch.css";

const Watch = () => {
  const router = useRouter();
  const { movieId } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const movie = MOVIE_DATABASE.find((m) => m.id === movieId);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const togglePlay = useCallback(() => {
    if (videoRef.current?.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (!movie) {
    return (
      <div className="playerContainer flex items-center justify-center text-white">
        Movie not found
      </div>
    );
  }

  return (
    <div className="playerContainer">
      <nav 
        className="backButton"
        onClick={() => router.back()}
      >
        <ArrowLeft size={24} />
        <span className="font-bold text-lg">Watching: {movie.title}</span>
      </nav>

      <video
        ref={videoRef}
        className="videoElement"
        autoPlay
        src={movie.videoUrl}
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className={`controlsOverlay ${!showControls ? 'hidden' : ''}`}>
        <div className="progressBarContainer" onClick={handleSeek}>
          <div 
            className="progressBar" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        <div className="controlsMain">
          <button className="controlButton" onClick={togglePlay}>
            {isPlaying ? <Pause size={30} fill="white" /> : <Play size={30} fill="white" />}
          </button>

          <div className="volumeContainer">
            <button className="controlButton" onClick={toggleMute}>
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                if (videoRef.current) videoRef.current.volume = val;
              }}
              className="volumeSlider"
            />
          </div>

          <h3 className="movieTitle">{movie.title}</h3>

          <button className="controlButton" onClick={toggleFullScreen}>
            <Maximize size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Watch;
