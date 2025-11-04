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
  const ownerAddress = "0x0BE0F2EEbE0be3766DEf4780689CAE97c9c158d7";
  const backendSignerAddress = process.env.BACKEND_SIGNER_ADDRESS;

  const contracts = {
    ZQToken: "0xAD45C8bd122757B36c24ee273837d97c04E2A96C",
    WCToken: "0xb149C3f586098aa78d892FBEeF5361c8296B5697",
    DegenToken: "0x22E7AA46aDDF743c99322212852dB2FA17b404b2",
    ZeroQuestPass: "0x656bc95b9E2f713184129629C1c3dFbeB67aCc59",
    ZQGame: "0x1d882c29032Be317b49dF00eDbed3a6C4ae25B43"
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
