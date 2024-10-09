import Web3 from 'web3';
import { NextResponse,NextRequest } from "next/server";
import {abi } from "@/Components/abi"

const infuraUrl = "http://127.0.0.1:8545/";
const contractAddress=process.env.fake_contract_address;    

export async function POST(req:NextRequest){

    const web3=new Web3(new Web3.providers.HttpProvider(infuraUrl));

    const myContract= new web3.eth.Contract(abi,contractAddress); 
    
    const body= await req.json();

    const campaignData={

        owner:body.data.owner,
        title:body.data.title,
        description:body.data.description,
        target:body.data.target,
        deadline:body.data.deadline,
        amountCollected:body.data.amountCollected,
        image:body.data.image,
        accountAddress:body.data.accountAddress

    }
    let Hash;
    const CreateCampaigns=async (campaignData)=>{

        const {
          owner,
          title,
          description,
          target,
          deadline,
          amountCollected,
          image,
        } = campaignData;
        try{
            const responseCreateCampaign = await myContract.methods
              .createCampaigns(
                owner,
                title,
                description,
                target,
                deadline,
                image
              )
              .send({ from: body.data.accountAddress, gas: "3000000" });    

            console.log('campaign created successfully:'+ responseCreateCampaign.transactionHash);

            Hash=responseCreateCampaign.transactionHash;    
        }

        catch(error){
            console.log("this is the custom error:"+ error.message);
        }
    }

    await CreateCampaigns(campaignData);


    return NextResponse.json({
        message:" yes this is working fine",
        campaigns:Hash
    })
    

}