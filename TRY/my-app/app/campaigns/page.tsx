"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import Web3 from "web3";
import {abi} from "@/Components/abi";

const CONTRACT_ADDRESS = "0xB2b47810e997A5Dc97B9D0Ac99611971eCcdcdD2";

const page = () => {
   const [web3, setWeb3] = useState();
  const [contract, setContract] = useState();
  const [account, setAccount] = useState(null);
  const [value, setValue] = useState(null);
    const [campaigns, setCampaigns] = useState([]);

 useEffect(() => {
    const initWeb3 = async () => {
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          const contractInstance = new web3Instance.eth.Contract(abi, CONTRACT_ADDRESS);
          // console.log("this is the contract Instance :"+ contractInstance.contractMethodEstimateGas)
          setContract(contractInstance);
          console.log("success")
        } catch (error) {
          console.error('Error initializing Web3:', error);
        }
      } else {
        console.log('Please install MetaMask!');
      }
    };

    initWeb3();
  }, []);

  const getCampaigns=async()=>{
      try{
        if(contract == null){
          throw new Error("contract is null ")
        }
        // const CampaignData= await contract.methods.getCampaigns();
        
        //     setCampaigns(CampaignData);

        const fetchedCampaigns = await contract.methods.getCampaigns().call();
        const formattedCampaigns = fetchedCampaigns.map((campaign) => ({
          owner: campaign[0],
          title: campaign[1],
          description: campaign[2], // Note: There's still a typo in your contract ('descrption')
          target: web3.utils.fromWei(campaign[3], "ether"),
          deadline: new Date(
            parseInt(campaign[4]) * 1000
          ).toLocaleDateString(),
          amountCollected: web3.utils.fromWei(campaign[5], "ether"),
          image: campaign[6],
          donators: campaign[7],
          donations: campaign[8].map((amount) =>
            web3.utils.fromWei(amount, "ether")
        ),
      }));
      setCampaigns(formattedCampaigns);
      console.log("this is the campaign data :"+campaigns)
      }catch(e){
        console.log(e);
      }
  }

  return<div>hi there
    <input type="button" value="click here" onClick={getCampaigns} />
  </div>

}
export default page;
