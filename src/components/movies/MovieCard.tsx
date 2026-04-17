'use client';

import axios from 'axios';
import React, { useCallback, useMemo } from 'react';
import Image from 'next/image';
import { PlayCircle, Plus, Check, ThumbsUp, ChevronDown } from 'lucide-react';
import type { Movie } from '@/lib/data';
import useFavorites from '@/hooks/useFavorites';
import { useRouter } from 'next/navigation';
import useInfoModal from '@/hooks/useInfoModal';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();
  const { openModal } = useInfoModal();
  const { data: favorites, mutate: mutateFavorites } = useFavorites();

  const isFavorite = useMemo(() => {
    const list = favorites || [];
    return list.some((fav: any) => fav.movieId === movie.id);
  }, [favorites, movie.id]);

  const toggleFavorites = useCallback(async () => {
    try {
      if (isFavorite) {
        await axios.delete('/api/favorite', { data: { movieId: movie.id } });
      } else {
        await axios.post('/api/favorite', { movieId: movie.id });
      }
      mutateFavorites();
    } catch (error) {
      console.log(error);
    }
  }, [isFavorite, movie.id, mutateFavorites]);

  return (
    <div 
      className="movie-card"
      onClick={() => openModal(movie.id)}
      style={{
        position: 'relative',
        flex: '0 0 auto',
        width: 'min(24vw, 280px)',
        aspectRatio: '16/9',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-surface)',
        cursor: 'pointer',
        transition: 'transform var(--transition-smooth)',
        transformOrigin: 'center center'
      }}
    >
      <Image
        src={movie.thumbnailUrl}
        alt={movie.title}
        fill
        className="card-image"
        style={{
          objectFit: 'cover',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
        }}
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      
      {/* We use CSS module or styled-jsx for the complex multi-step hover animation */}
      <style jsx>{`
        .movie-card:hover {
          transform: scale(1.05);
          z-index: 10;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);
        }
        .movie-card:hover .hover-overlay {
          opacity: 1;
        }
      `}</style>
      
      <div 
        className="hover-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
          borderRadius: 'var(--radius-md)',
          opacity: 0,
          transition: 'opacity var(--transition-fast)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <PlayCircle 
            size={28} 
            style={{ color: 'white' }} 
            fill="white" 
            onClick={(e) => { e.stopPropagation(); router.push(`/watch/${movie.id}`); }}
          />
          <div 
            onClick={(e) => { e.stopPropagation(); toggleFavorites(); }}
            style={{ 
              color: 'white', 
              border: '1px solid white', 
              borderRadius: '50%', 
              width: '24px', 
              height: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: isFavorite ? 'white' : 'transparent',
              color: isFavorite ? 'black' : 'white'
            }}
          >
            {isFavorite ? <Check size={16} /> : <Plus size={16} />}
          </div>
          <ThumbsUp size={20} style={{ color: 'white' }} />
          <div 
            onClick={(e) => { e.stopPropagation(); openModal(movie.id); }}
            style={{ marginLeft: 'auto' }}
          >
            <ChevronDown size={24} style={{ color: 'white', padding: '2px', border: '1px solid white', borderRadius: '50%' }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ color: '#46d369', fontWeight: 600, fontSize: '0.8rem' }}>98% Match</span>
          <span style={{ color: 'white', border: '1px solid var(--border-subtle)', padding: '0 0.4rem', fontSize: '0.8rem' }}>16+</span>
          <span style={{ color: 'white', fontSize: '0.8rem' }}>{movie.duration}</span>
        </div>
        <div style={{ color: 'white', fontSize: '0.8rem', fontWeight: 500 }}>
          {movie.genre}
        </div>
      </div>
    </div>
  );
}
