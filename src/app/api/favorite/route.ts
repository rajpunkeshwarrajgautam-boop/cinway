import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    const { movieId } = await req.json();
    
    // Find User and their first profile
    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
      include: { profiles: true }
    });

    if (!user || user.profiles.length === 0) return new NextResponse("No profile found", { status: 400 });

    const profileId = user.profiles[0].id;

    const favorite = await prismadb.favorite.create({
      data: {
        movieId,
        profileId,
      }
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    const { movieId } = await req.json();

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
      include: { profiles: true }
    });

    if (!user || user.profiles.length === 0) return new NextResponse("No profile found", { status: 400 });

    const profileId = user.profiles[0].id;

    const favorite = await prismadb.favorite.delete({
      where: {
        movieId_profileId: {
          movieId,
          profileId,
        }
      }
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
