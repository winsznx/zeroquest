# 🧩 Zero Quest

**A Web3 World Puzzle Game - Play to Earn on Base Network**

Zero Quest is a blockchain-based puzzle game where players solve mathematical puzzles to earn cryptocurrency rewards. Built with React, TypeScript, and Solidity smart contracts on the Base network.

## 🎮 Game Overview

- **Objective**: Select tiles that sum to a target number
- **Time Limit**: 60 seconds per game
- **Rewards**: Earn ZQT tokens + bonus rewards based on your score
- **Play Limit**: 4 games every 12 hours
- **Access**: Requires Zero Quest Pass NFT (0.00003 ETH)

## 📁 Project Structure

```
zero-quest/
├── contracts/          # Smart contracts (Solidity)
│   ├── ZeroQuestPass.sol   # ERC1155 NFT for game access
│   └── ZQGame.sol          # Game rewards & claim logic
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── config/         # Contract configs
│   └── functions/api/      # Cloudflare Pages Functions
│       ├── claim.ts        # Reward claiming backend
│       └── faucet.ts       # Token faucet
└── backend/            # Standalone Vercel faucet (optional)
    └── api/faucet.ts
```

## 🚀 Quick Start

### 1. Deploy Smart Contracts

```bash
cd contracts/

# Deploy ZeroQuestPass NFT
# Deploy ZQGame contract
# Update contract addresses in frontend/src/config/
```

### 2. Setup Frontend

```bash
cd frontend/

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update environment variables
# Update contract addresses in src/config/nft.ts and src/config/game.ts

# Run development server
npm run dev
```

### 3. Configure Cloudflare Environment

For Cloudflare Pages deployment, set these environment variables:

```
SIGNER_PRIVATE_KEY=your_backend_signer_private_key
WCT_TOKEN_ADDRESS=bonus_token_1_address
DEGEN_TOKEN_ADDRESS=bonus_token_2_address
BASE_RPC_URL=https://mainnet.base.org
```

### 4. (Optional) Deploy Standalone Faucet Backend

```bash
cd backend/

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Deploy to Vercel
vercel --prod
```

## 🎯 Game Mechanics

### Puzzle System

1. A 4x4 grid with numbers 1-9
2. Target sum is calculated (60% of total grid sum)
3. Players select tiles to reach the target
4. Game ends when target is hit, exceeded, or timer runs out

### Scoring System

- **Accuracy Bonus**: Hit exact target = 100 points
- **Miss Penalty**: Points reduced based on distance from target
- **Time Bonus**: 2 points per second remaining
- **Max Score**: Varies based on performance

### Rewards

- **ZQT Tokens**: 1:1 with your score (max 500 per game)
- **Bonus Rewards**: Random WCT or DEGEN tokens
  - WCT: 0.05 - 0.1 tokens
  - DEGEN: 3 - 5 tokens

## 🔐 Smart Contracts

### ZeroQuestPass (ERC1155)

- **Purpose**: NFT pass required to play
- **Mint Price**: 0.00003 ETH
- **Limit**: One per address
- **Token ID**: 1

### ZQGame

- **Purpose**: Manage game rewards and claims
- **Features**:
  - Signature-based claiming (prevents cheating)
  - Daily play limits (4 per 12 hours)
  - Nonce system (prevents replay attacks)
  - Multi-token rewards (ZQT + bonus)

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS + Framer Motion
- **Web3**: Wagmi + Viem + Ethers.js
- **Blockchain**: Base (Ethereum L2)
- **Backend**: Cloudflare Pages Functions
- **Contracts**: Solidity 0.8.20 + OpenZeppelin

## 📦 Environment Variables

### Frontend (Cloudflare Pages)

```env
SIGNER_PRIVATE_KEY=         # Backend signer private key
WCT_TOKEN_ADDRESS=          # Bonus token 1 address
DEGEN_TOKEN_ADDRESS=        # Bonus token 2 address
BASE_RPC_URL=               # Base network RPC URL
```

### Backend (Vercel - Optional)

```env
BASE_RPC_URL=               # Base network RPC URL
FAUCET_CONTRACT_ADDRESS=    # Faucet contract address
DEV_PRIVATE_KEY=            # Developer wallet private key
FRONTEND_URL=               # Your frontend URL (for CORS)
```

## 🎨 Features

✅ NFT-gated gameplay
✅ Play-to-earn mechanics
✅ Daily play limits
✅ Signature-based rewards
✅ Multi-token economy
✅ Responsive UI
✅ Farcaster MiniApp compatible
✅ Mobile-friendly

## 🔒 Security

- **Signature Verification**: Backend signs claims, contract verifies
- **Nonce System**: Prevents replay attacks
- **NFT Gating**: Only pass holders can play
- **Rate Limiting**: 4 plays per 12-hour period
- **Deadline**: Signatures expire after 60 seconds
- **Max Claim Limits**: Hard caps on token amounts

## 📱 Deployment

### Cloudflare Pages (Frontend + Functions)

```bash
# Build frontend
npm run build

# Deploy to Cloudflare Pages
# Connect your GitHub repo to Cloudflare Pages
# Set environment variables in Cloudflare dashboard
```

### Vercel (Faucet Backend)

```bash
cd backend/
vercel --prod
```

## 🤝 Contributing

Contributions welcome! Feel free to:

- Add new puzzle types
- Improve UI/UX
- Optimize smart contracts
- Add sound effects
- Implement leaderboards

## 📄 License

MIT License - Feel free to use this project for your own Web3 games!

## 🔗 Links

- **Game**: [Your deployed URL]
- **Contracts**: [Basescan links]
- **Docs**: See individual README files in each folder

## 🆘 Support

For issues or questions:

1. Check the documentation in each folder
2. Review the smart contracts for game logic
3. Test on Base testnet before mainnet

---

Built with ❤️ using React, TypeScript, and Solidity

**Ready to play? Connect your wallet and start solving puzzles!** 🧩
