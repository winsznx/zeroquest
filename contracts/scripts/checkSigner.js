const hre = require("hardhat");

async function main() {
  const ZQGameAddress = "0xAAc3cDa25F27D94394C7127347C7486d288aB078";
  
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

