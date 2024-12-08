import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { corsMiddleware, setCorsHeaders } from "@/Components/CorsMiddleware";

const prisma = new PrismaClient();
const JWT_SECRET = "your-secret-key"; // Replace with a secure secret key

export async function POST(req: NextRequest) {
  try {
    // Handle CORS
    const corsCheck = await corsMiddleware(req);
    if (corsCheck) return corsCheck; // Return CORS response for preflight requests

    const body = await req.json();
    const email = body.data.email;
    const password = body.data.password;

    let ans;

    try {
      console.log(
        "this is the :" +
          "\nthis is email: " +
          email +
          "\nthis is the password: " +
          password
      );

      // Find the investor by email
      const LoginInvestor = await prisma.Investor.findUnique({
        where: {
          email,
        },
      });

      // Check if the investor exists and the password matches
      if (!LoginInvestor || LoginInvestor.password !== password) {
        throw new Error("Invalid email or password");
      }

      // Create a JWT token
      const token = jwt.sign(
        { id: LoginInvestor.id, email: LoginInvestor.email },
        JWT_SECRET,
        { expiresIn: "1h" } // Token expiration time (1 hour)
      );

      console.log(
        "this is the LoginInvestor Response: " + JSON.stringify(LoginInvestor)
      );

      ans = {
        user: {
          id: LoginInvestor.id,
          email: LoginInvestor.email,
          role: "investor",
        },
        token, // Include the JWT token in the response
      };
    } catch (error) {
      console.error("Custom error: " + error.message);
      const errorResponse = NextResponse.json(
        { message: error.message },
        { status: 401 }
      );
      return setCorsHeaders(errorResponse); // Add CORS headers to the error response
    }

    // Return success response
    const successResponse = NextResponse.json(
      {
        message: "Investor login successful",
        response: ans,
      },
      { status: 200 }
    );
    return setCorsHeaders(successResponse); // Add CORS headers to the success response
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
