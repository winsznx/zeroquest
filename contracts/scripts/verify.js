const hre = require("hardhat");
require("dotenv").config();

// Retry function for network errors
async function verifyWithRetry(contractName, verifyConfig, maxRetries = 3, delay = 5000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await hre.run("verify:verify", verifyConfig);
      console.log(`✅ ${contractName} verified!\n`);
      return true;
    } catch (error) {
      const isNetworkError = 
        error.message.includes("network request failed") ||
        error.message.includes("SSL") ||
        error.message.includes("other side closed") ||
        error.message.includes("ECONNRESET") ||
        error.message.includes("ETIMEDOUT");
      
      if (isNetworkError && attempt < maxRetries) {
        console.log(`⚠️ ${contractName}: Network error (attempt ${attempt}/${maxRetries}). Retrying in ${delay/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If it's not a network error, or we've exhausted retries, throw/return error
      console.log(`⚠️ ${contractName}:`, error.message, "\n");
      return false;
    }
  }
  return false;
}

async function main() {
  const ownerAddress = "0xA81514fBAE19DDEb16F4881c02c363c8E7c2B0d8";
  const backendSignerAddress = process.env.BACKEND_SIGNER_ADDRESS;

  const contracts = {
    ZQToken: "0x1Cc1A2C1c39cf25316ABb3B8E86F4fA718313ea0",
    WCToken: "0x74fC3E8C57229A1D4364e1Af1A5155f8eA6EB164",
    DegenToken: "0x060adE085F2441dbE6d57948EAd597a24a7A418d",
    ZeroQuestPass: "0x19A6B9654b463c79FAf2c474d539611b474b7e4e",
    ZQGame: "0xAAc3cDa25F27D94394C7127347C7486d288aB078"
  };

  console.log("\n🔍 Starting contract verification on BaseScan...\n");

  // Verify ZQToken
  console.log("Verifying ZQToken...");
  await verifyWithRetry("ZQToken", {
    address: contracts.ZQToken,
    constructorArguments: [ownerAddress],
    contract: "contracts/ZQToken.sol:ZQToken"
  });

  // Verify WCToken
  console.log("Verifying WCToken...");
  await verifyWithRetry("WCToken", {
    address: contracts.WCToken,
    constructorArguments: [ownerAddress],
    contract: "contracts/WCToken.sol:WCToken"
  });

  // Verify DegenToken
  console.log("Verifying DegenToken...");
  await verifyWithRetry("DegenToken", {
    address: contracts.DegenToken,
    constructorArguments: [ownerAddress],
    contract: "contracts/DegenToken.sol:DegenToken"
  });

  // Verify ZeroQuestPass
  console.log("Verifying ZeroQuestPass...");
  await verifyWithRetry("ZeroQuestPass", {
    address: contracts.ZeroQuestPass,
    constructorArguments: [ownerAddress],
    contract: "contracts/ZeroQuestPass.sol:ZeroQuestPass"
  }, 5, 8000); // More retries and longer delay for this one

  // Verify ZQGame
  if (!backendSignerAddress) {
    console.log("❌ Cannot verify ZQGame: BACKEND_SIGNER_ADDRESS not set in .env");
  } else {
    console.log("Verifying ZQGame...");
    await verifyWithRetry("ZQGame", {
      address: contracts.ZQGame,
      constructorArguments: [
        ownerAddress,
        contracts.ZQToken,
        contracts.WCToken,
        contracts.DegenToken,
        backendSignerAddress
      ],
      contract: "contracts/ZQGame.sol:ZQGame"
    }, 5, 8000); // More retries and longer delay for this one
  }

  console.log("=".repeat(60));
  console.log("🎉 Verification process complete!");
  console.log("=".repeat(60));
  console.log("\n📋 View verified contracts on BaseScan:");
  console.log("ZQToken:       https://basescan.org/address/" + contracts.ZQToken);
  console.log("WCToken:       https://basescan.org/address/" + contracts.WCToken);
  console.log("DegenToken:    https://basescan.org/address/" + contracts.DegenToken);
  console.log("ZeroQuestPass: https://basescan.org/address/" + contracts.ZeroQuestPass);
  console.log("ZQGame:        https://basescan.org/address/" + contracts.ZQGame);
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
