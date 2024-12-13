"use client";
import { useState } from "react";
import {
  SignupFormInput,
  RegisterButton,
} from "@/app/component/SignupFormInput";
import RocketMan from "@/app/assets/RocketMan";
import axios from "axios";
import { useRouter } from "next/navigation";

function SignupForm() {
//   const navigate = useNavigate();
const router=useRouter();

  async function handleClickInvestor() {
    try {
      const body = {
        data: {
          email: email,
          password: password,
          walletAddress: walletAddress,
        },
      };
      const response = await axios.post(
        "http://localhost:3000/apis/SignUpInvestor",
        body
      );
      if (response.status === 200) {
        console.log("Login successful:", response.data);
        alert("Registration Successfully");
      } else {
        console.error("Unexpected response:", response);
        alert("Registration Failed")
    }
} catch (error) {
    if (axios.isAxiosError(error)) {
        // Axios-specific error
        console.error("Axios error response:", error.response?.data);
        alert("Registration Failed")
    } else {
        // Generic error handling
        console.error("Unexpected error:", error);
        alert("Registration Failed")
      }
    }
  }

  async function handleClickCompany() {
    try {
      const body = {
        data: {
          registrationNumber: rNo,
          password: password,
          walletAddress: walletAddress,
        },
      };
      console.log("body" + body);

      const response = await axios.post(
        "http://localhost:3000/apis/SignUpCompany",
        body
      );
      if (response.status === 200) {
        console.log("Login successful:", response.data);
        alert("You have been registered");
        router.push("/SignIn");
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios-specific error
        console.error("Axios error response:", error.response?.data);
      } else {
        // Generic error handling
        console.error("Unexpected error:", error);
      }
    }
  }

  const [isInvestor, setIsInvestor] = useState<boolean>(false);

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [walletAddress, setWalletAddress] = useState<string>();
  const [rNo, setRNo] = useState<string>();

  return (
    <div className="w-full px-6">
      <div className="flex mx-auto max-w-7xl bg-transparent relative w-full">
        <div className="absolute inset-0 flex justify-center items-center">
          <RocketMan />
        </div>
        <div className="flex-1 hidden md:block gap-2 align-between h-full">
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-6xl font-extrabold text-red-600 max-w-lg tracking-wider">
                Welcome to our community
              </h1>
              <div className="text-sm mt-2 p-1 max-w-xs font-semibold">
                Invest in tomorrow’s game-changers today. Join us and fuel the
                next wave of innovation.
              </div>
            </div>
            <button
              className="bg-red-600 w-fit text-black font-bold text-2xl px-6 py-2 rounded-lg transition duration-300 ease-in-out transform hover:bg-red-700 hover:scale-105 hover:shadow-lg"
              onClick={() => router.push("/pages/AllCampaigns")}
            >
              Enter
            </button>
          </div>
        </div>

        <div className="w-[40%] z-10">
          <div className="px-3 mx-auto">
            <div
              className={`flex flex-col gap-8 transition-all duration-300 border-2 px-5 pb-6 border-none py-3 my-5`}
            >
              <div className="flex justify-between gap-2">
                <div
                  className={`text-sm w-full rounded py-3 grid place-content-center text-black font-bold cursor-pointer transition-all duration-300 ${
                    !isInvestor ? "bg-red-500" : "bg-red-100"
                  }`}
                  onClick={() => {
                    setIsInvestor(false);
                    setEmail("");
                    setWalletAddress("");
                  }}
                >
                  Company
                </div>
                <div
                  className={`text-sm w-full rounded py-2 grid place-content-center text-black font-bold cursor-pointer transition-all duration-300 ${
                    isInvestor ? "bg-red-500" : "bg-red-100"
                  }`}
                  onClick={() => {
                    setIsInvestor(true);
                    setEmail("");
                    setWalletAddress("");
                  }}
                >
                  Investor
                </div>
              </div>
              {isInvestor ? (
                <>
                  <SignupFormInput
                    placeholder="Enter your email address"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <SignupFormInput
                    placeholder="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <SignupFormInput
                    placeholder="Enter your wallet address"
                    type="text"
                    onChange={(e) => setWalletAddress(e.target.value)}
                  />
                  <RegisterButton
                    buttonText="Register"
                    onClick={handleClickInvestor}
                  />
                  <div className="text-sm mt-2 p-1 max-w-xs font-semibold">
                    Already have an Account ?{" "}
                    <a href="/pages/SignIn" className="underline">
                      Signin
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <SignupFormInput
                    placeholder="Enter your registration number"
                    type="email"
                    onChange={(e) => setRNo(e.target.value)}
                  />
                  <SignupFormInput
                    placeholder="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <SignupFormInput
                    placeholder="Enter your wallet address"
                    type="text"
                    onChange={(e) => setWalletAddress(e.target.value)}
                  />
                  <RegisterButton
                    buttonText="Register"
                    onClick={handleClickCompany}
                  />
                  <div className="text-sm mt-2 p-1 max-w-xs font-semibold">
                    Already have an Account ?{" "}
                    <a href="/pages/SignIn" className="underline">
                      Signin
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
