// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./UpgradableEntity.sol";

contract Captain is UpgradableEntity {
    constructor() public ERC721("CPT", "NVYCPT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function grantCaptain(
        address player,
        string memory tokenURI
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 tokenId = grantNFT(player, tokenURI);
        emit GrantEntity(player, tokenId);
    }
}
