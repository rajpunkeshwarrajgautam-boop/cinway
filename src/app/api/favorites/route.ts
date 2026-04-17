import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
      include: { profiles: { include: { myList: true } } }
    });

    if (!user || user.profiles.length === 0) return new NextResponse("No profile found", { status: 400 });

    // Return the movie IDs in the list
    const favorites = user.profiles[0].myList;

    return NextResponse.json(favorites);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
