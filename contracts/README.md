# Zero Quest Smart Contracts

Solidity smart contracts for the Zero Quest puzzle game.

## Contracts

### 1. ZeroQuestPass.sol (ERC1155 NFT)

**Purpose**: Access pass required to play Zero Quest

**Key Features**:
- ERC1155 token (Token ID: 1)
- Mint price: 0.00003 ETH
- One mint per address
- Owner can update price and withdraw funds

**Functions**:
- `mint()` - Mint your Zero Quest Pass
- `hasMinted(address)` - Check if address has minted
- `updatePrice(uint256)` - Owner: Update mint price
- `withdraw()` - Owner: Withdraw ETH balance

### 2. ZQGame.sol (Game Rewards Contract)

**Purpose**: Manages gameplay rewards and claim verification

**Key Features**:
- Signature-based claiming (prevents cheating)
- Daily play limits (4 per 12 hours)
- Multiple reward tokens (ZQT + 2 bonus tokens)
- Nonce system prevents replay attacks
- Cooldown period between claim cycles

**Functions**:
- `claim(bytes, v, r, s)` - Claim rewards with signature
- `getPlayerInfo(address)` - Get player stats
- `updateDailyLimit(uint256)` - Owner: Update play limit
- `updateMaxClaimZQT(uint256)` - Owner: Update max ZQT claim
- `updateRewardToken(slot, address, amount)` - Owner: Update bonus tokens

## Deployment Steps

### 1. Deploy Token Contracts First

You'll need 3 ERC20 tokens deployed:
- ZQT (Zero Quest Token) - main reward
- Token2 (e.g., WCT) - bonus reward 1
- Token3 (e.g., DEGEN) - bonus reward 2

### 2. Deploy ZeroQuestPass

```solidity
constructor(address _initialOwner)
```

Parameters:
- `_initialOwner`: Your owner address

### 3. Deploy ZQGame

```solidity
constructor(
    address initialOwner,
    address _ZQT,
    address _token2,
    address _token3,
    address _Signer
)
```

Parameters:
- `initialOwner`: Contract owner address
- `_ZQT`: ZQT token contract address
- `_token2`: Bonus token 1 address (WCT)
- `_token3`: Bonus token 2 address (DEGEN)
- `_Signer`: Backend signer address (for signature verification)

### 4. Fund the ZQGame Contract

Transfer tokens to the ZQGame contract:
- ZQT tokens for player rewards
- Bonus tokens for additional rewards

## Configuration

### Default Settings

```solidity
dailyClaimLimit = 4;           // 4 plays per period
maxClaimZQT = 500;             // Max 500 ZQT per claim
COOLDOWN_PERIOD = 12 hours;    // 12 hour reset period

rewardToken2.maxClaim = 25 * 1e16;  // 0.25 tokens
rewardToken3.maxClaim = 5 * 1e18;   // 5 tokens
```

### Update Configuration

Owner can update these values:

```solidity
// Update daily play limit
updateDailyLimit(5);  // 5 plays per period

// Update max ZQT per claim
updateMaxClaimZQT(1000);  // Max 1000 ZQT

// Update bonus token
updateRewardToken(2, newTokenAddress, newMaxClaim);
```

## Signature Generation (Backend)

The backend must sign claims with this format:

```javascript
const databytes = ethers.AbiCoder.encode(
  ["address", "uint256", "address", "uint256", "uint256", "uint256"],
  [recipient, amountZQT, rewardTokenAddress, rewardTokenAmount, deadline, nonce]
);

const messageHash = ethers.keccak256(databytes);
const signature = signer.signingKey.sign(messageHash);

// Return: databytes, v, r, s
```

## Security Features

1. **Signature Verification**: Backend signs, contract verifies
2. **Nonce System**: Each nonce can only be used once
3. **Deadline**: Signatures expire after set time
4. **NFT Gating**: Must own Zero Quest Pass
5. **Rate Limiting**: Daily play limits enforced
6. **Max Claim Limits**: Hard caps on token amounts
7. **ReentrancyGuard**: Prevents reentrancy attacks

## Testing on Testnet

1. Deploy on Base Sepolia testnet first
2. Test minting Zero Quest Pass
3. Test claiming with valid signatures
4. Verify daily limits work correctly
5. Test edge cases (expired signatures, used nonces, etc.)

## Mainnet Deployment Checklist

- [ ] All tokens deployed and verified
- [ ] ZeroQuestPass deployed and verified
- [ ] ZQGame deployed and verified
- [ ] Contract addresses updated in frontend
- [ ] Tokens funded to ZQGame contract
- [ ] Backend signer configured correctly
- [ ] Ownership transferred to secure wallet
- [ ] All functions tested on testnet

## Contract Addresses

After deployment, update these in `/frontend/src/config/`:

```typescript
// nft.ts
export const nftContractAddress = '0x...';

// game.ts
export const gameContractAddress = '0x...';
```

## Gas Optimization

- Uses immutable variables for tokens and signer
- Efficient struct packing
- Minimal storage reads/writes
- ReentrancyGuard only on claim function

## OpenZeppelin Dependencies

```solidity
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
```

Install with:
```bash
npm install @openzeppelin/contracts
```

## License

MIT License
