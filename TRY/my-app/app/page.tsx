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
    const contractAddress ="0xf5568af61b089440008183ef92a3296c075a8c15";
    // const abi = abi;

    useEffect(()=>{
        console.log("this is the account that you got" + account);    

        console.log("this is the contractAddress:"+contractAddress);
        console.log("this is the abi :"+ abi)
    },[])
 return (<div>
  <ConnectWallet  setAccount={setAccount}/>
 </div>);
}
