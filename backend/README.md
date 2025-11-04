# Zero Quest Faucet Backend

Standalone Vercel serverless faucet for distributing testnet tokens.

## Overview

This is an optional standalone backend service that provides a faucet endpoint for distributing native tokens to new users with zero balance.

> **Note**: The main claim functionality is in `/frontend/functions/api/claim.ts` (Cloudflare Pages Functions). This faucet backend is optional and primarily for testnet use.

## Features

- **Serverless**: Runs on Vercel's platform
- **CORS Ready**: Configurable CORS headers
- **Eligibility Check**: Only sends to addresses with 0 balance
- **Address Validation**: Ensures valid Ethereum addresses
- **Rate Limiting**: Smart contract prevents double claims

## Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your values
nano .env

# Run locally
npm run dev

# Deploy to Vercel
npm run deploy
```

## Environment Variables

Create a `.env` file:

```env
# Base Network RPC URL
BASE_RPC_URL=https://mainnet.base.org

# Faucet Smart Contract Address
FAUCET_CONTRACT_ADDRESS=0xYourFaucetContractAddress

# Developer Private Key (pays for gas)
DEV_PRIVATE_KEY=0xYourPrivateKey

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Production (Vercel Dashboard)

Set these as environment variables in your Vercel project:

- `BASE_RPC_URL`
- `FAUCET_CONTRACT_ADDRESS`
- `DEV_PRIVATE_KEY` (mark as Secret)
- `FRONTEND_URL`

## API Endpoint

### POST /api/faucet

Request native tokens from the faucet.

**URL**: `/api/faucet`

**Method**: `POST`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "userAddress": "0xYourAddressHere"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Faucet successfully sent to 0xYourAddressHere",
  "transactionHash": "0x..."
}
```

**Error Responses**:

**400 Bad Request** - Invalid address:
```json
{
  "error": "address not valid."
}
```

**403 Forbidden** - Balance > 0:
```json
{
  "message": "your not eligible (balance > 0)."
}
```

**409 Conflict** - Already claimed:
```json
{
  "error": "address has already been claimed by faucet."
}
```

**405 Method Not Allowed** - Wrong HTTP method:
```json
{
  "error": "Method Not Allowed"
}
```

**500 Internal Server Error** - Server error:
```json
{
  "error": "An internal error occurred on the server."
}
```

## Local Development

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Run locally**:
   ```bash
   vercel dev
   ```

3. **Test the endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/faucet \
     -H "Content-Type: application/json" \
     -d '{"userAddress":"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}'
   ```

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**:
   Go to Vercel dashboard → Your Project → Settings → Environment Variables

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/zero-quest)

## Faucet Smart Contract

The faucet backend expects a smart contract with this function:

```solidity
function requestFaucet(address _recipient) external;
```

The contract should:
- Track which addresses have claimed
- Distribute native tokens (ETH on Base)
- Revert if address already claimed

Example implementation:

```solidity
contract Faucet {
    mapping(address => bool) public hasClaimed;
    uint256 public amountPerClaim = 0.01 ether;

    function requestFaucet(address _recipient) external {
        require(!hasClaimed[_recipient], "Already claimed");
        hasClaimed[_recipient] = true;
        payable(_recipient).transfer(amountPerClaim);
    }

    receive() external payable {}
}
```

## Security

- Private key is stored as environment variable (never committed)
- CORS headers restrict access to specified frontend
- Only sends to addresses with 0 balance
- Smart contract prevents double claims
- Developer wallet pays gas fees

## CORS Configuration

Default CORS settings:

```typescript
Access-Control-Allow-Origin: process.env.FRONTEND_URL || "*"
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

For production, set `FRONTEND_URL` to your specific domain:

```env
FRONTEND_URL=https://zeroquest.xyz
```

## Troubleshooting

### Error: "Missing environment variables"

Make sure all required environment variables are set:
- `BASE_RPC_URL`
- `FAUCET_CONTRACT_ADDRESS`
- `DEV_PRIVATE_KEY`

### Error: "Insufficient funds"

The developer wallet needs native tokens (ETH on Base) to pay for gas fees.

### Error: "Already claimed"

The address has already used the faucet. Check the smart contract's `hasClaimed` mapping.

### CORS errors

Set `FRONTEND_URL` in environment variables to your frontend domain.

## Gas Optimization

- Uses minimal ABI (only `requestFaucet` function)
- Direct contract calls without extra middleware
- Efficient balance checking before transaction

## Alternative: Frontend Functions

If you prefer not to use a separate backend, the faucet is also available as a Cloudflare Pages Function in:

```
/frontend/functions/api/faucet.ts
```

This uses the same logic but runs on Cloudflare's edge network alongside your frontend.

## License

MIT License
