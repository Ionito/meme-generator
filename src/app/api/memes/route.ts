import memes from "@/app/(data)/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return await NextResponse.json(memes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  memes.unshift(body);

  return NextResponse.json(memes);
}
