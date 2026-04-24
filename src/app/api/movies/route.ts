import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const limit = parseInt(searchParams.get('limit') || '10');

    let movies;
    
    if (genre) {
      movies = await prismadb.movie.findMany({
        where: {
          genre: { contains: genre, mode: 'insensitive' }
        },
        take: limit,
        orderBy: { releaseYear: 'desc' }
      });
    } else {
      movies = await prismadb.movie.findMany({
        take: limit,
        orderBy: { releaseYear: 'desc' }
      });
    }

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}
