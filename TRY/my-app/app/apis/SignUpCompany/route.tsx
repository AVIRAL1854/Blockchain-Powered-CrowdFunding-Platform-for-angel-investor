import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const walletAddress = body.data.walletAddress;
  const password = body.data.password;
  const VedioLink = body.data.link;
  const registrationNumber = body.data.registrationNumber;
  const concent = body.data.concent;

  let ans;
  try {
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
  } catch (error) {
    console.log("this is the custom error :" + error.message);
    ans = error.message;
  }

  // Set CORS headers
  const response = NextResponse.json({
    message: "this is working fine",
    response: ans,
  });

  response.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}

export async function OPTIONS() {
  const response = NextResponse.json({});
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
