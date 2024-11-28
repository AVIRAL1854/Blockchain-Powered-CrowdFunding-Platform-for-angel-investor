import Web3 from "web3";
import { NextResponse, NextRequest } from "next/server";
import { abi } from "@/Components/abi";
import EpochConverter from "@/Components/unix_calculator";
import { corsMiddleware, setCorsHeaders } from "@/components/CorsMiddleware";

const infuraUrl = "http://127.0.0.1:8545/";
const contractAddress = process.env.fake_contract_address;

export async function POST(req: NextRequest) {
  // Handle CORS
  const corsCheck = await corsMiddleware(req);
  if (corsCheck) return corsCheck; // Handle preflight requests

  const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
  const myContract = new web3.eth.Contract(abi, contractAddress);

  const body = await req.json();
  const deadline = EpochConverter.toTimestamp(
    body.data.year,
    body.data.month,
    body.data.date,
    0,
    0,
    0
  );
  console.log("This is the deadline: " + deadline);

  const campaignData = {
    owner: body.data.owner,
    title: body.data.title,
    description: body.data.description,
    target: body.data.target,
    deadline: deadline,
    amountCollected: body.data.amountCollected,
    image: body.data.image,
    accountAddress: body.data.accountAddress,
    equityTokens: body.data.equityTokens,
    equityTokenAddress: body.data.equityTokenAddress,
  };

  let hash;

  const createCampaigns = async (campaignData) => {
    const {
      title,
      description,
      target,
      deadline,
      image,
      equityTokens,
      equityTokenAddress,
    } = campaignData;

    try {
      const responseCreateCampaign = await myContract.methods
        .createCampaign(
          title,
          description,
          target,
          deadline,
          image,
          equityTokens,
          equityTokenAddress
        )
        .send({ from: body.data.accountAddress, gas: "3000000" });

      console.log(
        "Campaign created successfully: " +
          responseCreateCampaign.transactionHash
      );

      hash = responseCreateCampaign.transactionHash;
    } catch (error) {
      console.log("This is the custom error: " + error.message);
    }
  };

  await createCampaigns(campaignData);

  const response = NextResponse.json({
    message: "Yes, this is working fine",
    campaigns: hash,
  });

  // Add CORS headers to the response
  return setCorsHeaders(response);
}

// ---------------------->
// import Web3 from 'web3';
// import { NextResponse,NextRequest } from "next/server";
// import {abi } from "@/Components/abi";
// import EpochConverter from "@/Components/unix_calculator";
// // abi
// const infuraUrl = "http://127.0.0.1:8545/";
// const contractAddress=process.env.fake_contract_address;

// export async function POST(req:NextRequest){

//     const web3=new Web3(new Web3.providers.HttpProvider(infuraUrl));

//     const myContract= new web3.eth.Contract(abi,contractAddress);

//     const body= await req.json();
//     const deadline = EpochConverter.toTimestamp(body.data.year, body.data.month, body.data.date, 0, 0, 0);
//     console.log("this is the deadline :"+ deadline);
//     const campaignData={

//         owner:body.data.owner,
//         title:body.data.title,
//         description:body.data.description,
//         target:body.data.target,
//         deadline:deadline,
//         amountCollected:body.data.amountCollected,
//         image:body.data.image,
//         accountAddress:body.data.accountAddress,
//         equityTokens:body.data.equityTokens,
//         equityTokenAddress:body.data.equityTokenAddress

//     }
//     let Hash;
//     const CreateCampaigns=async (campaignData)=>{

//         const {
//           owner,
//           title,
//           description,
//           target,
//           deadline,
//           amountCollected,
//           image,
//           equityTokens,
//           equityTokenAddress,
//         } = campaignData;
//         try{
//             const responseCreateCampaign = await myContract.methods
//               .createCampaign(
//                 // owner,
//                 title,
//                 description,
//                 target,
//                 deadline,
//                 image,
//                 equityTokens,
//                 equityTokenAddress
//               )
//               .send({ from: body.data.accountAddress, gas: "3000000" });

//             console.log('campaign created successfully:'+ responseCreateCampaign.transactionHash);

//             Hash=responseCreateCampaign.transactionHash;
//         }

//         catch(error){
//             console.log("this is the custom error:"+ error.message);
//         }
//     }

//     await CreateCampaigns(campaignData);

//     return NextResponse.json({
//         message:" yes this is working fine",
//         campaigns:Hash
//     })

// }
