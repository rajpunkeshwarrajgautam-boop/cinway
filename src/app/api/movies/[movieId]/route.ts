import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  request: Request,
  { params }: { params: { movieId: string } }
) {
  try {
    const { movieId } = await params;

    if (!movieId || typeof movieId !== 'string') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const movie = await prismadb.movie.findUnique({
      where: {
        id: movieId
      }
    });

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch movie' }, { status: 500 });
  }
}
