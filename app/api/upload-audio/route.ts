  import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file: File | null = formData.get("audio") as unknown as File;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier audio reçu" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/\s+/g, "_");
  const fileName = `${timestamp}-${sanitizedName}`;
  const filePath = path.join(uploadDir, fileName);
  console.log(filePath)
  await writeFile(filePath, buffer);

  const downloadURL = `uploads/${fileName}`;

  return NextResponse.json({ downloadURL });
}
