import { NextResponse, NextRequest } from "next/server";
import Web3 from "web3";
import { abi } from "@/Components/abi";
import prisma from "@/db";

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

      const tokenQuantity =
        TokenResponse.events.TokensDistributed.returnValues.amount; // 2121
      const tokenAddress = TokenResponse.logs[1].address; // Extract the token address from logs

      // Fetch token name and symbol dynamically from the contract
      // const tokenName = await contract.name();
      // const tokenSymbol = await contract.symbol();

      // If needed, calculate or assign equity (depending on your business logic)
      const equity =parseFloat(tokenQuantity);

      // Apply the comprehensive serialization

      const TokenClaimed = await prisma.UserToken.create({
        data: {
          tokenQuantity: parseInt(tokenQuantity), // from returnValues.amount
          equity: equity, // Calculated or retrieved value
          tokenName: "tokenName", // Dynamic value from contract
          tokenSymbol: "tokenSymbol", // Dynamic value from contract
          tokenAddress: tokenAddress,
          // From logs
        },
      });

      console.log("this is the token claimed Database :"+ JSON.stringify(TokenClaimed));

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
