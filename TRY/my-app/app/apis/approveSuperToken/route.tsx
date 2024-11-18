import { NextRequest, NextResponse } from "next/server";
import Web3 from "web3";
import { EquityABI } from "@/Components/EquityABI";

const infuraUrl = "http://127.0.0.1:8545/";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const contractAddress = body.data.contractAddress;
  const toApproveAddress = body.data.toApproveAddress;
  const ownerAddress = body.data.ownerAddress;
  const tokenValue = body.data.tokenValue;
  const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
  const myContract = new web3.eth.Contract(EquityABI, contractAddress);
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

  const approveToken = async (tokenValue, toApproveAddress, ownerAddress) => {
    try {
      const responseApproveToken = await myContract.methods
        .approve(toApproveAddress, tokenValue)
        .send({
          from: ownerAddress,
          gas: "3000000",
        });

      console.log("Approval successful: ", responseApproveToken);

      // Apply serialization to handle BigInt values
      ans = convertBigIntToString(responseApproveToken);
    } catch (error) {
      console.log("This is the custom error: " + error.message);
      ans = { error: error.message }; // Return error message in case of failure
    }
  };

  await approveToken(tokenValue, toApproveAddress, ownerAddress);

  return NextResponse.json({
    message: "This is successful",
    response: ans,
  });
}
