// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ZQGame
 * @dev Zero Quest game rewards contract - manages puzzle completion rewards
 */
contract ZQGame is Ownable, ReentrancyGuard {
    struct PlayerInfo {
        uint256 dailyClaimsUsed;
        uint256 periodStartTimestamp;
    }

    struct RewardTokenInfo {
        IERC20 token;
        uint256 maxClaim;
    }

    IERC20 public immutable ZQT; // Zero Quest Token (main reward)
    address public immutable Signer; // Backend signer address

    RewardTokenInfo public rewardToken2; // Bonus token 1
    RewardTokenInfo public rewardToken3; // Bonus token 2

    uint256 public dailyClaimLimit;
    uint256 public maxClaimZQT;
    uint256 public constant COOLDOWN_PERIOD = 12 hours;

    mapping(address => PlayerInfo) public players;
    mapping(uint256 => bool) public usedNonces;

    event Claimed(address indexed user, address indexed token, uint256 amount);
    event DailyLimitUpdated(uint256 newLimit);
    event RewardTokenUpdated(uint8 indexed tokenSlot, address indexed tokenAddress, uint256 newMaxClaim);
    event MaxClaimZQTUpdated(uint256 newMaxClaim);

    constructor(
        address initialOwner,
        address _ZQT,
        address _token2,
        address _token3,
        address _Signer
    ) Ownable(initialOwner) {
        ZQT = IERC20(_ZQT);
        Signer = _Signer;
        dailyClaimLimit = 4;
        maxClaimZQT = 500; // Max 500 ZQT per claim

        rewardToken2 = RewardTokenInfo({
            token: IERC20(_token2),
            maxClaim: 25 * 1e16 // 0.25 tokens
        });

        rewardToken3 = RewardTokenInfo({
            token: IERC20(_token3),
            maxClaim: 5 * 1e18 // 5 tokens
        });
    }

    /**
     * @dev Claim rewards after completing a puzzle
     * @param databytes Encoded claim data (recipient, amounts, deadline, nonce)
     * @param v, r, s ECDSA signature components
     */
    function claim(bytes memory databytes, uint8 v, bytes32 r, bytes32 s) external nonReentrant {
        PlayerInfo storage player = players[msg.sender];

        // Reset daily claims if cooldown period has passed
        if (block.timestamp >= player.periodStartTimestamp + COOLDOWN_PERIOD) {
            player.dailyClaimsUsed = 0;
            player.periodStartTimestamp = block.timestamp;
        }

        require(player.dailyClaimsUsed < dailyClaimLimit, "ZQGame: Daily claim limit reached");

        // Decode claim data
        (
            address recipient,
            uint256 amountZQT,
            address rewardTokenAddress,
            uint256 rewardTokenAmount,
            uint256 deadline,
            uint256 nonce
        ) = abi.decode(databytes, (address, uint256, address, uint256, uint256, uint256));

        // Validation
        require(recipient == msg.sender, "ZQGame: Invalid recipient");
        require(block.timestamp <= deadline, "ZQGame: Signature expired");
        require(!usedNonces[nonce], "ZQGame: Nonce already used");
        require(amountZQT <= maxClaimZQT, "ZQGame: ZQT amount exceeds max limit");

        // Validate reward token amount
        if (rewardTokenAddress == address(rewardToken2.token)) {
            require(rewardTokenAmount <= rewardToken2.maxClaim, "ZQGame: Token2 amount exceeds max limit");
        } else if (rewardTokenAddress == address(rewardToken3.token)) {
            require(rewardTokenAmount <= rewardToken3.maxClaim, "ZQGame: Token3 amount exceeds max limit");
        } else {
            revert("ZQGame: Invalid reward token");
        }

        // Verify signature
        bytes32 messageHash = keccak256(databytes);
        address recoveredSigner = ecrecover(messageHash, v, r, s);
        require(recoveredSigner == Signer, "ZQGame: Invalid signature");

        // Update state
        player.dailyClaimsUsed++;
        usedNonces[nonce] = true;

        // Transfer rewards
        ZQT.transfer(recipient, amountZQT);
        emit Claimed(recipient, address(ZQT), amountZQT);

        IERC20(rewardTokenAddress).transfer(recipient, rewardTokenAmount);
        emit Claimed(recipient, rewardTokenAddress, rewardTokenAmount);
    }

    /**
     * @dev Update daily claim limit
     */
    function updateDailyLimit(uint256 _newDailyLimit) external onlyOwner {
        dailyClaimLimit = _newDailyLimit;
        emit DailyLimitUpdated(_newDailyLimit);
    }

    /**
     * @dev Update max ZQT claimable per game
     */
    function updateMaxClaimZQT(uint256 _newMaxClaim) external onlyOwner {
        maxClaimZQT = _newMaxClaim;
        emit MaxClaimZQTUpdated(_newMaxClaim);
    }

    /**
     * @dev Update reward token configuration
     */
    function updateRewardToken(uint8 _tokenSlot, address _newTokenAddress, uint256 _newMaxClaim) external onlyOwner {
        require(_tokenSlot == 2 || _tokenSlot == 3, "ZQGame: Invalid token slot");
        if (_tokenSlot == 2) {
            rewardToken2 = RewardTokenInfo({
                token: IERC20(_newTokenAddress),
                maxClaim: _newMaxClaim
            });
        } else {
            rewardToken3 = RewardTokenInfo({
                token: IERC20(_newTokenAddress),
                maxClaim: _newMaxClaim
            });
        }
        emit RewardTokenUpdated(_tokenSlot, _newTokenAddress, _newMaxClaim);
    }

    /**
     * @dev Withdraw native tokens
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev Withdraw ERC20 tokens
     */
    function withdrawERC20(address _tokenAddress, uint256 _amount) external onlyOwner {
        IERC20(_tokenAddress).transfer(owner(), _amount);
    }

    /**
     * @dev Get player info
     */
    function getPlayerInfo(address _player) external view returns (uint256 claimsUsed, uint256 periodStart, uint256 claimsRemaining) {
        PlayerInfo memory player = players[_player];

        // Check if cooldown period has passed
        if (block.timestamp >= player.periodStartTimestamp + COOLDOWN_PERIOD) {
            claimsUsed = 0;
            periodStart = 0;
            claimsRemaining = dailyClaimLimit;
        } else {
            claimsUsed = player.dailyClaimsUsed;
            periodStart = player.periodStartTimestamp;
            claimsRemaining = dailyClaimLimit > player.dailyClaimsUsed ? dailyClaimLimit - player.dailyClaimsUsed : 0;
        }
    }
}
