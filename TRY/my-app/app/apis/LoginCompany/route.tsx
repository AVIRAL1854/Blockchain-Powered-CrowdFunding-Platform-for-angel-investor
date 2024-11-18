import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = "your-secret-key"; // Use a secure secret key (store it in environment variables)

export async function POST(req: NextRequest) {
  const body = await req.json();
  const registrationNumber = body.data.registrationNumber;
  const password = body.data.password;

  let ans;
  try {
    // Check if the company exists and credentials are valid
    const company = await prisma.Company.findUnique({
      where: {
        registrationNumber, // Use registrationNumber as the unique identifier for the company
      },
    });

    if (!company || company.password !== password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token for the company
    const token = jwt.sign(
      { id: company.id, registrationNumber: company.registrationNumber, role: "company" },
      JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    ans = {
      message: "Company login successful",
      token, // Return the token to the frontend
    };
  } catch (error) {
    console.log("Error:", error.message);
    return NextResponse.json(
      { message: "Error occurred", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "This is working fine",
    response: ans,
  });
}
