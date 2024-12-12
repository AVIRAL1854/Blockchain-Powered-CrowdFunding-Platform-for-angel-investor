"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormHeader from "@/Components/FormHeader";
import { FormInput } from "@/Components/FormInput";
import SubmitButton from "@/Components/SubmitButton";

export default function DonateCampaign() {
  const [deadline, setDeadline] = useState<string>("");
  const router = useRouter();

  const handleClick = () => {
    // If the deadline is empty, just return
    if (!deadline) return;

    // Convert the deadline string to a Date object
    const date = new Date(deadline);

    // Extract day, month, and year
    const day = date.getDate(); // Day of the month (1-31)
    const month = date.getMonth() + 1; // Month (0-11, so add 1 for human-readable format)
    const year = date.getFullYear(); // Full year (YYYY)

    console.log("This is the clicked handler:");
    console.log(`Deadline: ${deadline}`);
    console.log(`Day: ${day}`);
    console.log(`Month: ${month}`);
    console.log(`Year: ${year}`);
  };

  return (
    <div className="w-full bg-white p-4">
      <div className="flex flex-col gap-3 p-4 rounded-lg max-w-[700px] mx-auto shadow-2xl">
        <FormHeader title={"Launch Your Crowdfunding Campaign!!"} />

        <FormInput
          name="Deadline"
          placeholder="Enter deadline"
          type="date"
          onChange={(e) => setDeadline(e.target.value)}
          value={deadline}
        />

        <SubmitButton onClick={handleClick} />
      </div>
    </div>
  );
}
