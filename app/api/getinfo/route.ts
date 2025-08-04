import { NextRequest, NextResponse } from "next/server"
import {execa} from "execa"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.nextUrl)
  const url = searchParams.get("url")
  if (!url) {
    return NextResponse.json({ error: "url parameter is required" }, { status: 400 })
  }

  const info = await getInfo(url)
  if (!info) {
    return NextResponse.json({ error: "Failed to get info" }, { status: 500 })
  }

  return NextResponse.json(info)
}

async function getInfo(url: string) {
  const command = ["ffprobe", "-v", "error", "-show_entries", "format=duration,size", "-of", "json", url]
  const { stdout, stderr } = await execa(command[0], command.slice(1))

  if (stderr) {
    console.error(stderr)
    return null
  }

  const { format } = JSON.parse(stdout)
  return {
    duration: format.duration,
    fileSize: parseInt(format.size,10)/ (1024),
  }
}
