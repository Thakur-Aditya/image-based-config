import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = createProjectSchema.parse(body);
    console.log(name, description);

    const project = await prisma.project.create({
      data: { name, description },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Invalid project data" },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(projects);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
