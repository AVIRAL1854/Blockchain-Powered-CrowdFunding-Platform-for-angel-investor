// lib/cors.js
import { NextResponse } from "next/server";

export async function corsMiddleware(request) {
  // Specify allowed origins for production
  const allowedOrigins = [
    "http://localhost:5173", // Your frontend development URL
    "http://localhost:3000", // Your backend URL
  ];

  // Check origin
  const origin = request.headers.get("origin") || "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Origin": isAllowedOrigin
          ? origin
          : allowedOrigins[0],
        "Access-Control-Max-Age": "86400", // Cache preflight for 24 hours
        Vary: "Origin", // Important for caching
      },
    });
  }

  // For actual requests, return response with CORS headers
  return null; // Indicating no interruption for normal flow
}

export function setCorsHeaders(response) {
  // Specify allowed origins
  const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

  // In a real-world scenario, dynamically set based on the request origin
  response.headers.set("Access-Control-Allow-Origin", allowedOrigins[0]);
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
