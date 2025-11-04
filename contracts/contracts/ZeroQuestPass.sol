// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ZeroQuestPass
 * @dev NFT pass required to play Zero Quest puzzle game
 */
contract ZeroQuestPass is ERC1155, Ownable {
    uint256 public constant TOKEN_ID = 1;
    uint256 public mintPrice;
    mapping(address => bool) private _hasMinted;

    event PriceUpdated(uint256 newPrice);

    constructor(address _initialOwner)
        ERC1155("")
        Ownable(_initialOwner)
    {
        mintPrice = 0.00001 ether;
    }

    function name() public pure returns (string memory) {
        return "Zero Quest Pass";
    }

    function symbol() public pure returns (string memory) {
        return "ZQPASS";
    }

    function mint() external payable {
        require(!_hasMinted[msg.sender], "ZQPASS: You have already minted.");
        require(msg.value >= mintPrice, "ZQPASS: Incorrect ETH amount sent.");

        _hasMinted[msg.sender] = true;
        _mint(msg.sender, TOKEN_ID, 1, "");
    }

    function updatePrice(uint256 _newPrice) external onlyOwner {
        mintPrice = _newPrice;
        emit PriceUpdated(_newPrice);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "ZQPASS: No balance to withdraw.");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "ZQPASS: Withdrawal failed.");
    }

    function rescueERC20(address tokenAddress, uint256 amount) external onlyOwner {
        require(IERC20(tokenAddress).balanceOf(address(this)) >= amount, "ZQPASS: Insufficient token balance.");
        IERC20(tokenAddress).transfer(owner(), amount);
    }

    function hasMinted(address user) external view returns (bool) {
        return _hasMinted[user];
    }
}
