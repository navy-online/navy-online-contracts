// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./IIsland.sol";
import "./IToken.sol";
import "./GameLibrary.sol";

// TODO implement totalSupply
abstract contract UpgradableEntity is ERC721URIStorage, AccessControl {
    // IToken public nvyToken;
    // IToken public aksToken;

    // To keep track of token id's
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Navy.online admin wallet
    bytes32 public constant NVY_BACKEND = keccak256("NVY_BACKEND");

    // Keep track of every upgrade costs by level
    // mapping(uint256 => GameLibrary.UpgradeRequirementsByLevel)
    //     public levelToUpgrade;

    // Keep track of every entity level by it's id
    // mapping(uint256 => uint256) public idToEntityLevel;

    event GrantEntity(address owner, uint256 tokenId);

    // event UpgradeEntity(address owner, uint256 tokenId);

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function requireMinted(uint256 tokenId) external view {
        _requireMinted(tokenId);
    }

    function grantNFT(
        address player,
        string memory tokenURI
    ) public onlyRole(NVY_BACKEND) returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        // idToEntityLevel[newItemId] = 0;

        _mint(player, newItemId);

        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    // ---------------------------------------
    // Admin functions
    // ---------------------------------------

    // function changeUpgradeRequirementsByLevel(
    //     uint256 level,
    //     uint256 chance,
    //     uint256 nvy,
    //     uint256 aks
    // ) external onlyRole(NVY_BACKEND) {
    //     levelToUpgrade[level] = GameLibrary.UpgradeRequirementsByLevel(
    //         chance,
    //         nvy,
    //         aks
    //     );
    // }

    function addNvyBackendAddress(
        address addr
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            !hasRole(NVY_BACKEND, addr),
            "Nvy backend address already added."
        );
        _grantRole(NVY_BACKEND, addr);
    }

    // function removeNvyBackendAddr(
    //     address addr
    // ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    //     require(
    //         !hasRole(NVY_BACKEND, addr),
    //         "Address is not a recognized NVY backend."
    //     );
    //     _revokeRole(NVY_BACKEND, addr);
    // }

    // function setNvyContract(
    //     address addr
    // ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    //     nvyToken = IToken(addr);
    // }

    // function setAksContract(
    //     address addr
    // ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    //     aksToken = IToken(addr);
    // }

    // function updateUpgradeRequirements(
    //     uint256 level,
    //     uint256 chance,
    //     uint256 nvy,
    //     uint256 aks
    // ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    //     levelToUpgrade[level] = GameLibrary.UpgradeRequirementsByLevel(
    //         chance,
    //         nvy,
    //         aks
    //     );
    // }

    // ---------------------------------------
    // Misc
    // ---------------------------------------

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
