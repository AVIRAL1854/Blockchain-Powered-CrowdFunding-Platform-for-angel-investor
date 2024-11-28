import { NextResponse, NextRequest } from "next/server";
import Web3 from "web3";
import { abi } from "@/Components/abi";
import prisma from "@/db";

const infuraUrl = "http://127.0.0.1:8545/";
const contractAddress = process.env.fake_contract_address;

// CORS headers configuration
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // For development - restrict in production
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
};

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Access-Control-Max-Age": "86400", // 24 hours cache for preflight
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    console.log("this is working");
    const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
    const myContract = new web3.eth.Contract(abi, contractAddress);
    const body = await req.json();
    let ans;

    // Function to convert BigInt values to strings (comprehensive approach)
    const convertBigIntToString = (data: any): any => {
      if (typeof data === "bigint") {
        return data.toString();
      } else if (Array.isArray(data)) {
        return data.map(convertBigIntToString);
      } else if (typeof data === "object" && data !== null) {
        return Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key,
            convertBigIntToString(value),
          ])
        );
      }
      return data;
    };

    const claimEquityTokens = async () => {
      try {
        const TokenResponse = await myContract.methods
          .claimEquityTokens(body.data.id)
          .send({ from: body.data.accountAddress, gas: "3000000" });

        console.log(
          "this is the response for the claimTokens: ",
          TokenResponse
        );

        const tokenQuantity =
          TokenResponse.events.TokensDistributed.returnValues.amount;
        const tokenAddress = TokenResponse.logs[1].address;

        const equity = parseFloat(tokenQuantity);

        const TokenClaimed = await prisma.UserToken.create({
          data: {
            tokenQuantity: parseInt(tokenQuantity),
            equity: equity,
            tokenName: "tokenName",
            tokenSymbol: "tokenSymbol",
            tokenAddress: tokenAddress,
          },
        });

        console.log(
          "this is the token claimed Database :" + JSON.stringify(TokenClaimed)
        );

        ans = convertBigIntToString(TokenResponse);
      } catch (error) {
        console.log("this is the error: ", error.message);
        throw error; // Propagate error to outer try-catch
      }
    };

    await claimEquityTokens();

    // Success response with CORS headers
    return new NextResponse(
      JSON.stringify({
        message: "this is working fine",
        response: ans,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    // Error response with CORS headers
    return new NextResponse(
      JSON.stringify({
        error: error.message || "An error occurred during token claim",
        status: "error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
}

// Configuration for API route
export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};
