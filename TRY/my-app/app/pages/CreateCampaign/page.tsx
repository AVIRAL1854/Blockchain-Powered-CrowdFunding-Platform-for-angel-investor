"use client";
import { useState } from "react";
import axios from "axios";
import TableDemo from "@/Components/tableMaker";
import FormHeader from "@/Components/FormHeader";
import { FormInput, FormPara } from "@/Components/FormInput";
import SubmitButton from "@/Components/SubmitButton";
import { useRouter } from "next/navigation";
// import contractAddress from "@/Components/contractAddress";

const contractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

function CreateCampaign() {
  const imageArray = [
    "https://images.pexels.com/photos/29510136/pexels-photo-29510136/free-photo-of-stunning-snowy-matterhorn-mountain-peak-in-switzerland.jpeg",
    "https://images.pexels.com/photos/5859768/pexels-photo-5859768.jpeg",
    "https://images.pexels.com/photos/29575236/pexels-photo-29575236/free-photo-of-charming-porticoed-street-in-bologna-italy.jpeg",
    "https://images.pexels.com/photos/11513527/pexels-photo-11513527.jpeg",
  ];

  const [walletAddr, setWalletAddr] = useState<string>("");
  const [campaignName, setCampaignName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [tokenApproved, setTokenApproved] = useState(false);

  const route = useRouter();

  function resetFormFields() {
    setWalletAddr("");
    setCampaignName("");
    setDescription("");
    setTarget("");
    setDeadline("");
    setTokenAmount("");
    setTokenAddress("");
  }

  const TokenApprovalHandler = async () => {
    if (tokenAddress != null && tokenAmount != null) {
      try {

        // const contractAddress = process.env.fake_contract_address;
        console.log("contract Address:"+String(contractAddress))
        const payload = {
          data: {
            contractAddress: tokenAddress,
            toApproveAddress: contractAddress,
            ownerAddress: walletAddr,
            tokenValue: tokenAmount,
          },
        };

        console.log(JSON.stringify(payload))
        const response = await axios.post(
          "http://localhost:3000/apis/approveSuperToken",
          payload
        );
        alert("Successfully Approved");
        setTokenApproved(true);
      } catch (e) {
        alert("Approval Failed");
        console.log("Error:", e.message);
      }
    }
  };

  async function handleClick() {
    if (!deadline) return;

    const date = new Date(deadline);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const randomImagePicker = () => {
      const randomIndex = Math.floor(Math.random() * imageArray.length);
      return imageArray[randomIndex];
    };

    const payload = {
      data: {
        owner: walletAddr,
        title: campaignName,
        description: description,
        target: Number(target),
        date: day,
        month: month,
        year: year,
        image: randomImagePicker(),
        accountAddress: walletAddr,
        equityTokens: tokenAmount,
        equityTokenAddress: tokenAddress,
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/apis/createCampaigns",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Response:", response.data);
      resetFormFields();
      route.push("/pages/AllCampaigns");
    } catch (error) {
      alert(error);
      console.error("Error creating campaign:", error);
    }
  }

  return (
    <div className="w-full bg-white p-4">
      <div className="flex flex-col md:flex-row gap-6 p-4 rounded-lg max-w-full mx-auto shadow-2xl">
        {/* Form Section */}
        <div className="flex-1">
          <FormHeader title={"Launch Your Crowdfunding Campaign!!"} />
          <FormInput
            name="Owner's Wallet Address"
            placeholder="Enter wallet address"
            type="text"
            onChange={(e) => setWalletAddr(e.target.value)}
            value={walletAddr}
          />
          <FormInput
            name="Name"
            placeholder="Enter campaign name"
            type="text"
            onChange={(e) => setCampaignName(e.target.value)}
            value={campaignName}
          />
          <FormPara
            name="Description"
            placeholder="Write a detailed description of your crowdfunding campaign"
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <FormInput
            name="Target"
            placeholder="Enter target amount"
            type="number"
            onChange={(e) => setTarget(e.target.value)}
            value={target}
          />
          <FormInput
            name="Deadline"
            placeholder="Enter deadline"
            type="date"
            onChange={(e) => setDeadline(e.target.value)}
            value={deadline}
          />
          <div>
            <FormInput
              name="Token Amount"
              placeholder="Enter the token amount"
              type="text"
              onChange={(e) => setTokenAmount(e.target.value)}
              value={tokenAmount}
            />
            <FormInput
              name="Token Address"
              placeholder="Enter the token address"
              type="text"
              onChange={(e) => setTokenAddress(e.target.value)}
              value={tokenAddress}
            />
            <button
              onClick={TokenApprovalHandler}
              className="text-white bg-green-500 mt-2 py-3 px-2 rounded-lg hover:border border-green-400 hover:shadow-lg hover:shadow-green-400 transition-shadow duration-300 font-semibold md:font-medium text-lg"
            >
              Approve Tokens
            </button>
          </div>

          <SubmitButton onClick={handleClick} />
        </div>

        {/* List of Tokens Section */}
        <div className="w-full md:w-1/2 bg-white p-6 shadow-lg rounded-lg space-y-4 mt-6 md:mt-0">
          <FormHeader title={"List of Your Company Tokens"} />
          <div className="text-lg font-semibold">
            This is the list of the tokens:
          </div>
          <div className="overflow-x-auto">
            <div className="flex flex-wrap justify-between md:flex-row gap-4">
              <TableDemo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCampaign;
