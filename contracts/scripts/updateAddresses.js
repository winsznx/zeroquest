const fs = require('fs');
const path = require('path');

// This script updates all contract addresses in frontend after redeployment
// Usage: node scripts/updateAddresses.js <nftAddress> <gameAddress> <zqtAddress> <wctAddress> <degenAddress>

const args = process.argv.slice(2);

if (args.length !== 5) {
  console.error('Usage: node updateAddresses.js <nftAddress> <gameAddress> <zqtAddress> <wctAddress> <degenAddress>');
  process.exit(1);
}

const [nftAddress, gameAddress, zqtAddress, wctAddress, degenAddress] = args;

const rootDir = path.join(__dirname, '../..');

// Update frontend/src/config/nft.ts
const nftConfigPath = path.join(rootDir, 'frontend/src/config/nft.ts');
let nftConfig = fs.readFileSync(nftConfigPath, 'utf8');
nftConfig = nftConfig.replace(
  /export const nftContractAddress = '0x[a-fA-F0-9]{40}';/,
  `export const nftContractAddress = '${nftAddress}';`
);
fs.writeFileSync(nftConfigPath, nftConfig);
console.log('✅ Updated frontend/src/config/nft.ts');

// Update frontend/src/config/game.ts
const gameConfigPath = path.join(rootDir, 'frontend/src/config/game.ts');
let gameConfig = fs.readFileSync(gameConfigPath, 'utf8');
gameConfig = gameConfig.replace(
  /export const gameContractAddress = '0x[a-fA-F0-9]{40}';/,
  `export const gameContractAddress = '${gameAddress}';`
);
fs.writeFileSync(gameConfigPath, gameConfig);
console.log('✅ Updated frontend/src/config/game.ts');

// Update frontend/functions/api/claim.ts
const claimPath = path.join(rootDir, 'frontend/functions/api/claim.ts');
let claimCode = fs.readFileSync(claimPath, 'utf8');
claimCode = claimCode.replace(
  /const NFT_CONTRACT = "0x[a-fA-F0-9]{40}";/,
  `const NFT_CONTRACT = "${nftAddress}";`
);
fs.writeFileSync(claimPath, claimCode);
console.log('✅ Updated frontend/functions/api/claim.ts');

// Update DEPLOYMENT.md
const deploymentPath = path.join(rootDir, 'DEPLOYMENT.md');
let deployment = fs.readFileSync(deploymentPath, 'utf8');
deployment = deployment.replace(/ZQToken \(ZQT\): `0x[a-fA-F0-9]{40}`/g, `ZQToken (ZQT): \`${zqtAddress}\``);
deployment = deployment.replace(/WCToken \(WCT\): `0x[a-fA-F0-9]{40}`/g, `WCToken (WCT): \`${wctAddress}\``);
deployment = deployment.replace(/DegenToken \(DEGEN\): `0x[a-fA-F0-9]{40}`/g, `DegenToken (DEGEN): \`${degenAddress}\``);
deployment = deployment.replace(/ZeroQuestPass \(NFT\): `0x[a-fA-F0-9]{40}`/g, `ZeroQuestPass (NFT): \`${nftAddress}\``);
deployment = deployment.replace(/ZQGame \(Rewards\): `0x[a-fA-F0-9]{40}`/g, `ZQGame (Rewards): \`${gameAddress}\``);
fs.writeFileSync(deploymentPath, deployment);
console.log('✅ Updated DEPLOYMENT.md');

console.log('\n🎉 All addresses updated!');
console.log('\nNext steps:');
console.log('1. Fund ZQGame contract: pnpm fund');
console.log('2. Verify contracts: pnpm verify');
console.log('3. Update Cloudflare Pages env vars if needed');

