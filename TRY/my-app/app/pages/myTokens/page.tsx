"use client";

import FormHeader from "@/Components/FormHeader";
import { FormInput, FormPara } from "@/Components/FormInput";
import SubmitButton from "@/Components/SubmitButton";
import axios from "axios";
import { useState } from "react";

export default function(){
    
    const [wallet, setWalletAddress]=useState("");
    const [tokenName, setTokenName]=useState("");
    const [tokenSymbol, setTokenSymbol]=useState("");
    const [tokenAmount,setTokenAmount]=useState(0);
    const [equity, setEquity]=useState(0);
    const [registrationNumber,setRegisrationNumber]=useState("");

    const handleClick=async()=>{
        
       try{

         const payload = {
          data: {
            "deployerAddress": wallet,
            "constructorArgs":[tokenAmount,tokenName,tokenSymbol,18,equity],
            "registrationNumber":"Oauth registration Number"
          }
        };
        const response = await axios.post(
          "http://localhost:3000/apis/makeEquityTokens",payload
        );
        alert("successfully generated token:");

       }catch(e){
        console.log("this is the message from the api:"+e.message);
        alert("failed");
       }
       
    }

    return (
      <div className=" flex justify-center ">
        {/* here you create or get list of your Token */}
        <div className="">
          <FormHeader title={"Launch Your Crowdfunding Campaign!!"} />
          <FormInput
            name="Owner's Wallet Address"
            placeholder="Enter wallet address"
            type="text"
            onChange={(e) => setWalletAddress(e.target.value)}
            value={wallet}
          />
          <FormInput
            name="Token Name"
            placeholder="Enter Token Name"
            type="text"
            onChange={(e) => setTokenName(e.target.value)}
            value={tokenName}
          />
          <FormInput
            name="Token Symbol"
            placeholder="Enter Token Symbol"
            type="text"
            onChange={(e) => setTokenSymbol(e.target.value)}
            value={tokenSymbol}
          />
          <FormInput
            name="Tokens Amount"
            placeholder="Enter Token Quantity"
            type="text"
            onChange={(e) => setTokenAmount(e.target.value)}
            value={Number(tokenAmount)}
          />
          <FormInput
            name="Equity dilution"
            placeholder="Enter Equity to dilute"
            type="text"
            onChange={(e) => setEquity(e.target.value)}
            value={Number(equity)}
          />
          <SubmitButton onClick={handleClick} />
        </div>
        <div className="">
          <FormHeader title={" List of ALL Company Tokens"} />
          <div>this is the list of  the token</div>
        </div>
      </div>
    );

}