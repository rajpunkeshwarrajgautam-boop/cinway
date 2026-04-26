'use client';

import Navbar from '@/components/layout/Navbar';
import MovieRow from '@/components/movies/MovieRow';
import useFavorites from '@/hooks/useFavorites';
import useSWR from 'swr';
import { useMemo } from 'react';
import type { Movie } from '@prisma/client';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function List() {
  const { data: movieData } = useSWR('/api/movies', fetcher);
  const { data: favorites } = useFavorites();

  const favoriteMovies = useMemo(() => {
    if (!favorites || !movieData?.trendingMovies) return [];
    const favoriteIds = favorites.map((fav: any) => fav.movieId);
    return movieData.trendingMovies.filter((movie: Movie) => favoriteIds.includes(movie.id));
  }, [favorites, movieData]);

  return (
    <main className="page-wrapper" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
        {favoriteMovies.length > 0 ? (
           <MovieRow title="My List" movies={favoriteMovies} />
        ) : (
           <div style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>
             <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your list is empty.</h2>
             <p style={{ color: 'var(--text-muted)' }}>Add shows and movies to your list to watch them later.</p>
           </div>
        )}
      </div>
    </main>
  );
}
