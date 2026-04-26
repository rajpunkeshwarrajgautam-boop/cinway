"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import useSWR from "swr";
import axios from "axios";
import type { Movie } from "@prisma/client";
import "../watch.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Watch = () => {
  const router = useRouter();
  const { movieId } = useParams();
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  
  const { data: movie, error, isLoading } = useSWR<Movie>(`/api/movies/${movieId}`, fetcher);
  const { data: user, isLoading: isUserLoading } = useSWR('/api/current', fetcher);

  const saveProgress = useCallback(async (progress: number) => {
    try {
      await axios.post('/api/watch-progress', { movieId, progress: Math.min(progress, 100) });
    } catch (err) {
      /* silently fail */
    }
  }, [movieId]);

  useEffect(() => {
    if (!user || user.subscriptionStatus !== 'ACTIVE') return;

    saveProgress(5);

    progressInterval.current = setInterval(() => {
      saveProgress(Math.random() * 60 + 10);
    }, 30000);

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [user, saveProgress]);

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

  if (isLoading || isUserLoading) {
    return (
      <div className="playerContainer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', background: 'black' }}>
        <div style={{ width: 50, height: 50, border: '3px solid rgba(255,255,255,0.1)', borderRadius: '50%', borderTopColor: '#e50914', animation: 'spin 1s ease-in-out infinite' }} />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="playerContainer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', background: 'black' }}>
        Movie not found
      </div>
    );
  }

  const videoSrc = movie.tmdbId 
    ? `https://www.vidking.net/embed/movie/${movie.tmdbId}`
    : movie.videoUrl;

  if (user && user.subscriptionStatus !== 'ACTIVE') {
    return (
      <div className="playerContainer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', background: 'black' }}>
        <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>Premium Required</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>You must subscribe to a plan to watch this content.</p>
          <button 
            onClick={() => router.push('/plans')}
            style={{ padding: '1rem 3rem', background: '#e50914', color: 'white', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', border: 'none', cursor: 'pointer' }}
          >
            View Plans
          </button>
          <button 
            onClick={() => router.back()}
            style={{ marginTop: '1rem', display: 'block', width: '100%', padding: '1rem 3rem', background: 'transparent', color: 'white', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
          >
            Go Back
          </button>
        </div>
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
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Watching: {movie.title}</span>
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
