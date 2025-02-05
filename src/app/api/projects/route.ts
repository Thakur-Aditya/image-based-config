import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all projects with their associated images
    const projects = await prisma.project.findMany({
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch projects",err },
      { status: 500 }
    );
  }
}
