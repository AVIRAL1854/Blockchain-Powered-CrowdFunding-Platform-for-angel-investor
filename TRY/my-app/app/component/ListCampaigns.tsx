"use client";
import CampaignCard, { CampaignCardInterface } from "./CampaignCard";
import campaignimage from "../assets/campaign.avif";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ListCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignCardInterface[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/apis/getCampaigns"
        );
        const data = response.data.campaigns;
        console.log(data);

        // Transform the data to match CampaignCardInterface
        const transformedCampaigns: CampaignCardInterface[] = data.titles.map(
          (title: string, index: number) => ({
            id: index,
            campaignTitle: title,
            description: data.descriptions[index] || "",
            target: parseInt(data.targets[index] || "0", 10),
            deadline: parseInt(data.deadlines[index] || "0", 10),
            image: campaignimage, // Placeholder image
            amountCollected: parseInt(data.amountsCollected[index] || "0", 10),
          })
        );

        setCampaigns(transformedCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <>
      <div className="flex justify-between mx-10">
        <h1 className="text-4xl font-bold">Campaigns</h1>
        <div>
          <button
            className="px-6 font-medium py-2 rounded-3xl bg-green-500 shadow-lg shadow-green-500"
            onClick={() => navigate("/campaign/add")}
          >
            Add
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center p-8 gap-6 md:flex-row flex-wrap justify-center">
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            id={campaign.id}
            campaignTitle={campaign.campaignTitle}
            description={campaign.description}
            target={campaign.target}
            deadline={campaign.deadline}
            image={campaign.image}
            amountCollected={campaign.amountCollected}
          />
        ))}
      </div>
    </>
  );
}

export default ListCampaigns;
