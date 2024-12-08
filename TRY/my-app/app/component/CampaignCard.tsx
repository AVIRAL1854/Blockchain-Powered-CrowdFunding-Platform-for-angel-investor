"use client"
import { redirect } from "next/dist/server/api-utils"
// import { useNavigate } from "react-router-dom"


export interface CampaignCardInterface {
    id: number
    campaignTitle: string
    description: string
    target: number
    deadline: number
    image: string
    amountCollected: number
}

function CampaignCard({id, campaignTitle, description, target, deadline, image, amountCollected}: CampaignCardInterface) {
    let progressPercentage = Math.floor((amountCollected / target) * 100);

    // const navigate = useNavigate()

    function formatDeadline(deadline: number) {
        const date = new Date(deadline * 1000); // Convert Unix timestamp to Date
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`; // Return formatted date
    }

    return (
        <div 
            className="flex flex-col max-w-xs gap-4 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300"
            onClick={() =>redirect(`pages/campaign/${id}`, {
                state: {id, campaignTitle, description, target, deadline, image, amountCollected}
            })}
        >
            <div className="text-gray-800 text-xl font-bold truncate">{campaignTitle}</div>
            <img className="rounded-lg object-cover h-40 w-full" src={image} alt="campaign image" />
            <div className="flex justify-between text-sm text-gray-600">
                <div>
                Target: <span className="text-amber-500">Wei {target.toLocaleString()}</span>
                </div>
                <div>
                Collected: <span className="text-green-500">Wei {amountCollected.toLocaleString()}</span>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                className="bg-amber-500 h-2.5 rounded-full dark:bg-amber-600"
                style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
            <div className="text-gray-600 text-sm">
                Deadline: <span className="font-semibold text-gray-800">{formatDeadline(deadline)}</span>
            </div>
            <div className="cursor-pointer bg-gray-800 z-100 w-fit px-4 py-2 rounded-lg text-white font-semibold text-center transition-colors duration-300 hover:bg-gray-900" >
                Donate
            </div>
        </div>

    );
}

export default CampaignCard;
