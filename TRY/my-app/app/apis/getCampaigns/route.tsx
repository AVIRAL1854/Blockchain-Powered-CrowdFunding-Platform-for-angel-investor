import { NextRequest, NextResponse } from "next/server";
import Web3 from "web3";
import { abi } from "@/Components/abi";

// const infuraUrl = `https://mainnet.infura.io/v3/${process.env.API_KEY}`;
const infuraUrl = "http://127.0.0.1:8545/";
// const contractAddress = process.env.CONTRACT_ADDRESS;
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
  const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
  const myContract = new web3.eth.Contract(abi, contractAddress);

  let ans;

  const fetchCampaigns = async () => {
    try {
      const campaigns = await myContract.methods
        .getAllCampaigns()
        .call({ gas: "3000000" });
      console.log("Fetched campaigns:", campaigns);
      ans = campaigns;
    } catch (error) {
      console.log("This is the error from contract: " + error.message);
      ans = null; // Explicitly set ans to null in case of an error
    }
  };

  await fetchCampaigns();

  // Convert all BigInt values to strings
  const serializedCampaigns = ans ? convertBigIntToString(ans) : [];

  // Debug log to verify serialization
  console.log("Serialized campaigns:", serializedCampaigns);

  return NextResponse.json({
    message: ans
      ? "Successfully fetched campaigns"
      : "Error fetching campaigns",
    campaigns: serializedCampaigns,
  });
}
