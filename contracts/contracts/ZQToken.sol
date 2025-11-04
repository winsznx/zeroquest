// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ZQToken
 * @dev Zero Quest Token - Main reward token for the game
 */
contract ZQToken is ERC20, Ownable {
    constructor(address _initialOwner)
        ERC20("Zero Quest Token", "ZQT")
        Ownable(_initialOwner)
    {
        // Mint initial supply to owner (1 million tokens)
        _mint(_initialOwner, 1_000_000 * 10**18);
    }

    /**
     * @dev Mint new tokens (only owner)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
