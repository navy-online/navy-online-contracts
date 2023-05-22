// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

abstract contract UpgradableEntity is ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NftGenerated(uint256 id, address owner);

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function requireMinted(uint256 tokenId) external view {
        _requireMinted(tokenId);
    }

    function generateNft(
        uint256 nftId,
        string memory tokenURI,
        address owner
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _tokenIds.increment();
        _mint(owner, nftId);
        _setTokenURI(nftId, tokenURI);
        emit NftGenerated(nftId, owner);
    }

    function updateTokenURI(
        uint256 id,
        string memory tokenURI
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setTokenURI(id, tokenURI);
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
