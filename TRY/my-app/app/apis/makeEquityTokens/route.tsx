import { NextResponse, NextRequest } from "next/server";
import Web3 from "web3";
import { EquityABI } from "@/Components/EquityABI";
import { ByteCode } from "@/Components/EquityByteCode";

const bytecode = ByteCode;
const infuraUrl = "http://127.0.0.1:8545/";

const convertBigIntToString = (data: any): any => {
  if (typeof data === "bigint") {
    return data.toString();
  } else if (Array.isArray(data)) {
    return data.map(convertBigIntToString);
  } else if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        convertBigIntToString(value),
      ])
    );
  }
  return data;
};

export async function POST(req: NextRequest) {
  try {
    const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));
    const body = await req.json();

    const deployerAddress = body.data.deployerAddress;
    const constructorArgs = body.data.constructorArgs;

    console.log("Constructor Args Received:", constructorArgs);

    if (!deployerAddress) {
      return NextResponse.json(
        { error: "Deployer address is required" },
        { status: 400 }
      );
    }

    // Format constructor arguments - using the numbers directly without Wei conversion
    const formattedArgs = [
      constructorArgs[0], // initialSupply (uint256)
      constructorArgs[1], // name (string)
      constructorArgs[2], // symbol (string)
      constructorArgs[3], // decimals (uint8)
      constructorArgs[4], // equityAmount (uint256)
    ];

    console.log("Formatted Constructor Args:", formattedArgs);

    // Create contract instance
    const contract = new web3.eth.Contract(EquityABI);

    // Deploy the contract
    console.log("Preparing deployment...");
    const deploy = contract.deploy({
      data: bytecode,
      arguments: formattedArgs,
    });

    // Estimate gas with a try-catch block
    let gasLimit;
    try {
      const gasEstimate = await deploy.estimateGas({
        from: deployerAddress,
      });
      gasLimit = Math.ceil(Number(gasEstimate) * 1.2); // 20% buffer
      console.log("Estimated gas:", gasEstimate);
      console.log("Gas limit with buffer:", gasLimit);
    } catch (error) {
      console.error("Gas estimation failed:", error);
      // Fallback gas limit if estimation fails
      gasLimit = 3000000;
      console.log("Using fallback gas limit:", gasLimit);
    }

    console.log("Deploying contract...");
    const deployedContract = await deploy.send({
      from: deployerAddress,
      gas: gasLimit,
    });

    console.log("BEFORE RECEIPT");
    // const receipt = await web3.eth.getTransactionReceipt(
    //   deployedContract.transactionHash
    // );
let receipt;
    deploy
      .send({ from: deployerAddress, gas: gasLimit })
      .on("transactionHash", (hash) => {
        console.log("Transaction hash:", hash);
      })
      .on("receipt", (receipt) => {
        console.log("Transaction mined:", receipt);
      })
      .on("error", (error) => {
        console.error("Deployment failed:", error);
      });

    
    console.log("after RECEIPT");


    const deploymentResult = {
      contractAddress: deployedContract.options.address,
      transactionHash: deployedContract.transactionHash,
      gasUsed: receipt ? receipt.gasUsed : null,
      blockNumber: receipt ? receipt.blockNumber : null,
    };

    console.log("Contract deployed successfully:", deploymentResult);

    return NextResponse.json({
      message: "Contract deployed successfully",
      data: convertBigIntToString(deploymentResult),
    });
  } catch (error) {
    console.error("Contract deployment failed:",error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    // Log the full error for debugging
    console.log("Full error object:", error);

    return NextResponse.json(
      {
        error: errorMessage,
        details: error,
      },
      { status: 500 }
    );
  }
}
