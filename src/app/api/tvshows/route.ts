import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get('genre');

    const where = genre ? { genre } : {};
    const shows = await prismadb.tvShow.findMany({ where, orderBy: { rating: 'desc' } });

    const genres = await prismadb.tvShow.findMany({
      select: { genre: true },
      distinct: ['genre'],
    });
    const uniqueGenres = genres.map((g) => g.genre);

    const grouped: Record<string, typeof shows> = {};
    for (const show of shows) {
      if (!grouped[show.genre]) grouped[show.genre] = [];
      grouped[show.genre].push(show);
    }

    return NextResponse.json({ shows, genres: uniqueGenres, grouped });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch TV shows' }, { status: 500 });
  }
}
