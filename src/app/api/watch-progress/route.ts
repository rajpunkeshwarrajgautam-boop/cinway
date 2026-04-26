import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prismadb from '@/lib/prismadb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json([]);

    const user = await prismadb.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json([]);

    const progress = await prismadb.watchProgress.findMany({
      where: { userId: user.id, progress: { lt: 95 } },
      include: { movie: true },
      orderBy: { lastWatched: 'desc' },
      take: 20,
    });

    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 });

    const user = await prismadb.user.findUnique({ where: { email: session.user.email } });
    if (!user) return new NextResponse('User not found', { status: 404 });

    const { movieId, progress } = await req.json();

    const record = await prismadb.watchProgress.upsert({
      where: { userId_movieId: { userId: user.id, movieId } },
      update: { progress, lastWatched: new Date() },
      create: { userId: user.id, movieId, progress },
    });

    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}
