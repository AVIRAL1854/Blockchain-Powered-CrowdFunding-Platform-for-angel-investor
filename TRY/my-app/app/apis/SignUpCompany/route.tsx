import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { corsMiddleware, setCorsHeaders } from "@/Components/CorsMiddleware"; // Assuming corsMiddleware and setCorsHeaders are available

export async function POST(req: NextRequest) {
  try {
    // Handle CORS
    const corsCheck = await corsMiddleware(req);
    if (corsCheck) return corsCheck; // Return CORS response for preflight requests

    const body = await req.json();
    const {
      walletAddress,
      password,
      link: VedioLink,
      registrationNumber,
      concent,
    } = body.data;

    let ans;
    console.log(
      "this is the :" +
        walletAddress +
        "\nthis is the password" +
        password +
        "\nVedioLink" +
        VedioLink +
        "\nCompany Resgistration Number:" +
        registrationNumber
    );

    const newCompany = await prisma.Company.create({
      data: {
        registrationNumber,
        password,
        walletAddress,
      },
    });

    console.log(
      "this is the response from the database :" + JSON.stringify(newCompany)
    );
    ans = newCompany;

    const response = NextResponse.json({
      message: "this is working fine",
      response: ans,
    });

    return setCorsHeaders(response); // Add CORS headers to the response
  } catch (error) {
    console.error("Custom error:", error.message);
    const errorResponse = NextResponse.json(
      {
        error: error.message,
        details: error,
      },
      { status: 500 }
    );

    return setCorsHeaders(errorResponse); // Add CORS headers to error response
  }
}

export async function OPTIONS() {
  const response = NextResponse.json({});
  return setCorsHeaders(response); // Add CORS headers for OPTIONS preflight response
}
