import { NextRequest, NextResponse } from "next/server";
import { BACKEND_SERVER_URL } from "@/lib/constants"; // ton URL Render ici

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const numberSpeaker = Number(formData.get("numberSpeaker"));

    const audio = formData.get("audio") as File | null;
    const video = formData.get("video") as File | null;

    const backendForm = new FormData();

    backendForm.append("name", name);
    backendForm.append("description", description);
    backendForm.append("numberSpeaker", numberSpeaker.toString());

    if (audio && audio.size > 0) {
      backendForm.append("audio", audio, audio.name);
    }

    if (video && video.size > 0) {
      backendForm.append("video", video, video.name);
    }

    // Envoie directement vers l’API Render
    const backendResponse = await fetch(`${BACKEND_SERVER_URL}/media`, {
      method: "POST",
      body: backendForm,
    });

    if (!backendResponse.ok) {
      const text = await backendResponse.text();
      throw new Error(`Erreur backend: ${text}`);
    }

    const backendData = await backendResponse.json();

    // Retour JSON directement vers le front
    return NextResponse.json(backendData);
  } catch (err) {
    console.error("Erreur POST /media:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const backendResponse = await fetch(`${BACKEND_SERVER_URL}/media`);
    if (!backendResponse.ok) {
      const text = await backendResponse.text();
      throw new Error(`Erreur backend: ${text}`);
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Erreur GET /media:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
