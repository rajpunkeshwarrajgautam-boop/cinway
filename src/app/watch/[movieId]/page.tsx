"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import useSWR from "swr";
import type { Movie } from "@prisma/client";
import "../watch.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Watch = () => {
  const router = useRouter();
  const { movieId } = useParams();
  
  const { data: movie, error, isLoading } = useSWR<Movie>(`/api/movies/${movieId}`, fetcher);

  // Auto-hide mouse after 3 seconds for a clean cinematic experience
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      document.body.style.cursor = 'default';
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        document.body.style.cursor = 'none';
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = 'default';
    };
  }, []);

  if (isLoading) {
    return (
      <div className="playerContainer flex items-center justify-center text-white bg-black">
        <div className="spinner"></div>
        <style jsx>{`
          .spinner { width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.1); border-radius: 50%; border-top-color: #e50914; animation: spin 1s ease-in-out infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="playerContainer flex items-center justify-center text-white bg-black">
        Movie not found
      </div>
    );
  }

  // Use Vidking player if tmdbId is available, otherwise fallback to the raw videoUrl
  const videoSrc = movie.tmdbId 
    ? `https://www.vidking.net/embed/movie/${movie.tmdbId}`
    : movie.videoUrl;

  return (
    <div className="playerContainer">
      <nav 
        className="backButton"
        onClick={() => router.back()}
      >
        <ArrowLeft size={24} />
        <span className="font-bold text-lg">Watching: {movie.title}</span>
      </nav>

      {movie.tmdbId ? (
        <iframe
          src={videoSrc}
          className="videoElement"
          allowFullScreen
          allow="autoplay; fullscreen"
          frameBorder="0"
        />
      ) : (
        <video
          className="videoElement"
          autoPlay
          controls
          src={videoSrc}
        />
      )}
    </div>
  );
};

export default Watch;
