"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import MovieCard from "@/components/movies/MovieCard";
import { MOVIE_DATABASE } from "@/lib/data";

const SearchContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const filteredMovies = useMemo(() => {
    if (!query) return [];
    
    return MOVIE_DATABASE.filter((movie) => {
      const searchStr = `${movie.title} ${movie.genre} ${movie.description}`.toLowerCase();
      return searchStr.includes(query.toLowerCase());
    });
  }, [query]);

  return (
    <div style={{ padding: '100px 4vw' }}>
      <h1 className="heading-section" style={{ marginBottom: '2rem' }}>
        {query ? `Results for "${query}"` : "Enter a search term"}
      </h1>

      {filteredMovies.length > 0 ? (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', 
            gap: '1rem' 
          }}
        >
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
          {query ? "No movies found matching your search." : "Discover your next favorite movie or show."}
        </div>
      )}
    </div>
  );
};

const Search = () => {
  return (
    <main className="page-wrapper" style={{ paddingBottom: '4rem' }}>
      <Navbar />
      <Suspense fallback={<div style={{ padding: '100px 4vw', color: 'white' }}>Loading search results...</div>}>
        <SearchContent />
      </Suspense>
    </main>
  );
};

export default Search;
