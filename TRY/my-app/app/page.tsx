"use client"
import Image from "next/image";
import ConnectWallet from "@/Components/ConnectWallet";
import { useEffect, useState } from "react";
import {abi} from '@/Components/abi';
import Web3 from "web3";

const CONTRACT_ADDRESS=process.env.REACT_APP_CONTRACT_ADDRESS;
const CONTRACT_ABI = process.env.REACT_APP_CONTRACT_ABI;

export default function Home() {

    const [account, setAccount] = useState<string>();
    const contractAddress = "0xD8555E9A128C07928C1429D834640372C8381828";
    // const abi = abi;

    useEffect(()=>{
        console.log("this is the account that you got" + account);    

        console.log("this is the contractAddress:"+contractAddress);
        console.log("this is the abi :"+ abi)
    },[])
 return (
   <div>
     <ConnectWallet setAccount={setAccount} />
     <div>
       <a href="/pages/AllCampaigns" className="text-blue-600 underline text-3xl">click here for the campaigns dashboard</a>
     </div>
   </div>
 );
}
