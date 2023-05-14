// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./IIsland.sol";
import "./IToken.sol";
import "./GameLibrary.sol";

abstract contract UpgradableEntity is ERC721URIStorage, AccessControl {
    // To keep track of token id's
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event GrantEntity(address owner, uint256 tokenId);

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function requireMinted(uint256 tokenId) external view {
        _requireMinted(tokenId);
    }

    function grantNFT(
        address player,
        string memory tokenURI
    ) public onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        _mint(player, newItemId);

        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function updateTokenURI(
        uint256 itemId,
        string memory tokenURI
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setTokenURI(itemId, tokenURI);
    }

    // ---------------------------------------
    // Misc
    // ---------------------------------------

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
