import { NextResponse } from 'next/server';
import type { Movie } from '@prisma/client';
import prismadb from '@/lib/prismadb';

export async function GET() {
  try {
    const allMovies = await prismadb.movie.findMany();
    
    if (!allMovies || allMovies.length === 0) {
      return NextResponse.json({
        heroMovie: null,
        trendingMovies: [],
        actionMovies: [],
        dramaMovies: []
      });
    }

    const heroMovie = allMovies[0];
    const trendingMovies = allMovies;
    const actionMovies = allMovies.filter((m: Movie) =>
      ['Action', 'Sci-Fi', 'Thriller'].includes(m.genre)
    );
    const dramaMovies = allMovies.filter((m: Movie) => ['Drama', 'Crime'].includes(m.genre));

    return NextResponse.json({
      heroMovie,
      trendingMovies,
      actionMovies,
      dramaMovies
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}
