import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
  console.warn('TMDB_API_KEY is not configured. Movie data will be limited.');
}

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  release_date: string;
  vote_average: number;
  video?: boolean;
}

const genreMap: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export function getGenreName(genreId: number): string {
  return genreMap[genreId] || 'Other';
}

export function getGenresFromIds(genreIds: number[]): string {
  if (genreIds.length === 0) return 'Other';
  return genreIds.map(id => genreMap[id]).filter(Boolean).join(', ') || 'Other';
}

export async function fetchTrendingMovies(): Promise<TmdbMovie[]> {
  try {
    const response = await tmdbApi.get('/trending/movie/week');
    return response.data.results.filter((m: TmdbMovie) => !m.video);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
}

export async function fetchMoviesByGenre(genreId: number): Promise<TmdbMovie[]> {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: genreId,
        sort_by: 'popularity.desc',
      },
    });
    return response.data.results.filter((m: TmdbMovie) => !m.video);
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return [];
  }
}

export async function fetchMovieDetails(movieId: number): Promise<TmdbMovie & { runtime?: number }> {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

export async function searchMovies(query: string): Promise<TmdbMovie[]> {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: { query },
    });
    return response.data.results.filter((m: TmdbMovie) => !m.video);
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
}

export function getImageUrl(path: string | null, size: 'w500' | 'w780' | 'w1280' | 'original' = 'w500'): string {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function formatDuration(minutes?: number): string {
  if (!minutes) return 'Unknown';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}
