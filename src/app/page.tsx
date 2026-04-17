'use client';

import Navbar from '@/components/layout/Navbar';
import Billboard from '@/components/movies/Billboard';
import MovieRow from '@/components/movies/MovieRow';
import { getHeroMovie, getTrendingMovies, getActionMovies, getDramaMovies, MOVIE_DATABASE } from '@/lib/data';
import useFavorites from '@/hooks/useFavorites';
import { useMemo } from 'react';

export default function Home() {
  const heroMovie = getHeroMovie();
  const trendingMovies = getTrendingMovies();
  const actionMovies = getActionMovies();
  const dramaMovies = getDramaMovies();
  
  const { data: favorites } = useFavorites();

  const favoriteMovies = useMemo(() => {
    if (!favorites) return [];
    const favoriteIds = favorites.map((fav: any) => fav.movieId);
    return MOVIE_DATABASE.filter((movie) => favoriteIds.includes(movie.id));
  }, [favorites]);

  return (
    <main className="page-wrapper" style={{ paddingBottom: '4rem' }}>
      <Navbar />
      <Billboard movie={heroMovie} />
      
      <div style={{ marginTop: '-8vw', position: 'relative', zIndex: 30 }}>
        {favoriteMovies.length > 0 && (
          <MovieRow title="My List" movies={favoriteMovies} />
        )}
        <MovieRow title="Trending Now" movies={trendingMovies} />
        <MovieRow title="Action Packed" movies={actionMovies} />
        <MovieRow title="Critically Acclaimed Dramas" movies={dramaMovies} />
      </div>

      <footer style={{ marginTop: '8rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Cinway &copy; {new Date().getFullYear()}</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Built autonomously with God Mode UI specs.</p>
      </footer>
    </main>
  );
}
