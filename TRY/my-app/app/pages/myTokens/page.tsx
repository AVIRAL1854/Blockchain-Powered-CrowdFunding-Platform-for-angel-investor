"use client";

import FormHeader from "@/Components/FormHeader";
import { FormInput, FormPara } from "@/Components/FormInput";
import SubmitButton from "@/Components/SubmitButton";
import axios from "axios";
import { useState } from "react";
import TableDemo from "@/Components/tableMaker";

export default function MyTokens() {
  const [wallet, setWalletAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);
  const [equity, setEquity] = useState(0);
  const [registrationNumber, setRegistrationNumber] = useState("");

  const handleClick = async () => {
    try {
      const payload = {
        data: {
          deployerAddress: wallet,
          constructorArgs: [tokenAmount, tokenName, tokenSymbol, 18, equity],
          registrationNumber: "Oauth registration Number",
        },
      };
      const response = await axios.post(
        "http://localhost:3000/apis/makeEquityTokens",
        payload
      );
      alert("Successfully generated token!");
    } catch (e) {
      console.log("Error from the API: " + e.message);
      alert("Failed to generate token.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center space-y-8 lg:space-x-8 lg:space-y-0 p-4">
      {/* First div (Form Section) */}
      <div className="w-full max-w-xl bg-white p-6 shadow-lg rounded-lg space-y-6">
        <FormHeader title={"Launch Your Company Tokens!!"} />
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
          type="number"
          onChange={(e) => setTokenAmount(e.target.value)}
          value={tokenAmount}
        />
        <FormInput
          name="Equity dilution"
          placeholder="Enter Equity to dilute"
          type="number"
          onChange={(e) => setEquity(e.target.value)}
          value={equity}
        />
        <SubmitButton onClick={handleClick} />
      </div>

      {/* Second div (Table Section) */}
      <div className="w-full max-w-4xl bg-white p-6 shadow-lg rounded-lg space-y-4">
        <FormHeader title={"List of Your Company Tokens"} />
        <div className="text-lg font-semibold">
          This is the list of the tokens:
        </div>
        <TableDemo />
      </div>
    </div>
  );
}
