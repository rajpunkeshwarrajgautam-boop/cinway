'use client';

import Navbar from '@/components/layout/Navbar';
import MovieRow from '@/components/movies/MovieRow';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LatestPage() {
  const { data: movieData, isLoading: moviesLoading } = useSWR('/api/movies', fetcher);
  const { data: tvData, isLoading: tvLoading } = useSWR('/api/tvshows', fetcher);

  const isLoading = moviesLoading || tvLoading;

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

  const trendingMovies = movieData?.trendingMovies || [];
  const tvShows = tvData?.shows || [];

  const latestMovies = [...trendingMovies].sort((a: any, b: any) => b.releaseYear - a.releaseYear);
  const latestShows = [...tvShows].sort((a: any, b: any) => {
    const dateA = a.firstAirDate ? new Date(a.firstAirDate).getTime() : 0;
    const dateB = b.firstAirDate ? new Date(b.firstAirDate).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <main className="page-wrapper" style={{ paddingBottom: '4rem' }}>
      <Navbar />
      <div style={{ paddingTop: '100px' }}>
        <div style={{ padding: '0 4vw', marginBottom: '2rem' }}>
          <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 700 }}>New & Popular</h1>
        </div>

        {latestMovies.length > 0 && <MovieRow title="Latest Movies" movies={latestMovies} />}
        {latestShows.length > 0 && <MovieRow title="Latest TV Shows" movies={latestShows} />}

        {latestMovies.length === 0 && latestShows.length === 0 && (
          <div style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Nothing new yet</h2>
            <p style={{ color: 'var(--text-muted)' }}>Check back later for new content.</p>
          </div>
        )}
      </div>
    </main>
  );
}
