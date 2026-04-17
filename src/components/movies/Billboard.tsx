'use client';

import { Info, Play } from 'lucide-react';
import Image from 'next/image';
import type { Movie } from '@/lib/data';
import { useRouter } from 'next/navigation';
import useInfoModal from '@/hooks/useInfoModal';

export default function Billboard({ movie }: { movie: Movie }) {
  const router = useRouter();
  const { openModal } = useInfoModal();

  if (!movie) return <div style={{ height: '56.25vw' }} />;

  return (
    <div style={{ position: 'relative', height: '56.25vw', width: '100%' }}>
      {/* Background Image / Video Poster */}
      <Image
        src={movie.thumbnailUrl}
        alt={movie.title}
        fill
        priority
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />
      
      {/* Deep Gradient Overlays to blend with the dark theme */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)'
        }} 
      />
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, var(--bg-primary) 0%, rgba(0,0,0,0) 30%)'
        }} 
      />

      {/* Content wrapper */}
      <div 
        style={{
          position: 'absolute',
          top: '30%',
          left: '4vw',
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          zIndex: 10
        }}
      >
        <h1 className="heading-hero">{movie.title}</h1>
        <p 
          style={{ 
            fontSize: 'min(1.5vw, 1.2rem)',
            color: 'var(--text-primary)',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4
          }}
        >
          {movie.description}
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={() => router.push(`/watch/${movie.id}`)}
            style={{
              backgroundColor: 'white',
              color: 'black',
              padding: '0.5rem 1.5rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: 'min(1.2vw, 1.1rem)',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.7)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <Play fill="black" size={20} />
            Play
          </button>
          
          <button
            onClick={() => openModal(movie.id)}
            className="glass-panel"
            style={{
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: 'min(1.2vw, 1.1rem)',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
          >
            <Info size={20} />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}
