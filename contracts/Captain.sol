// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IIsland.sol";
import "./UpgradableEntity.sol";

contract Captain is UpgradableEntity {
    IIsland private island;

    mapping(uint256 => GameLibrary.CaptainStats) public idToCaptains;

    constructor() public ERC721("CPT", "NVYCPT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        levelToUpgrade[1] = GameLibrary.UpgradeRequirementsByLevel(100, 1, 55);
        levelToUpgrade[2] = GameLibrary.UpgradeRequirementsByLevel(100, 1, 55);
        levelToUpgrade[3] = GameLibrary.UpgradeRequirementsByLevel(70, 2, 55);
        levelToUpgrade[4] = GameLibrary.UpgradeRequirementsByLevel(51, 2, 55);
        levelToUpgrade[5] = GameLibrary.UpgradeRequirementsByLevel(39, 3, 55);
        levelToUpgrade[6] = GameLibrary.UpgradeRequirementsByLevel(28, 3, 55);
        levelToUpgrade[7] = GameLibrary.UpgradeRequirementsByLevel(20, 5, 55);
        levelToUpgrade[8] = GameLibrary.UpgradeRequirementsByLevel(14, 8, 55);
        levelToUpgrade[9] = GameLibrary.UpgradeRequirementsByLevel(10, 13, 55);
        levelToUpgrade[10] = GameLibrary.UpgradeRequirementsByLevel(5, 21, 55);
    }

    function grantCaptain(
        address player,
        GameLibrary.CaptainStats memory captain,
        string memory tokenURI
    ) external onlyRole(NVY_BACKEND) {
        uint256 tokenId = grantNFT(player, tokenURI);
        idToCaptains[tokenId] = captain;
    }

    function updateCaptain(
        uint256 captainId,
        GameLibrary.CaptainStats memory captain,
        string memory newMetadataURI
    ) external onlyRole(NVY_BACKEND) {
        idToCaptains[captainId] = captain;
        _setTokenURI(captainId, newMetadataURI);
    }

    function tryUpgrade(uint256 captainId, uint256 islandId) external {
        require(
            ERC721.ownerOf(captainId) == msg.sender,
            "Only owner can upgrade"
        );
        island.requireMinted(islandId);

        uint256 nextLevel = idToEntityLevel[captainId] + 1;

        require(
            nextLevel <= GameLibrary.shipAndCaptainMaxLevel,
            "Max level already reached"
        );

        GameLibrary.UpgradeRequirementsByLevel memory req = levelToUpgrade[
            nextLevel
        ];

        uint256 reqNvy = req.nvy * 10 ** 18;
        uint256 reqAks = req.aks * 10 ** 18;

        require(nvyToken.balanceOf(msg.sender) >= reqNvy, "Not enought NVY");
        require(aksToken.balanceOf(msg.sender) >= reqAks, "Not enought AKS");

        // Pay the fees and burn tokens if not owner
        if (ERC721.ownerOf(captainId) != ERC721.ownerOf(islandId)) {
            uint256 feeNvy = (reqNvy / 100) *
                island.getIslandInfo(islandId).shipAndCaptainFee;
            uint256 feeAks = (reqAks / 100) *
                island.getIslandInfo(islandId).shipAndCaptainFee;

            nvyToken.burn(reqNvy - feeNvy);
            aksToken.burn(reqAks - feeAks);

            nvyToken.transfer(ERC721.ownerOf(islandId), feeNvy);
            aksToken.transfer(ERC721.ownerOf(islandId), feeAks);
        } else {
            nvyToken.burn(reqNvy / 2);
            aksToken.burn(reqAks / 2);
        }

        emit UpgradeEntity(msg.sender, captainId);
    }

    // ---------------------------------------
    // Staking
    // ---------------------------------------

    function startStaking(uint256 captainId) external {
        require(
            ERC721.ownerOf(captainId) == msg.sender,
            "Only owner can stake"
        );
        GameLibrary.CaptainStats memory captain = idToCaptains[captainId];
        require(!captain.staking, "Staking already started");

        captain.stakingStartedAt = block.timestamp;
        captain.staking = true;
    }

    function collectStakingRewards(uint256 captainId) external {
        require(
            ERC721.ownerOf(captainId) == msg.sender,
            "Only owner can collect rewards"
        );
        GameLibrary.CaptainStats memory captain = idToCaptains[captainId];
        require(captain.staking, "Staking must be started first");
        require(
            captain.stakingStartedAt + captain.stakingDurationSeconds <
                block.timestamp,
            "Staking is not finished yet"
        );

        captain.stakingStartedAt = 0;
        captain.staking = false;

        nvyToken.mintIslandRewardByCaptain(
            msg.sender,
            captain.stakingRewardNVY
        );
    }

    // ---------------------------------------
    // Admin functions
    // ---------------------------------------

    function setIslandContractAddress(
        address addr
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        island = IIsland(addr);
    }
}
