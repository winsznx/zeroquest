const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Funding ZQGame contract with:", deployer.address);

  // Contract addresses (from deployment-addresses.json)
  const ZQGameAddress = "0x1d882c29032Be317b49dF00eDbed3a6C4ae25B43";
  const ZQTokenAddress = "0xAD45C8bd122757B36c24ee273837d97c04E2A96C";
  const WCTokenAddress = "0xb149C3f586098aa78d892FBEeF5361c8296B5697";
  const DegenTokenAddress = "0x22E7AA46aDDF743c99322212852dB2FA17b404b2";

  // Amounts to send (in tokens, will be converted to wei)
  const amounts = {
    ZQT: 50_000,
    WCT: 10_000,
    DEGEN: 50_000
  };

  // ERC20 ABI (just the transfer function)
  const erc20Abi = [
    "function transfer(address to, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ];

  // Get token contracts
  const zqToken = await hre.ethers.getContractAt(erc20Abi, ZQTokenAddress, deployer);
  const wcToken = await hre.ethers.getContractAt(erc20Abi, WCTokenAddress, deployer);
  const degenToken = await hre.ethers.getContractAt(erc20Abi, DegenTokenAddress, deployer);

  // Check balances
  console.log("\n📊 Current balances:");
  const zqBalance = await zqToken.balanceOf(deployer.address);
  const wcBalance = await wcToken.balanceOf(deployer.address);
  const degenBalance = await degenToken.balanceOf(deployer.address);
  console.log(`ZQT:   ${hre.ethers.formatEther(zqBalance)} ZQT`);
  console.log(`WCT:   ${hre.ethers.formatEther(wcBalance)} WCT`);
  console.log(`DEGEN: ${hre.ethers.formatEther(degenBalance)} DEGEN`);

  // Get decimals (assume 18 for all, but check)
  const zqDecimals = await zqToken.decimals();
  const wcDecimals = await wcToken.decimals();
  const degenDecimals = await degenToken.decimals();

  // Convert amounts to wei
  const zqAmount = hre.ethers.parseUnits(amounts.ZQT.toString(), zqDecimals);
  const wcAmount = hre.ethers.parseUnits(amounts.WCT.toString(), wcDecimals);
  const degenAmount = hre.ethers.parseUnits(amounts.DEGEN.toString(), degenDecimals);

  console.log("\n💰 Transferring tokens to ZQGame contract...");
  console.log(`ZQGame Address: ${ZQGameAddress}\n`);

  // Transfer ZQT
  console.log(`Transferring ${amounts.ZQT} ZQT...`);
  const tx1 = await zqToken.transfer(ZQGameAddress, zqAmount);
  await tx1.wait();
  console.log(`✅ ZQT transferred! Tx: ${tx1.hash}`);

  // Transfer WCT
  console.log(`Transferring ${amounts.WCT} WCT...`);
  const tx2 = await wcToken.transfer(ZQGameAddress, wcAmount);
  await tx2.wait();
  console.log(`✅ WCT transferred! Tx: ${tx2.hash}`);

  // Transfer DEGEN
  console.log(`Transferring ${amounts.DEGEN} DEGEN...`);
  const tx3 = await degenToken.transfer(ZQGameAddress, degenAmount);
  await tx3.wait();
  console.log(`✅ DEGEN transferred! Tx: ${tx3.hash}`);

  // Verify final balances
  console.log("\n📊 Final balances in ZQGame contract:");
  const zqGameZQBalance = await zqToken.balanceOf(ZQGameAddress);
  const zqGameWCBalance = await wcToken.balanceOf(ZQGameAddress);
  const zqGameDegenBalance = await degenToken.balanceOf(ZQGameAddress);
  console.log(`ZQT:   ${hre.ethers.formatEther(zqGameZQBalance)} ZQT`);
  console.log(`WCT:   ${hre.ethers.formatEther(zqGameWCBalance)} WCT`);
  console.log(`DEGEN: ${hre.ethers.formatEther(zqGameDegenBalance)} DEGEN`);
  console.log("\n✅ All tokens transferred successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

