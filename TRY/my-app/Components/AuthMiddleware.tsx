import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = "your-secret-key"; // Replace with a secure secret key

export async function authMiddleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Authorization header missing" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1]; // Extract the token
  if (!token) {
    return NextResponse.json({ message: "Token missing" }, { status: 401 });
  }

  try {
    // Verify JWT
    const decodedToken = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      role: string;
    };
    const { id, email, role } = decodedToken;

    let user;

    if (role === "investor") {
      // Verify details from Investor table
      user = await prisma.Investor.findUnique({
        where: { id },
      });

      if (!user || user.email !== email) {
        throw new Error("Invalid investor credentials");
      }
    } else if (role === "company") {
      // Verify details from Company table
      user = await prisma.Company.findUnique({
        where: { id },
      });

      if (!user || user.email !== email) {
        throw new Error("Invalid company credentials");
      }
    } else {
      throw new Error("Invalid role");
    }

    // If everything is valid, attach the user to the request
    req.user = { id, email, role };
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token", error: error.message },
      { status: 401 }
    );
  }
}
