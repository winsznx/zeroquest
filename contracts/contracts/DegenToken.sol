// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DegenToken
 * @dev Bonus reward token #2
 */
contract DegenToken is ERC20, Ownable {
    constructor(address _initialOwner)
        ERC20("Degen Token", "DEGEN")
        Ownable(_initialOwner)
    {
        // Mint initial supply to owner (500,000 tokens)
        _mint(_initialOwner, 500_000 * 10**18);
    }

    /**
     * @dev Mint new tokens (only owner)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
