import Web3 from "web3";
import { NextResponse, NextRequest } from "next/server";
import { abi } from "@/Components/abi";
import prisma from "@/db";
import { cors } from "@/lib/cors";

const infuraUrl = "http://127.0.0.1:8545/";
const contractAddress = process.env.fake_contract_address;

// Create a middleware to handle CORS
async function corsMiddleware(request: NextRequest) {
  // Check if it's a preflight request
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Origin": "*", // For development. In production, specify your domain
        "Access-Control-Max-Age": "86400", // 24 hours cache for preflight requests
      },
    });
  }

  // For actual requests, add CORS headers to the response
  const response = new NextResponse();
  response.headers.set("Access-Control-Allow-Origin", "*"); // For development
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

export async function POST(req: NextRequest) {
  try {
    // Handle CORS first
    const corsCheck = await corsMiddleware(req);
    if (req.method === "OPTIONS") {
      return corsCheck;
    }

    const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
    const myContract = new web3.eth.Contract(abi, contractAddress);
    const body = await req.json();
    let ans;

    // Function to convert BigInt values to strings
    const convertBigIntToString = (data) => {
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

    const donateCampaign = async (id) => {
      try {
        const ResponseDonateCampaign = await myContract.methods
          .donateToCampaign(id)
          .send({
            from: body.data.accountAddress,
            gas: "3000000",
            value: body.data.value,
          });

        console.log("this is the responseData: ", ResponseDonateCampaign);

        const donatingResponseStore = await prisma.DonateToCampaign.create({
          data: {
            campaignId: id,
            donation: body.data.value,
          },
        });

        console.log(
          "this is database call for storing donating database:" +
            JSON.stringify(donatingResponseStore)
        );

        ans = convertBigIntToString(ResponseDonateCampaign);
      } catch (error) {
        console.log("this is the custom error:", error.message);
        throw error; // Propagate error to outer try-catch
      }
    };

    await donateCampaign(body.data.id);

    // Create response with CORS headers
    return new NextResponse(
      JSON.stringify({
        message: "this was successful and done",
        response: ans,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // For development
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    // Error response with CORS headers
    return new NextResponse(
      JSON.stringify({
        error: error.message || "An error occurred",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // For development
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}

// Export config to enable CORS
export const config = {
  api: {
    bodyParser: true,
  },
};
