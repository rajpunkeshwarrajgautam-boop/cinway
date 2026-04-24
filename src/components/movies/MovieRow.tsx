'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import type { Movie } from '@prisma/client';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ marginBottom: '3rem', position: 'relative' }}>
      <h2 className="heading-section" style={{ paddingLeft: '4vw' }}>{title}</h2>
      
      <div className="row-container" style={{ position: 'relative' }}>
        <button 
          className="scroll-btn left"
          onClick={() => handleScroll('left')}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4vw',
            zIndex: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color var(--transition-fast)',
            color: 'white'
          }}
        >
          <ChevronLeft size={36} />
        </button>
        
        <div 
          ref={rowRef}
          style={{
            display: 'flex',
            gap: '0.5vw',
            padding: '1rem 4vw',
            overflowX: 'auto',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none' // IE/Edge
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        
        <button 
          className="scroll-btn right"
          onClick={() => handleScroll('right')}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '4vw',
            zIndex: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color var(--transition-fast)',
            color: 'white'
          }}
        >
          <ChevronRight size={36} />
        </button>
      </div>
    </div>
  );
}
