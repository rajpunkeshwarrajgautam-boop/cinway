import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prismadb from '@/lib/prismadb';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 });

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
      include: { profiles: { orderBy: { createdAt: 'asc' } } },
    });

    if (!user) return new NextResponse('User not found', { status: 404 });

    return NextResponse.json({ profiles: user.profiles, avatarOptions: AVATAR_OPTIONS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 });

    const user = await prismadb.user.findUnique({ where: { email: session.user.email } });
    if (!user) return new NextResponse('User not found', { status: 404 });

    const existingProfiles = await prismadb.profile.count({ where: { userId: user.id } });
    if (existingProfiles >= 5) {
      return NextResponse.json({ error: 'Maximum 5 profiles allowed' }, { status: 400 });
    }

    const { name, imageUrl } = await req.json();

    const profile = await prismadb.profile.create({
      data: {
        name: name || `Profile ${existingProfiles + 1}`,
        imageUrl: imageUrl || AVATAR_OPTIONS[existingProfiles % AVATAR_OPTIONS.length],
        userId: user.id,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 });

    const { profileId, name, imageUrl } = await req.json();

    const profile = await prismadb.profile.update({
      where: { id: profileId },
      data: { name, imageUrl },
    });

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 });

    const { profileId } = await req.json();

    await prismadb.profile.delete({ where: { id: profileId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
  }
}
