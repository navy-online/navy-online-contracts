// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Collection is Ownable {
    // To keep track of token id's
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // ---------------------------------------
    // Minting
    // ---------------------------------------

    enum MintState {
        DISABLED,
        WHITELIST,
        PUBLIC
    }
    MintState public mintState = MintState.DISABLED; // 0, 1, 2

    uint256 public totalSupply;
    uint256 public mintPrice;

    event NftMinted(uint256 id, address owner);

    constructor(uint256 _mintPrice, uint256 _totalSupply) {
        mintPrice = _mintPrice;
        totalSupply = _totalSupply;
    }

    function changeMintState(MintState _mintState) external onlyOwner {
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

    function currentSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function mintNft() external payable {
        require(msg.value == mintPrice, "Wrong mint price");
        require(mintState != MintState.DISABLED, "Mint is disabled for now");
        require(totalSupply > _tokenIds.current(), "No more tokens for sale");
        if (mintState == MintState.WHITELIST) {
            require(whitelist[msg.sender], "You need to be whitelisted");
        }

        _tokenIds.increment();

        emit NftMinted(_tokenIds.current(), msg.sender);
    }
}
