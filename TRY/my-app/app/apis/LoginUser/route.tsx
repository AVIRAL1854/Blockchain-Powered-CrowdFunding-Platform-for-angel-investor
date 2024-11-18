import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
//   const walletAddress = body.data.walletAddress;
  const email = body.data.email;
  const password = body.data.password;

  let ans;
  try {
    console.log(
      "this is the :" +
        "walletAddress" +
        "\nthis is email" +
        email +
        "\nthis is the password" +
        password
    );

    // check whether already present or not

    // if not then create a new entry in database
  } catch (error) {
    console.log("this is the custom error :" + error.message);
  }

  return NextResponse.json({
    message: "this is working fine",
    response: ans,
  });
}
