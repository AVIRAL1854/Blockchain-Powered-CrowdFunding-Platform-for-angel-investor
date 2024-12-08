import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";

// CORS Middleware to handle preflight requests
const corsMiddleware = (req) => {
  if (req.method === "OPTIONS") {
    return NextResponse.json(null, {
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  return null; // Proceed to the next middleware/handler
};

// Set CORS headers to response
const setCorsHeaders = (response) => {
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
};

export async function POST(req) {
  // Handle CORS preflight request
  const corsCheck = corsMiddleware(req);
  if (corsCheck) return corsCheck;

  try {
    // Parse the request body
    const body = await req.json();
    const { walletAddress, email, password } = body.data;

    console.log(
      `Wallet: ${walletAddress}, Email: ${email}, Password: ${password}`
    );

    // Create a new investor entry in the database
    const newInvestor = await prisma.Investor.create({
      data: {
        email,
        password,
        walletAddress,
      },
    });

    console.log(`Database response: ${JSON.stringify(newInvestor)}`);

    // Return successful response with CORS headers
    const response = NextResponse.json({
      message: "This is working fine",
      response: newInvestor,
    });

    return setCorsHeaders(response); // Set CORS headers before returning response
  } catch (error) {
    // Handle errors and return them with CORS headers
    console.error(`Error: ${error.message}`);
    const errorResponse = NextResponse.json({
      message: "An error occurred",
      response: error.message,
    });

    return setCorsHeaders(errorResponse); // Set CORS headers on error response
  }
}

export async function OPTIONS(req) {
  // Return preflight response with CORS headers
  return corsMiddleware(req);
}
