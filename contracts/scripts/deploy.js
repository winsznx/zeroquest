const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("\n🚀 Deploying Zero Quest contracts with account:", deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH\n");

  const ownerAddress = deployer.address;
  const backendSignerAddress = process.env.BACKEND_SIGNER_ADDRESS;

  if (!backendSignerAddress) {
    console.error("❌ ERROR: BACKEND_SIGNER_ADDRESS not set in .env file!");
    console.log("Please create a new wallet for the backend signer and add its address to .env");
    process.exit(1);
  }

  const deployedAddresses = {};

  // 1. Deploy ZQToken
  console.log("📝 Deploying ZQToken...");
  const ZQToken = await hre.ethers.getContractFactory("ZQToken");
  const zqToken = await ZQToken.deploy(ownerAddress);
  await zqToken.waitForDeployment();
  const zqTokenAddress = await zqToken.getAddress();
  deployedAddresses.ZQToken = zqTokenAddress;
  console.log("✅ ZQToken deployed to:", zqTokenAddress);

  // 2. Deploy WCToken
  console.log("\n📝 Deploying WCToken...");
  const WCToken = await hre.ethers.getContractFactory("WCToken");
  const wcToken = await WCToken.deploy(ownerAddress);
  await wcToken.waitForDeployment();
  const wcTokenAddress = await wcToken.getAddress();
  deployedAddresses.WCToken = wcTokenAddress;
  console.log("✅ WCToken deployed to:", wcTokenAddress);

  // 3. Deploy DegenToken
  console.log("\n📝 Deploying DegenToken...");
  const DegenToken = await hre.ethers.getContractFactory("DegenToken");
  const degenToken = await DegenToken.deploy(ownerAddress);
  await degenToken.waitForDeployment();
  const degenTokenAddress = await degenToken.getAddress();
  deployedAddresses.DegenToken = degenTokenAddress;
  console.log("✅ DegenToken deployed to:", degenTokenAddress);

  // 4. Deploy ZeroQuestPass
  console.log("\n📝 Deploying ZeroQuestPass...");
  const ZeroQuestPass = await hre.ethers.getContractFactory("ZeroQuestPass");
  const zeroQuestPass = await ZeroQuestPass.deploy(ownerAddress);
  await zeroQuestPass.waitForDeployment();
  const zeroQuestPassAddress = await zeroQuestPass.getAddress();
  deployedAddresses.ZeroQuestPass = zeroQuestPassAddress;
  console.log("✅ ZeroQuestPass deployed to:", zeroQuestPassAddress);

  // 5. Deploy ZQGame
  console.log("\n📝 Deploying ZQGame...");
  const ZQGame = await hre.ethers.getContractFactory("ZQGame");
  const zqGame = await ZQGame.deploy(
    ownerAddress,
    zqTokenAddress,
    wcTokenAddress,
    degenTokenAddress,
    backendSignerAddress
  );
  await zqGame.waitForDeployment();
  const zqGameAddress = await zqGame.getAddress();
  deployedAddresses.ZQGame = zqGameAddress;
  console.log("✅ ZQGame deployed to:", zqGameAddress);

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📋 CONTRACT ADDRESSES:");
  console.log("───────────────────────────────────────────────────────────");
  console.log("ZQToken:         ", deployedAddresses.ZQToken);
  console.log("WCToken:         ", deployedAddresses.WCToken);
  console.log("DegenToken:      ", deployedAddresses.DegenToken);
  console.log("ZeroQuestPass:   ", deployedAddresses.ZeroQuestPass);
  console.log("ZQGame:          ", deployedAddresses.ZQGame);
  console.log("───────────────────────────────────────────────────────────");

  // Token balances
  console.log("\n💰 YOUR TOKEN BALANCES:");
  console.log("───────────────────────────────────────────────────────────");
  const zqBalance = await zqToken.balanceOf(ownerAddress);
  const wcBalance = await wcToken.balanceOf(ownerAddress);
  const degenBalance = await degenToken.balanceOf(ownerAddress);
  console.log("ZQT:   ", hre.ethers.formatEther(zqBalance), "ZQT");
  console.log("WCT:   ", hre.ethers.formatEther(wcBalance), "WCT");
  console.log("DEGEN: ", hre.ethers.formatEther(degenBalance), "DEGEN");
  console.log("───────────────────────────────────────────────────────────");

  // Next steps
  console.log("\n📌 NEXT STEPS:");
  console.log("───────────────────────────────────────────────────────────");
  console.log("1. Transfer tokens to ZQGame contract:");
  console.log(`   - 50,000 ZQT to ${zqGameAddress}`);
  console.log(`   - 10,000 WCT to ${zqGameAddress}`);
  console.log(`   - 50,000 DEGEN to ${zqGameAddress}`);
  console.log("\n2. Update frontend config files:");
  console.log("   - frontend/src/config/nft.ts");
  console.log("   - frontend/src/config/game.ts");
  console.log("   - frontend/functions/api/claim.ts");
  console.log("\n3. Set environment variables for backend:");
  console.log(`   SIGNER_PRIVATE_KEY=[backend signer private key]`);
  console.log(`   WCT_TOKEN_ADDRESS=${wcTokenAddress}`);
  console.log(`   DEGEN_TOKEN_ADDRESS=${degenTokenAddress}`);
  console.log("───────────────────────────────────────────────────────────\n");

  // Save to file
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: deployedAddresses
  };

  fs.writeFileSync(
    'deployment-addresses.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("💾 Deployment addresses saved to: deployment-addresses.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
