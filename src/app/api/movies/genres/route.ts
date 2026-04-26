import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get('genre');

    const where = genre ? { genre } : {};
    const movies = await prismadb.movie.findMany({ where, orderBy: { rating: 'desc' } });

    const genres = await prismadb.movie.findMany({
      select: { genre: true },
      distinct: ['genre'],
    });
    const uniqueGenres = genres.map((g) => g.genre);

    return NextResponse.json({ movies, genres: uniqueGenres });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}
