"use client";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import FormHeader from "./FormHeader"; // Assuming you have these components
import { FormInput } from "./FormInput";
import SubmitButton from "./SubmitButton";

function DonateToCampaign() {
  const location = useLocation();
  const { id } = location.state as { id: any }; // Make sure the id type is correct
  const [walletAddr, setWalletAddr] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const navigate = useNavigate();

  // Check if the id is a valid number
  const isValidId = !isNaN(Number(id));

  async function handleClick() {
    const body = {
      data: {
        value: parseInt(amount),
        accountAddress: walletAddr,
        id: id,
      },
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/apis/donateToCampaign",
        body
      );
      console.log("Response:", response.data);
      alert("Amount donated successfully");
      navigate("/dashboard");
    } catch (error) {
      alert(error);
      console.error("Error creating campaign:", error);
    }
  }

  if (!isValidId) {
    return (
      <div className="w-full bg-white p-4 flex justify-center items-center">
        <div className="text-center text-lg text-red-600">
          <p>Error: Invalid campaign ID. Please ensure the ID is correct.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4">
      <div className="flex flex-col gap-3 p-4 rounded-lg max-w-[700px] mx-auto shadow-2xl">
        <FormHeader title={"Donate to Campaign"} />
        <FormInput
          name="Wallet Address"
          placeholder="Enter wallet address"
          type="text"
          onChange={(e) => setWalletAddr(e.target.value)}
          value={walletAddr}
        />
        <FormInput
          name="Amount"
          placeholder="Enter donation amount"
          type="text"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
        <SubmitButton onClick={handleClick} />
      </div>
    </div>
  );
}

export default DonateToCampaign;
