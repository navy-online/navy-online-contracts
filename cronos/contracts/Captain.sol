// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./UpgradableEntity.sol";

contract Captain is UpgradableEntity {
    constructor() public ERC721("CPT", "NVYCPT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
}
