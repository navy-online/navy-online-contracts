// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CollectionSale is Ownable {
    // ---------------------------------------
    // Minting
    // ---------------------------------------

    enum MintState {
        DISABLED,
        WHITELIST,
        PUBLIC
    }
    MintState mintState = MintState.DISABLED; // 0, 1, 2

    uint256 public tokensTotal;
    uint256 public mintPrice;

    // TODO add token type

    event GenerateToken(address owner);

    constructor(uint256 _tokensTotal, uint256 _mintPrice) {
        tokensTotal = _tokensTotal;
        mintPrice = _mintPrice;
    }

    function changeSaleState(MintState _mintState) external onlyOwner {
        mintState = _mintState;
    }

    // ---------------------------------------
    // Whitelist stuff
    // ---------------------------------------

    mapping(address => bool) public whitelist;

    function addToWhitelist(
        address[] calldata toAddAddresses
    ) external onlyOwner {
        for (uint i = 0; i < toAddAddresses.length; i++) {
            whitelist[toAddAddresses[i]] = true;
        }
    }

    function addToWhitelist(address toAddAddress) external onlyOwner {
        whitelist[toAddAddress] = true;
    }

    function removeFromWhitelist(
        address[] calldata toRemoveAddresses
    ) external onlyOwner {
        for (uint i = 0; i < toRemoveAddresses.length; i++) {
            delete whitelist[toRemoveAddresses[i]];
        }
    }

    function removeFromWhitelist(address toRemoveAddress) external onlyOwner {
        delete whitelist[toRemoveAddress];
    }

    // ---------------------------------------

    function mint() external payable {
        require(mintState != MintState.DISABLED, "Mint is disabled for now");
        require(tokensTotal > 0, "No more tokens for sale");
        require(address(msg.sender).balance >= mintPrice, "Insufficient funds");
        if (mintState == MintState.WHITELIST) {
            require(whitelist[msg.sender], "You need to be whitelisted");
        }
        tokensTotal -= 1;
        emit GenerateToken(msg.sender);
    }
}
