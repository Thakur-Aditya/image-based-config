import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(
  request: Request,
  context: { params: { projectId: string } }
) {
  try {
    const { projectId } = context.params;
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Ensure upload directory exists in public folder
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const images = [];
    // Process images sequentially to maintain order
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const filename = `${Date.now()}-${file.name}`;
      const filepath = join(uploadDir, filename);

      // Write file to public/uploads directory
      await writeFile(filepath, buffer);

      // Create image record in database with correct public URL
      const image = await prisma.image.create({
        data: {
          url: `/uploads/${filename}`,
          sequence: index,
          projectId,
        },
      });
      images.push(image);
    }

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}
