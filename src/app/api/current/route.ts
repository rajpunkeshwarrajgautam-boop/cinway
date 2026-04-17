import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Not signed in", { status: 401 });
    }

    const currentUser = await prismadb.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!currentUser) {
      return new NextResponse("Not signed in", { status: 401 });
    }

    return NextResponse.json(currentUser);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
