import { NextRequest, NextResponse } from "next/server";
import Web3 from "web3";
import { abi } from "@/Components/abi";
import { corsMiddleware, setCorsHeaders } from "@/Components/CorsMiddleware";

const infuraUrl = "http://127.0.0.1:8545/";
const contractAddress = process.env.fake_contract_address;

// Recursive function to convert BigInt to strings
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

export async function GET(req: NextRequest) {
  try {
    // Handle CORS
    const corsCheck = await corsMiddleware(req);
    if (corsCheck) return corsCheck; // Return CORS response for preflight requests

    const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
    const myContract = new web3.eth.Contract(abi, contractAddress);

    let campaigns;

    // Fetch campaigns from the contract
    const fetchCampaigns = async () => {
      try {
        const result = await myContract.methods.getAllCampaigns().call({
          gas: "3000000",
        });
        // console.log("Fetched campaigns:", result);
        return result;
      } catch (error) {
        console.error("Error fetching campaigns from contract:", error.message);
        throw new Error("Failed to fetch campaigns from the blockchain.");
      }
    };

    campaigns = await fetchCampaigns();

    // Convert all BigInt values to strings
    const serializedCampaigns = convertBigIntToString(campaigns);

    // Debug log to verify serialization
    // console.log("Serialized campaigns:", serializedCampaigns);

    const response = NextResponse.json(
      {
        message: "Successfully fetched campaigns",
        campaigns: serializedCampaigns,
      },
      { status: 200 }
    );

    return setCorsHeaders(response); // Add CORS headers to the response
  } catch (error) {
    console.error("Error in GET route:", error.message);

    const errorResponse = NextResponse.json(
      {
        message: "Error fetching campaigns",
        error: error.message,
      },
      { status: 500 }
    );

    return setCorsHeaders(errorResponse); // Add CORS headers to the error response
  }
}

// Export config for API route
export const config = {
  api: {
    bodyParser: false, // Disable body parsing for GET requests
  },
};
