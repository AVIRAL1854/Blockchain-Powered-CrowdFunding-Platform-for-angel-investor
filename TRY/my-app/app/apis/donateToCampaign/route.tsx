import Web3 from "web3";
import { NextResponse, NextRequest } from "next/server";
import { abi } from "@/Components/abi";
import prisma from "@/db";
import { corsMiddleware, setCorsHeaders } from "@/Components/CorsMiddleware";

const infuraUrl = "http://127.0.0.1:8545/";
const contractAddress = process.env.fake_contract_address;

export async function POST(req: NextRequest) {
  try {
    // Handle CORS
    const corsCheck = await corsMiddleware(req);
    if (corsCheck) return corsCheck; // Return response for CORS preflight requests

    const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
    const myContract = new web3.eth.Contract(abi, contractAddress);
    const body = await req.json();
    let ans;

    // Function to convert BigInt values to strings
    const convertBigIntToString = (data) => {
      if (typeof data === "bigint") return data.toString();
      if (Array.isArray(data)) return data.map(convertBigIntToString);
      if (typeof data === "object" && data !== null)
        return Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key,
            convertBigIntToString(value),
          ])
        );
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

    const response = NextResponse.json(
      {
        message: "this was successful and done",
        response: ans,
      },
      {
        status: 200,
      }
    );

    return setCorsHeaders(response); // Add CORS headers to the response
  } catch (error) {
    const errorResponse = NextResponse.json(
      {
        error: error.message || "An error occurred",
      },
      {
        status: 500,
      }
    );

    return setCorsHeaders(errorResponse); // Add CORS headers to error response
  }
}

// Export config for API route
export const config = {
  api: {
    bodyParser: true,
  },
};
