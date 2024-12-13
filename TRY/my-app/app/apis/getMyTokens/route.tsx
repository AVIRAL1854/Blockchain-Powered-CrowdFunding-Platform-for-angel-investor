import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

export   async function POST(req: NextRequest) {
  try {
    
    const body = await req.json();
    const response = await prisma.CompanyTokens.findMany({
      where: {
        registrationNumber: process.env.resgisrationNumber
      },
    });

    console.log(
      "this is the getMyToken Route prisma response:" + JSON.stringify(response)
    );

    return NextResponse.json({
      message: "this is working fine",
      response: response,
    });
  } catch (e) {
    console.log("here is  the error:" + e.message);
    return NextResponse.json({
      message: "this is not working fine and here is the error",
      response: JSON.stringify(e.message),
    });
  }
}
