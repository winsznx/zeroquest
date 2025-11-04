// api/faucet.ts - Standalone Vercel Serverless Faucet Backend

import { ethers } from "ethers";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const FAUCET_ABI = ["function requestFaucet(address _recipient) external"];

const setCorsHeaders = (res: VercelResponse) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL || "*"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );
};

const checkEnvVars = () => {
  const requiredVars = [
    "BASE_RPC_URL",
    "FAUCET_CONTRACT_ADDRESS",
    "DEV_PRIVATE_KEY",
  ];
  const missingVars = requiredVars.filter((v) => !process.env[v]);

  if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(", ")}`);
    throw new Error("Server configuration error.");
  }

  return {
    rpcUrl: process.env.BASE_RPC_URL!,
    contractAddress: process.env.FAUCET_CONTRACT_ADDRESS!,
    privateKey: process.env.DEV_PRIVATE_KEY!,
  };
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST", "OPTIONS"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { rpcUrl, contractAddress, privateKey } = checkEnvVars();
    const { userAddress } = req.body;

    if (!userAddress || !ethers.isAddress(userAddress)) {
      return res.status(400).json({ error: "address not valid." });
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const devWallet = new ethers.Wallet(privateKey, provider);
    const balance = await provider.getBalance(userAddress);

    if (balance > 0) {
      return res
        .status(403)
        .json({ message: "your not eligible (balance > 0)." });
    }

    const faucetContract = new ethers.Contract(
      contractAddress,
      FAUCET_ABI,
      devWallet
    );

    console.log(`Processing faucet request for: ${userAddress}`);
    const tx = await faucetContract.requestFaucet(userAddress);
    console.log(`Faucet sent successfully! Tx hash: ${tx.hash}`);

    return res.status(200).json({
      success: true,
      message: `Faucet successfully sent to ${userAddress}`,
      transactionHash: tx.hash,
    });
  } catch (error: any) {
    console.error("Faucet Error:", error);

    if (error.message?.includes("Server configuration error")) {
      return res
        .status(500)
        .json({ error: "Server configuration error." });
    }

    if (error.message?.includes("Address has already claimed faucet")) {
      return res
        .status(409)
        .json({ error: "address has already been claimed by faucet." });
    }

    return res
      .status(500)
      .json({ error: "An internal error occurred on the server." });
  }
}
