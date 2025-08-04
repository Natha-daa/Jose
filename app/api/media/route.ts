import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import prisma from '@/lib/prisma';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // On récupère le FormData natif
  const formData = await req.formData();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const numberSpeaker = Number(formData.get('numberSpeaker'));

  const uploadDir = path.join(process.cwd(), '/public/uploads');

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  let audioLink = null;
  let videoLink = null;
  let fileSize = 0;

  // Vérifie s'il y a un fichier audio
  const audio = formData.get('audio') as File | null;
  const video = formData.get('video') as File | null;

  if (audio && audio.size > 0) {
    const bytes = await audio.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}_${audio.name}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    audioLink = `/uploads/${fileName}`;
    fileSize = audio.size;
  }

  if (video && video.size > 0) {
    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}_${video.name}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    videoLink = `/uploads/${fileName}`;
    fileSize = video.size;
  }

  const media = await prisma.media.create({
    data: {
      name,
      description,
      audioLink,
      videoLink,
      fileSize: fileSize.toString(),
      numberSpeaker,
    },
  });

  return NextResponse.json(media);
}

export async function GET(req:NextRequest) {
  try {
    const res = await prisma.media.findMany()
    return NextResponse.json(res)

  } catch (e) {
    return NextResponse.json({
      code: 404,
      message: "Error occured"
    })
  }
  
}
