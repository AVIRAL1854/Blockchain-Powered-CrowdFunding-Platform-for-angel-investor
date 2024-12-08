import { NextRequest, NextResponse } from "next/server";
import NextCors from "nextjs-cors";
// import { corsMiddleware } from "@/Components/corsError";
import { corsMiddleware, setCorsHeaders } from "@/components/CorsMiddleware";

export async function POST(req: NextRequest) {
  const corsCheck = await corsMiddleware(req);
  if (corsCheck) return corsCheck; // Handle preflight requests

  const body = await req.json();

  console.log(JSON.stringify(body));

  const response = NextResponse.json({
    data: body,
  });
  

   return setCorsHeaders(response);
}
