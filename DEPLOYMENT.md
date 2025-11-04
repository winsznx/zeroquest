# Zero Quest Deployment Info

## Deployed Contracts (Base Network)

### Token Contracts
- **ZQToken (ZQT)**: `0x1Cc1A2C1c39cf25316ABb3B8E86F4fA718313ea0`
- **WCToken (WCT)**: `0x74fC3E8C57229A1D4364e1Af1A5155f8eA6EB164`
- **DegenToken (DEGEN)**: `0x060adE085F2441dbE6d57948EAd597a24a7A418d`

### Game Contracts
- **ZeroQuestPass (NFT)**: `0x19A6B9654b463c79FAf2c474d539611b474b7e4e`
- **ZQGame (Rewards)**: `0xAAc3cDa25F27D94394C7127347C7486d288aB078`

## Owner Address
`0xA81514fBAE19DDEb16F4881c02c363c8E7c2B0d8`

## Next Steps

### 1. Fund ZQGame Contract

Transfer tokens from your wallet to ZQGame contract (`0xAAc3cDa25F27D94394C7127347C7486d288aB078`):

```
50,000 ZQT  → 0xAAc3cDa25F27D94394C7127347C7486d288aB078
10,000 WCT  → 0xAAc3cDa25F27D94394C7127347C7486d288aB078
50,000 DEGEN → 0xAAc3cDa25F27D94394C7127347C7486d288aB078
```

### 2. Backend Environment Variables

Set these in Cloudflare Pages or your backend:

```env
SIGNER_PRIVATE_KEY=[Your backend signer private key]
WCT_TOKEN_ADDRESS=0x74fC3E8C57229A1D4364e1Af1A5155f8eA6EB164
DEGEN_TOKEN_ADDRESS=0x060adE085F2441dbE6d57948EAd597a24a7A418d
BASE_RPC_URL=https://mainnet.base.org
```

### 3. Verify Contracts (Optional)

```bash
npx hardhat verify --network base 0x1Cc1A2C1c39cf25316ABb3B8E86F4fA718313ea0 "0xA81514fBAE19DDEb16F4881c02c363c8E7c2B0d8"
npx hardhat verify --network base 0x74fC3E8C57229A1D4364e1Af1A5155f8eA6EB164 "0xA81514fBAE19DDEb16F4881c02c363c8E7c2B0d8"
npx hardhat verify --network base 0x060adE085F2441dbE6d57948EAd597a24a7A418d "0xA81514fBAE19DDEb16F4881c02c363c8E7c2B0d8"
npx hardhat verify --network base 0x19A6B9654b463c79FAf2c474d539611b474b7e4e "0xA81514fBAE19DDEb16F4881c02c363c8E7c2B0d8"
```

For ZQGame (multiple constructor params):
```bash
npx hardhat verify --network base 0xAAc3cDa25F27D94394C7127347C7486d288aB078 \
  "0xA81514fBAE19DDEb16F4881c02c363c8E7c2B0d8" \
  "0x1Cc1A2C1c39cf25316ABb3B8E86F4fA718313ea0" \
  "0x74fC3E8C57229A1D4364e1Af1A5155f8eA6EB164" \
  "0x060adE085F2441dbE6d57948EAd597a24a7A418d" \
  "[BACKEND_SIGNER_ADDRESS]"
```

## Contract Links (BaseScan)

- ZQToken: https://basescan.org/address/0x1Cc1A2C1c39cf25316ABb3B8E86F4fA718313ea0
- WCToken: https://basescan.org/address/0x74fC3E8C57229A1D4364e1Af1A5155f8eA6EB164
- DegenToken: https://basescan.org/address/0x060adE085F2441dbE6d57948EAd597a24a7A418d
- ZeroQuestPass: https://basescan.org/address/0x19A6B9654b463c79FAf2c474d539611b474b7e4e
- ZQGame: https://basescan.org/address/0xAAc3cDa25F27D94394C7127347C7486d288aB078
