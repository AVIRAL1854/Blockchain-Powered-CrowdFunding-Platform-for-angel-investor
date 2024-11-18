import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const walletAddress = body.data.walletAddress;
//   const email = body.data.email;
  const password = body.data.password;
//   const Equity = body.data.equity;
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

    // check whether already present or not

    // if not then create a new entry in database
  } catch (error) {
    console.log("this is the custom error :" + error.message);
    ans=error.message
  }

  return NextResponse.json({
    message: "this is working fine",
    response: ans,
  });
}
