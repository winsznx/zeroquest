import { ethers } from "ethers";

interface RequestBody {
  userAddress: string;
  score: number;
}

interface Env {
  SIGNER_PRIVATE_KEY: string;
  WCT_TOKEN_ADDRESS: string;
  DEGEN_TOKEN_ADDRESS: string;
  BASE_RPC_URL: string;
}

const NFT_CONTRACT = "0x656bc95b9E2f713184129629C1c3dFbeB67aCc59";

const ERC1155_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)"
];

export const onRequestPost: PagesFunction<Env> = async (context) => {
  // Add CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS request
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    let body: RequestBody;
    try {
      body = await context.request.json();
    } catch (parseError) {
      return Response.json(
        { error: 'Invalid JSON in request body' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { userAddress, score } = body;

    if (!userAddress || typeof score !== "number") {
      return Response.json(
        { error: "Missing or invalid userAddress or score" },
        { status: 400, headers: corsHeaders }
      );
    }

    const {
      SIGNER_PRIVATE_KEY,
      WCT_TOKEN_ADDRESS,
      DEGEN_TOKEN_ADDRESS,
      BASE_RPC_URL,
    } = context.env;

    if (!SIGNER_PRIVATE_KEY || !WCT_TOKEN_ADDRESS || !DEGEN_TOKEN_ADDRESS || !BASE_RPC_URL) {
      console.error("Missing env vars:", {
        hasSigner: !!SIGNER_PRIVATE_KEY,
        hasWCT: !!WCT_TOKEN_ADDRESS,
        hasDEGEN: !!DEGEN_TOKEN_ADDRESS,
        hasRPC: !!BASE_RPC_URL,
      });
      return Response.json(
        { error: "Backend environment not configured correctly. Check Cloudflare Pages environment variables." },
        { status: 500, headers: corsHeaders }
      );
    }

    if (score <= 0) {
      return Response.json(
        { error: "Score must be greater than 0 to claim" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Verify user owns Zero Quest Pass NFT
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    const nft = new ethers.Contract(NFT_CONTRACT, ERC1155_ABI, provider);
    const balance = await nft.balanceOf(userAddress, 1);

    if (balance <= 0n) {
      return Response.json(
        { error: "You need to mint Zero Quest Pass to play & claim" },
        { status: 403, headers: corsHeaders }
      );
    }

    // Create signature
    const signer = new ethers.Wallet(SIGNER_PRIVATE_KEY);

    // Random bonus token (50/50 WCT or DEGEN)
    const isWCT = Math.random() < 0.5;
    const rewardTokenAddress = isWCT ? WCT_TOKEN_ADDRESS : DEGEN_TOKEN_ADDRESS;
    const rewardTokenSymbol = isWCT ? "WCT" : "DEGEN";
    let randomAmount;

    if (isWCT) {
      randomAmount = 0.05 + Math.random() * (0.1 - 0.05); // 0.05-0.1 WCT
    } else {
      randomAmount = 3 + Math.random() * 2; // 3-5 DEGEN
    }

    const rewardTokenAmount = ethers.parseEther(randomAmount.toFixed(18));
    const deadline = Math.floor(Date.now() / 1000) + 60; // 60 seconds validity
    const nonce = Date.now();
    const amountZQT = score; // 1:1 score to ZQT
    const recipient = userAddress;

    // Encode claim data
    const abiCoder = new ethers.AbiCoder();
    const databytes = abiCoder.encode(
      ["address", "uint256", "address", "uint256", "uint256", "uint256"],
      [recipient, amountZQT, rewardTokenAddress, rewardTokenAmount, deadline, nonce]
    );

    // Sign the message
    const messageHash = ethers.keccak256(databytes);
    const signature = signer.signingKey.sign(messageHash);

    const responsePayload = {
      databytes,
      v: signature.v,
      r: signature.r,
      s: signature.s,
      rewardTokenSymbol,
      rewardTokenAmount: randomAmount.toFixed(4),
      amountZQT,
      rewardTokenAddress,
    };

    return Response.json(responsePayload, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Claim Error:", error);
    const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
    return Response.json(
      { error: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
};
