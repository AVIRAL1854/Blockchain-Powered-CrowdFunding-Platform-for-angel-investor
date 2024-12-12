"use client";

import { useSearchParams, useRouter } from "next/navigation"; // Import useSearchParams
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { error } from "console";

export interface CampaignInterface {
  id: number;
  campaignTitle: string;
  description: string[];
  target: number;
  amountCollected: number;
  image: string;
}

function Campaign() {
  const searchParams = useSearchParams(); // Access the query parameters
  const router = useRouter();

  // Retrieve the state from the query params and parse it
  const stateParam = searchParams.get("state");
  let locationState: CampaignInterface | null = null;

  if (stateParam) {
    try {
      locationState = JSON.parse(decodeURIComponent(stateParam));
    } catch (error) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl font-semibold text-red-600">
            Invalid campaign data!{" "}
            <span
              className="text-blue-600 cursor-pointer underline"
              onClick={() => router.push("/")}
            >
              Go Back
            </span>
          </p>
        </div>
      );
    }
  }

  if (!locationState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-gray-800">
          No campaign data found!{" "}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => router.push("/")}
          >
            Go Back
          </span>
        </p>
      </div>
    );
  }

  const {
    id,
    campaignTitle,
    description,
    target,
    amountCollected,
    image,
    donators,
  } = locationState;

  const progressPercentage = Math.min(
    Math.floor((amountCollected / target) * 100),
    100
  );

  const [accountAddress, setAccountAddress] = useState("");
  const [donationAmount, setDonationAmount] = useState();

  const handlerDonate = async () => {
    console.log("11donate handler is clicked");
    // console.log("donate handler is clicked");

    try {
      if (donationAmount != null && accountAddress != null) {
        const body = {
          data: {
            value: Number(donationAmount),
            id: id,
            accountAddress: accountAddress,
          },
        };
        const response = await axios.post(
          "http://localhost:3000/apis/donateToCampaign",
          body
        );

        console.log(
          "this is the response of the donation :" + JSON.stringify(response)
        );
      } else {
        throw new Error("account address or donation amount is not set ");
      }
    } catch (e) {
      console.log("this is the error :" + JSON.stringify(e.message));
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-white text-black p-6 shadow-lg w-full mx-auto md:p-10 max-w-4xl">
      {/* Campaign Title */}
      <h1 className="text-3xl font-bold mb-4 text-center md:text-4xl lg:text-5xl">
        {campaignTitle}
      </h1>

      {/* Campaign Image */}
      <div className="relative w-full h-64 md:h-80">
        <Image
          src={image || "/placeholder.jpg"} // Fallback for missing image
          alt="Campaign Image"
          fill
          className="object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Campaign Description */}
      <section>
        <h2 className="text-lg font-semibold md:text-xl lg:text-2xl">
          Description
        </h2>
        <p className="text-sm text-gray-800 leading-relaxed px-2 italic md:text-base lg:text-lg">
          {description}
        </p>
      </section>

      {/* Target and Amount Collected */}
      <div className="flex justify-between text-sm font-semibold md:text-base lg:text-lg">
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
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-green-500 h-3 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Donators Section */}
      {/* <section>
        <h2 className="text-lg font-semibold mt-6 md:text-xl lg:text-2xl">
          Recent Donations
        </h2>
        {donators.length ? (
          <ul className="list-disc pl-5 mt-3 space-y-2 text-sm text-gray-700">
            {donators.map((donator, index) => (
              <li key={index}>
                <strong>{donator.name}</strong> donated{" "}
                <span className="text-green-500">
                  Wei {donator.amount.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No donations yet.</p>
        )}
      </section> */}

      {/* Back Button */}
      <input
        className="bg-gray-800 px-4 py-2 rounded-lg text-white font-semibold mt-6 w-fit self-center hover:bg-gray-900"
        placeholder="enter the account Address"
        onChange={(e) => {
          setAccountAddress(e.target.value);
          console.log(accountAddress);
        }}
      />
      <input
        className="bg-gray-800 px-4 py-2 rounded-lg text-white font-semibold mt-6 w-fit self-center hover:bg-gray-900 hover:ring-5 hover:ring-blue-500"
        placeholder="enter the Amount "
        onChange={(e) => {
          setDonationAmount(e.target.value);
          console.log(donationAmount);
        }}
      />

      <button
        className="bg-green-500 px-4 py-2 rounded-lg text-white font-semibold mt-6 w-fit self-center hover:bg-gray-900 hover:ring-2 hover:ring-green-500 hover:text-green-500 hover:bg-white"
        onClick={handlerDonate}
      >
        Donate
      </button>
      <button
        className="bg-gray-800 px-4 py-2 rounded-lg text-white font-semibold mt-6 w-56 self-center hover:bg-gray-900"
        onClick={() => router.push("/pages/AllCampaigns")}
      >
        Go Back
      </button>
    </div>
  );
}

export default Campaign;
