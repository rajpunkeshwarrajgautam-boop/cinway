'use client';

import Navbar from '@/components/layout/Navbar';
import MovieRow from '@/components/movies/MovieRow';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SeriesPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const url = selectedGenre ? `/api/tvshows?genre=${encodeURIComponent(selectedGenre)}` : '/api/tvshows';
  const { data, isLoading } = useSWR(url, fetcher);

  if (isLoading) {
    return (
      <main className="page-wrapper">
        <Navbar />
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" style={{ width: 50, height: 50, border: '3px solid rgba(255,255,255,0.1)', borderRadius: '50%', borderTopColor: '#e50914', animation: 'spin 1s ease-in-out infinite' }} />
        </div>
      </main>
    );
  }

  const grouped = data?.grouped || {};
  const genres = data?.genres || [];

  return (
    <main className="page-wrapper" style={{ paddingBottom: '4rem' }}>
      <Navbar />
      <div style={{ paddingTop: '100px' }}>
        <div style={{ padding: '0 4vw', marginBottom: '2rem' }}>
          <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>TV Shows</h1>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedGenre(null)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: !selectedGenre ? '#e50914' : 'transparent',
                color: 'white',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            >
              All
            </button>
            {genres.map((genre: string) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: selectedGenre === genre ? '#e50914' : 'transparent',
                  color: 'white',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {selectedGenre ? (
          <MovieRow title={selectedGenre} movies={data?.shows || []} />
        ) : (
          Object.entries(grouped).map(([genre, shows]) => (
            <MovieRow key={genre} title={genre} movies={shows as any[]} />
          ))
        )}

        {Object.keys(grouped).length === 0 && !isLoading && (
          <div style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No TV Shows Available</h2>
            <p style={{ color: 'var(--text-muted)' }}>Run the TV show seed script to populate this section.</p>
          </div>
        )}
      </div>
    </main>
  );
}
