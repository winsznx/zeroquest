const hre = require("hardhat");

async function main() {
  const ZQGameAddress = "0x1d882c29032Be317b49dF00eDbed3a6C4ae25B43";
  
  const ZQGameABI = [
    "function Signer() view returns (address)"
  ];
  
  const contract = await hre.ethers.getContractAt(ZQGameABI, ZQGameAddress);
  const signerAddress = await contract.Signer();
  
  console.log("\n📋 ZQGame Contract Info:");
  console.log("Contract Address:", ZQGameAddress);
  console.log("Backend Signer Address:", signerAddress);
  console.log("\n💡 This is the address that should match your SIGNER_PRIVATE_KEY");
  console.log("   (When you derive the address from that private key)\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

