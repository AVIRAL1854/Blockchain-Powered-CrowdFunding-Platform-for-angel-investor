import { NextRequest, NextResponse } from "next/server";
import Web3 from "web3";
import { abi } from "@/Components/abi";

// const infuraUrl = `https://mainnet.infura.io/v3/${process.env.API_KEY}`;
const infuraUrl = "http://127.0.0.1:8545/";
// const contractAddress = process.env.CONTRACT_ADDRESS;
const contractAddress = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";

export async function GET(req: NextRequest) {
  const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
  const myContract = new web3.eth.Contract(abi, contractAddress);
  // const body=await req.json();

  let ans;

  const fetchCampaigns = async () => {
    try {
      const campaigns = await myContract.methods
        .getCampaigns()
        .call({ gas: "3000000" });
      ans = campaigns;
    } catch (error) {
      console.log("this is the error from contract" + error.message);
    }
  };

  await fetchCampaigns();

  // Convert BigInt values to strings
  const serializeCampaigns = (campaigns) => {
    return campaigns.map((campaign) => {
      return Object.fromEntries(
        Object.entries(campaign).map(([key, value]) => [
          key,
          typeof value === "bigint" ? value.toString() : value,
        ])
      );
    });
  };

  // console.log("this the response from campaigns:"+ ans);
  return NextResponse.json({
    message: "yes this is working fine",
    // abi: abi,
    // contractAddress: contractAddress,
    campaigns: ans ? serializeCampaigns(ans) : [],
  });
}
