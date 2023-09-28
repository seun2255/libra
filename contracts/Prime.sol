// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Libra Token
 * @dev This is the Libra token.
 */
contract Prime is ERC20 {
    uint256 public tokenPrice = 1000000000000000; // Adjust this price as needed

    constructor() ERC20("Prime", "PRI") {
        uint256 initialSupply = 1000 * 10 ** uint256(decimals());
        _mint(msg.sender, initialSupply);
    }

    function buyTokens() external payable {
        require(msg.value > 0, "Amount must be greater than 0");

        uint256 etherAmount = msg.value / 1e18; // Convert Wei to Ether

        uint256 tokenAmount = (etherAmount * (10 ** decimals())) / tokenPrice;

        _mint(msg.sender, tokenAmount * 10 ** decimals());
    }

    function sellTokens(uint256 tokenAmount) external {
        require(tokenAmount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= tokenAmount, "Insufficient balance");

        uint256 ethAmount = (tokenAmount * tokenPrice) / (10 ** decimals());

        _burn(msg.sender, tokenAmount);

        (bool sent, ) = msg.sender.call{value: ethAmount}("");
        require(sent, "Failed to send Ether");
    }

    function getEthBalance() external view returns (uint256) {
        return msg.sender.balance;
    }
}
