// lib/cors.js
import { NextResponse } from "next/server";

export async function corsMiddleware(request) {
  // Handle preflight (OPTIONS) requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Max-Age": "86400", // Cache preflight for 24 hours
        Vary: "Origin", // Important for caching
      },
    });
  }

  // For actual requests, let it proceed
  return null; // Indicating no interruption for normal flow
}

export function setCorsHeaders(response) {
  // Add CORS headers to the response
  response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Vary", "Origin");
  return response;
}
