'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { X, Play } from 'lucide-react';

import useInfoModal from '@/hooks/useInfoModal';
import { MOVIE_DATABASE } from '@/lib/data';
import MovieCard from './MovieCard';

const InfoModal = () => {
  const { isOpen, closeModal, movieId } = useInfoModal();
  const [isVisible, setIsVisible] = useState(!!isOpen);

  useEffect(() => {
    setIsVisible(!!isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      closeModal();
    }, 300);
  }, [closeModal]);

  if (!isOpen || !movieId) return null;

  const movie = MOVIE_DATABASE.find((m) => m.id === movieId);
  if (!movie) return null;

  const recommendations = MOVIE_DATABASE.filter(
    (m) => m.genre === movie.genre && m.id !== movie.id
  );

  return (
    <div 
      style={{
        zIndex: 100,
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: 'hidden',
        overflowY: 'auto',
        transition: 'opacity 300ms',
        opacity: isVisible ? 1 : 0
      }}
    >
      <div 
        className="glass-panel"
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '800px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-primary)',
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 300ms'
        }}
      >
        {/* Header Image */}
        <div style={{ position: 'relative', height: '450px' }}>
          <video
            autoPlay
            muted
            loop
            poster={movie.thumbnailUrl}
            src={movie.videoUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
          />
          <div 
            onClick={handleClose}
            style={{
              cursor: 'pointer',
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              height: '40px',
              width: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X color="white" size={25} />
          </div>

          <div style={{ position: 'absolute', bottom: '10%', left: '3rem' }}>
            <h2 className="heading-hero" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
              {movie.title}
            </h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => window.location.href = `/watch/${movie.id}`}
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                  padding: '0.5rem 2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Play fill="black" size={20} />
                Play
              </button>
            </div>
          </div>
        </div>

        {/* Details section */}
        <div style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ color: '#46d369', fontWeight: 600 }}>New</span>
                <span style={{ color: 'white' }}>{movie.releaseYear}</span>
                <span style={{ color: 'white' }}>{movie.duration}</span>
                <span style={{ color: 'white', border: '1px solid var(--border-subtle)', padding: '2px 4px', fontSize: '0.75rem' }}>HD</span>
              </div>
              <p style={{ color: 'white', fontSize: '1.1rem', lineHeight: 1.6 }}>
                {movie.description}
              </p>
            </div>
            <div style={{ width: '30%' }}>
              <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Genre: <span style={{ color: 'white' }}>{movie.genre}</span>
              </p>
            </div>
          </div>

          {recommendations.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white', marginBottom: '1.5rem' }}>
                More Like This
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {recommendations.map((m) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
