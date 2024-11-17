import Web3 from "web3";
import { NextResponse, NextRequest } from "next/server";
import { abi } from "@/Components/abi";

const infuraUrl = "http://127.0.0.1:8545/";
const contractAddress = process.env.fake_contract_address;

export async function POST(req: NextRequest) {
  const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
  const myContract = new web3.eth.Contract(abi, contractAddress);
  const body = await req.json();
  let ans;

  // Function to convert BigInt values to strings
  const convertBigIntToString = (data) => {
    if (typeof data === "bigint") {
      return data.toString(); // Convert BigInt to string
    } else if (Array.isArray(data)) {
      return data.map(convertBigIntToString); // Recursively process arrays
    } else if (typeof data === "object" && data !== null) {
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          convertBigIntToString(value),
        ])
      ); // Recursively process objects
    }
    return data; // Return other types as-is
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

      // Apply serialization to handle BigInt values
      ans = convertBigIntToString(ResponseDonateCampaign);
    } catch (error) {
      console.log("this is the custom error:", error.message);
      ans = error.message; // Return error message in case of failure
    }
  };

  await donateCampaign(body.data.id);

  return NextResponse.json({
    message: "this was successful and done",
    response: ans,
  });
}
