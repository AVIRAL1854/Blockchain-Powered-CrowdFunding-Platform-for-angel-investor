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

  const donateCampaign = async (id) => {
    try {
      const ResponseDonateCampaign = await myContract.methods
        .donateToCampaign(id)
        .send({
          from: body.data.accountAddress,
          gas: "3000000",
          value: body.data.value,
        });

      console.log("this is the responseData : " + ResponseDonateCampaign);

      // Convert BigInt values to strings
      const serializeCampaigns = (ResponseDonateCampaign) => {
        return ResponseDonateCampaign.map((ResponseDonateCampaign) => {
          return Object.fromEntries(
            Object.entries(ResponseDonateCampaign).map(([key, value]) => [
              key,
              typeof value === "bigint" ? value.toString() : value,
            ])
          );
        });
      };
      ans = serializeCampaigns;
    } catch (error) {
      console.log("this is the custom error:" + error.message);
    }
  };

  await donateCampaign(body.data.id);

  return NextResponse.json({
    message: "this was successfull and done",
    response: ans,
  });
}
