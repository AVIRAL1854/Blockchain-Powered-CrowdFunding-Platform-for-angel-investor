import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = "your-secret-key"; // Replace with a secure secret key

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body.data.email;
  const password = body.data.password;

  let ans;
  try {
    console.log(
      "this is the :" +
        "\nthis is email" +
        email +
        "\nthis is the password" +
        password
    );

    // Find the investor by email and password
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
      { expiresIn: "1h" } // Token expiration time (1 hour in this case)
    );

    console.log(
      "this is the newCompany Response :" + JSON.stringify(LoginInvestor)
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
    console.log("this is the custom error :" + error.message);
    ans = error.message;
  }

  return NextResponse.json({
    message: "this is working fine",
    response: ans,
  });
}
