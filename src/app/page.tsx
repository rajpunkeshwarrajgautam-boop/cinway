'use client';

import Navbar from '@/components/layout/Navbar';
import Billboard from '@/components/movies/Billboard';
import MovieRow from '@/components/movies/MovieRow';
import InfoModal from '@/components/movies/InfoModal';
import useFavorites from '@/hooks/useFavorites';
import { useMemo } from 'react';
import useSWR from 'swr';
import type { Movie } from '@prisma/client';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data: movieData, error, isLoading } = useSWR('/api/movies', fetcher);
  const { data: favorites } = useFavorites();
  const { data: watchProgress } = useSWR('/api/watch-progress', fetcher);

  const favoriteMovies = useMemo(() => {
    if (!favorites || !movieData?.trendingMovies) return [];
    const favoriteIds = favorites.map((fav: any) => fav.movieId);
    return movieData.trendingMovies.filter((movie: Movie) => favoriteIds.includes(movie.id));
  }, [favorites, movieData]);

  const continueWatchingMovies = useMemo(() => {
    if (!watchProgress || !Array.isArray(watchProgress)) return [];
    return watchProgress.map((wp: any) => wp.movie).filter(Boolean);
  }, [watchProgress]);

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <div className="spinner" style={{ width: 50, height: 50, border: '3px solid rgba(255,255,255,0.1)', borderRadius: '50%', borderTopColor: '#e50914', animation: 'spin 1s ease-in-out infinite' }} />
      </div>
    );
  }

  if (error || !movieData) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>Failed to load movies</div>;
  }

  const { heroMovie, trendingMovies, actionMovies, dramaMovies } = movieData;

  return (
    <main className="page-wrapper" style={{ paddingBottom: '4rem' }}>
      <Navbar />
      <Billboard movie={heroMovie} />
      
      <div style={{ marginTop: '-8vw', position: 'relative', zIndex: 30 }}>
        {continueWatchingMovies.length > 0 && (
          <MovieRow title="Continue Watching" movies={continueWatchingMovies} />
        )}
        {favoriteMovies.length > 0 && (
           <MovieRow title="My List" movies={favoriteMovies} />
        )}
        <MovieRow title="Trending Now" movies={trendingMovies} />
        <MovieRow title="Action Packed" movies={actionMovies} />
        <MovieRow title="Critically Acclaimed Dramas" movies={dramaMovies} />
      </div>

      <InfoModal />

      <footer style={{ marginTop: '8rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Cinway &copy; {new Date().getFullYear()}</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Built autonomously with God Mode UI specs.</p>
      </footer>
    </main>
  );
}
