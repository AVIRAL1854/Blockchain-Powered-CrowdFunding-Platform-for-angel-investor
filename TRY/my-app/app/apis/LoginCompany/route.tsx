import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { corsMiddleware, setCorsHeaders } from "@/Components/CorsMiddleware";

const prisma = new PrismaClient();
const JWT_SECRET = "your-secret-key"; // Use a secure secret key (store it in environment variables)

export async function POST(req: NextRequest) {
  try {
    // Handle CORS
    const corsCheck = await corsMiddleware(req);
    if (corsCheck) return corsCheck; // Return CORS response for preflight requests

    const body = await req.json();
    const registrationNumber = body.data.registrationNumber;
    const password = body.data.password;

    let ans;

    // Validate credentials
    try {
      const company = await prisma.Company.findUnique({
        where: {
          registrationNumber, // Use registrationNumber as the unique identifier for the company
        },
      });

      if (!company || company.password !== password) {
        const response = NextResponse.json(
          { message: "Invalid credentials" },
          { status: 401 }
        );
        return setCorsHeaders(response); // Add CORS headers to the response
      }

      // Generate JWT token for the company
      const token = jwt.sign(
        {
          id: company.id,
          registrationNumber: company.registrationNumber,
          role: "company",
        },
        JWT_SECRET,
        { expiresIn: "1h" } // Token expires in 1 hour
      );

      ans = {
        message: "Company login successful",
        token, // Return the token to the frontend
      };
    } catch (error) {
      console.log("Error:", error.message);
      const errorResponse = NextResponse.json(
        { message: "Error occurred", error: error.message },
        { status: 500 }
      );
      return setCorsHeaders(errorResponse); // Add CORS headers to the error response
    }

    // Return success response
    const successResponse = NextResponse.json(
      {
        message: "This is working fine",
        response: ans,
      },
      { status: 200 }
    );
    return setCorsHeaders(successResponse); // Add CORS headers to the response
  } catch (error) {
    console.error("Error in POST route:", error.message);

    const errorResponse = NextResponse.json(
      {
        message: "Error occurred",
        error: error.message,
      },
      { status: 500 }
    );
    return setCorsHeaders(errorResponse); // Add CORS headers to the error response
  }
}
