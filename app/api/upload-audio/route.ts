import { NextRequest, NextResponse } from "next/server";
import { BACKEND_SERVER_URL } from "@/lib/constants"; // à créer si pas déjà

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier audio reçu" }, { status: 400 });
    }

    // Juste renvoyer le fichier tel quel vers Render
    const backendForm = new FormData();
    backendForm.append("audio", file, file.name);

    const response = await fetch(`${BACKEND_SERVER_URL}/upload-audio`, {
      method: "POST",
      body: backendForm,
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: text }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

