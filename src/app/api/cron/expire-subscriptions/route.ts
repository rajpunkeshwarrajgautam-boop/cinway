import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const now = new Date();

    const expiredUsers = await prismadb.user.updateMany({
      where: {
        subscriptionStatus: 'ACTIVE',
        subscriptionEndDate: { lt: now },
      },
      data: {
        subscriptionStatus: 'INACTIVE',
        subscriptionTier: 'NONE',
      },
    });

    return NextResponse.json({
      message: `Expired ${expiredUsers.count} subscription(s)`,
      expiredCount: expiredUsers.count,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
