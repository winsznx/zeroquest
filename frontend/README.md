# Zero Quest Frontend

React + TypeScript + Vite frontend for Zero Quest puzzle game.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable React components
│   │   ├── Layout.tsx
│   │   ├── BottomNav.tsx
│   │   ├── PuzzleTile.tsx
│   │   └── GameOverModal.tsx
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx
│   │   ├── PuzzleGame.tsx
│   │   ├── InfoPage.tsx
│   │   ├── UserPage.tsx
│   │   ├── MintPage.tsx
│   │   ├── MintPromptPage.tsx
│   │   ├── ConnectWalletPage.tsx
│   │   └── WrongNetworkPage.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useHasPass.ts
│   ├── config/             # Contract configurations
│   │   ├── nft.ts          # ZeroQuestPass config
│   │   └── game.ts         # ZQGame config
│   ├── assets/             # Images, sounds, etc.
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── wagmi.ts            # Wagmi configuration
├── functions/
│   └── api/                # Cloudflare Pages Functions
│       ├── claim.ts        # Reward claim API
│       └── faucet.ts       # Token faucet API
├── public/                 # Static assets
└── index.html              # HTML template
```

## ⚙️ Configuration

### 1. Update Contract Addresses

After deploying contracts, update these files:

**`src/config/nft.ts`**:
```typescript
export const nftContractAddress = '0xYourZeroQuestPassAddress';
```

**`src/config/game.ts`**:
```typescript
export const gameContractAddress = '0xYourZQGameAddress';
```

**`functions/api/claim.ts`**:
```typescript
const NFT_CONTRACT = "0xYourZeroQuestPassAddress";
```

### 2. Environment Variables (Cloudflare Pages)

Set these in your Cloudflare Pages dashboard:

```env
SIGNER_PRIVATE_KEY=your_backend_signer_private_key
WCT_TOKEN_ADDRESS=0xWCTTokenAddress
DEGEN_TOKEN_ADDRESS=0xDegenTokenAddress
BASE_RPC_URL=https://mainnet.base.org
```

## 🎮 Game Flow

1. **Connect Wallet** → User connects MetaMask or Farcaster wallet
2. **Check Network** → Must be on Base network
3. **Check Pass** → Must own Zero Quest Pass NFT
4. **Mint Pass** (if needed) → Pay 0.00003 ETH to mint
5. **Play Game** → Solve puzzles within 60 seconds
6. **Claim Rewards** → Submit score and receive tokens

## 🧩 Game Components

### PuzzleTile Component

Individual puzzle tile with click interaction:
- Shows "?" when unrevealed
- Shows number when revealed
- Green when correct
- Red when incorrect
- Animated with Framer Motion

### GameOverModal Component

Modal shown after game ends:
- Displays final score
- Claim button for rewards
- Loading states during transaction
- Success/error feedback
- Reward details display

### Layout & BottomNav

App layout with persistent bottom navigation:
- Home
- Play
- Info
- Profile

## 🔌 API Endpoints

### POST /api/claim

Claim rewards after completing a puzzle.

**Request**:
```json
{
  "userAddress": "0x...",
  "score": 150
}
```

**Response**:
```json
{
  "databytes": "0x...",
  "v": 28,
  "r": "0x...",
  "s": "0x...",
  "rewardTokenSymbol": "WCT",
  "rewardTokenAmount": "0.0750",
  "amountZQT": 150
}
```

### POST /api/faucet

Request testnet tokens (if faucet is enabled).

**Request**:
```json
{
  "userAddress": "0x..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Faucet successfully sent to 0x...",
  "transactionHash": "0x..."
}
```

## 🎨 Styling

- **TailwindCSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Icons**: Icon library
- **Custom CSS**: Additional animations in App.css

## 🔗 Web3 Integration

### Wagmi Hooks Used

- `useAccount()` - Get connected wallet info
- `useConnect()` - Connect wallet
- `useDisconnect()` - Disconnect wallet
- `useSwitchChain()` - Switch to Base network
- `useReadContract()` - Read contract data
- `useWriteContract()` - Write to contracts
- `useWaitForTransactionReceipt()` - Wait for tx confirmation

### Custom Hooks

**`useHasPass()`**:
Checks if connected wallet owns Zero Quest Pass NFT.

```typescript
const { hasPass, isLoading } = useHasPass();
```

## 📦 Dependencies

### Main Dependencies
- `react` & `react-dom` - UI framework
- `wagmi` - Web3 React hooks
- `viem` - Low-level Ethereum library
- `ethers` - Ethereum library (for backend)
- `framer-motion` - Animations
- `react-router-dom` - Routing
- `@farcaster/miniapp-sdk` - Farcaster integration
- `@reown/appkit` - Wallet connection UI

### Dev Dependencies
- `vite` - Build tool
- `typescript` - Type safety
- `tailwindcss` - CSS framework
- `eslint` - Linting

## 🚀 Deployment

### Cloudflare Pages

1. **Connect Repository**:
   - Go to Cloudflare Pages dashboard
   - Connect your GitHub repo

2. **Build Settings**:
   ```
   Build command: npm run build
   Build output: dist
   Root directory: frontend
   ```

3. **Environment Variables**:
   Add all required env vars in Cloudflare dashboard

4. **Functions**:
   Cloudflare automatically deploys functions from `/functions/api/`

### Vercel (Alternative)

```bash
npm run build
vercel --prod
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
tsc --noEmit

# Test build
npm run build
```

## 🐛 Troubleshooting

### Contract Address Not Set
Update addresses in `src/config/nft.ts` and `src/config/game.ts`

### Signature Verification Fails
Check that `SIGNER_PRIVATE_KEY` matches the signer address in ZQGame contract

### Network Errors
Verify `BASE_RPC_URL` is correct and responsive

### CORS Errors
Ensure Cloudflare Pages Functions are deployed correctly

## 📱 Farcaster MiniApp

The app is compatible with Farcaster Frames:

```typescript
// Initialized in App.tsx
sdk.actions.ready()
  .then(() => sdk.actions.addMiniApp())
```

## 🔒 Security Considerations

- Never commit private keys or secrets
- Use environment variables for sensitive data
- Validate all user inputs
- Implement rate limiting on backend
- Use secure RPC endpoints
- Keep dependencies updated

## 📄 License

MIT License
