import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { BACKEND_SERVER_URL } from "@/lib/constants"; // ajoute ton URL Render ici

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const numberSpeaker = Number(formData.get("numberSpeaker"));

    const audio = formData.get("audio") as File | null;
    const video = formData.get("video") as File | null;

    let audioLink: string | null = null;
    let videoLink: string | null = null;
    let fileSize = 0;

    const backendForm = new FormData();

    if (audio && audio.size > 0) {
      backendForm.append("audio", audio, audio.name);
      fileSize = audio.size;
    }

    if (video && video.size > 0) {
      backendForm.append("video", video, video.name);
      fileSize = video.size;
    }

    // Envoie directement les fichiers vers Render
    const backendResponse = await fetch(`${BACKEND_SERVER_URL}/media`, {
      method: "POST",
      body: backendForm,
    });

    const backendData = await backendResponse.json();

    // Tu peux stocker la référence dans Prisma si besoin
    const media = await prisma.media.create({
      data: {
        name,
        description,
        audioLink: backendData.audioLink ?? null,
        videoLink: backendData.videoLink ?? null,
        fileSize: fileSize.toString(),
        numberSpeaker,
      },
    });

    return NextResponse.json(media);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const res = await prisma.media.findMany();
    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json({ code: 404, message: "Erreur" });
  }
}
