import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file: File | null = formData.get("audio") as unknown as File;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier audio reçu" }, { status: 400 });
  }

  // Transformer le fichier en buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Construire un formData pour envoyer vers ton backend Render
  const backendForm = new FormData();
  backendForm.append("audio", new Blob([buffer]), file.name);

  // Appeler ton backend Render
  const response = await fetch("https://jose-verba.onrender.com/upload-audio", {
    method: "POST",
    body: backendForm,
  });

  const result = await response.json();

  return NextResponse.json(result);
}
