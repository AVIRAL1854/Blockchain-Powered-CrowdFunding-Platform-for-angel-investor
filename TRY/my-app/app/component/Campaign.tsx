"use client"
import { useLocation, useNavigate } from "react-router-dom";
import campaignimage from "../assets/campaign.avif";

export interface CampaignInterface {
    id: number;
    campaignTitle: string;
    description: string[];
    target: number;
    amountCollected: number;
    image: string;
    donators: { name: string; amount: number }[];
}

function Campaign() {
    const navigate = useNavigate();
    const location = useLocation();
    const { 
        id,
        campaignTitle,
        description,
        target,
        amountCollected,
        image,
        donators, } = location.state as CampaignInterface;  // Make sure the id type is correct

    const progressPercentage = Math.floor((amountCollected / target) * 100);

    return (
        <div className="flex flex-col scrollbar-thin scrollbar-thumb-scroll-thumb scrollbar-track-scroll-track scrollbar-thumb-rounded gap-6 bg-white text-black p-6 shadow-lg w-full mx-auto md:p-10">
            {/* Campaign Title */}
            <div className="text-2xl font-bold mb-4 text-center md:text-4xl lg:text-5xl">
                {campaignTitle}
            </div>

            {/* Campaign Image */}
            <img
                src={campaignimage}
                alt="Campaign Image"
                className="w-fit h-56 object-cover rounded-lg shadow-md m-auto md:h-64 md:h-80"
            />

            {/* Campaign Description */}
            <div className="flex flex-col gap-3">
                <div className="text-lg font-semibold md:text-xl lg:2xl">Description</div>
                <div className="flex flex-col gap-3 text-sm text-gray-800 leading-relaxed px-2 italic md:text-base lg:text-lg">
                    {description}  
                </div>
            </div>

            {/* Target and Amount Collected */}
            <div className="flex justify-between text-sm font-semibold md:text-base lg:text-lg">
                <div>Target: <span className="text-green-400">Wei {target.toLocaleString()}</span></div>
                <div>Collected: <span className="text-green-400">Wei {amountCollected.toLocaleString()}</span></div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-3 dark:bg-gray-700 md:h-4 lg:h-5">
                <div
                    className="bg-green-500 h-3 rounded-full md:h-4 lg:h-5"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
            <div className="text-sm text-gray-800">Progress: {progressPercentage}%</div>

            {/* Donate Button */}
            <button className="self-center px-5 py-2 bg-green-500 rounded-lg text-white font-semibold hover:bg-green-600 transition-colors duration-300" onClick={() => navigate("/donate", {
                state: {id: id}
            })}>
                Donate Now
            </button>
        </div>
    );
}

export default Campaign;
