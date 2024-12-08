"use client";

import { useRouter } from "next/navigation";
import campaignimage from "@/app/assets/campaign.avif"

export interface CampaignCardInterface {
  id: number;
  campaignTitle: string;
  description: string;
  target: number;
  deadline: number;
  image: string;
  amountCollected: number;
}

function CampaignCard({
  id,
  campaignTitle,
  description,
  target,
  deadline,
  image,
  amountCollected,
}: CampaignCardInterface) {
  const router = useRouter();
  const progressPercentage = Math.floor((amountCollected / target) * 100);

  function formatDeadline(deadline: number) {
    const date = new Date(deadline * 1000); // Convert Unix timestamp to Date
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Return formatted date
  }

const handleCardClick = () => {
  const state = {
    id,
    campaignTitle,
    description,
    target,
    deadline,
    image,
    amountCollected,
  };

  // Use `router.push` to navigate and pass the state in the query parameters
  const stateParam = encodeURIComponent(JSON.stringify(state));
  router.push(`/pages/campaign/${id}?state=${stateParam}`);
};


  return (
    <div
      className="flex flex-col max-w-xs gap-4 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300"
      onClick={handleCardClick}
    >
      {/* Campaign Title */}
      <div className="text-gray-800 text-xl font-bold truncate">
        {campaignTitle}
      </div>

      {/* Campaign Image */}
      <img
        className="rounded-lg object-cover h-40 w-full"
        src={campaignimage}
        alt="campaign image"
      />

      {/* Target and Collected */}
      <div className="flex justify-between text-sm text-gray-600">
        <div>
          Target:{" "}
          <span className="text-amber-500">Wei {target.toLocaleString()}</span>
        </div>
        <div>
          Collected:{" "}
          <span className="text-green-500">
            Wei {amountCollected.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-amber-500 h-2.5 rounded-full dark:bg-amber-600"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Deadline */}
      <div className="text-gray-600 text-sm">
        Deadline:{" "}
        <span className="font-semibold text-gray-800">
          {formatDeadline(deadline)}
        </span>
      </div>

      {/* Donate Button */}
      <div className="cursor-pointer bg-gray-800 z-100 w-fit px-4 py-2 rounded-lg text-white font-semibold text-center transition-colors duration-300 hover:bg-gray-900">
        Donate
      </div>
    </div>
  );
}

export default CampaignCard;
