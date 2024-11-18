import { NextResponse, NextRequest } from "next/server";
import Web3 from "web3";
import { abi } from "@/Components/abi";

const infuraUrl = "http://127.0.0.1:8545/";
const contractAddress = process.env.fake_contract_address;

export async function POST(req: NextRequest) {
  console.log("this is working");
  const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
  const myContract = new web3.eth.Contract(abi, contractAddress);
  const body = await req.json();
  let ans;

  // Function to convert BigInt values to strings (comprehensive approach)
  const convertBigIntToString = (data: any): any => {
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

  const claimEquityTokens = async () => {
    try {
      const TokenResponse = await myContract.methods
        .claimEquityTokens(body.data.id)
        .send({ from: body.data.accountAddress, gas: "3000000" });

      console.log("this is the response for the claimTokens: ", TokenResponse);

      // Apply the comprehensive serialization
      ans = convertBigIntToString(TokenResponse);
    } catch (error) {
      console.log("this is the error: ", error.message);
      ans = error.message;
    }
  };

  await claimEquityTokens();

  return NextResponse.json({
    message: "this is working fine",
    response: ans,
  });
}
