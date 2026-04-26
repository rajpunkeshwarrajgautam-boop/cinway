import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prismadb from '@/lib/prismadb';

const PRICING: Record<string, number> = { BASIC: 499, STANDARD: 899, PREMIUM: 1499 };

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 });

    const adminEmail = process.env.ADMIN_EMAIL;
    if (session.user.email !== adminEmail) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const totalUsers = await prismadb.user.count();
    const activeSubscribers = await prismadb.user.count({
      where: { subscriptionStatus: 'ACTIVE' },
    });
    const basicCount = await prismadb.user.count({
      where: { subscriptionTier: 'BASIC', subscriptionStatus: 'ACTIVE' },
    });
    const standardCount = await prismadb.user.count({
      where: { subscriptionTier: 'STANDARD', subscriptionStatus: 'ACTIVE' },
    });
    const premiumCount = await prismadb.user.count({
      where: { subscriptionTier: 'PREMIUM', subscriptionStatus: 'ACTIVE' },
    });

    const estimatedRevenue =
      basicCount * PRICING.BASIC +
      standardCount * PRICING.STANDARD +
      premiumCount * PRICING.PREMIUM;

    const totalMovies = await prismadb.movie.count();
    const totalTvShows = await prismadb.tvShow.count();

    return NextResponse.json({
      totalUsers,
      activeSubscribers,
      tierBreakdown: { basic: basicCount, standard: standardCount, premium: premiumCount },
      estimatedMonthlyRevenue: estimatedRevenue,
      totalMovies,
      totalTvShows,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
