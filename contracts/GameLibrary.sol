// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library GameLibrary {
    uint256 constant shipAndCaptainMaxLevel = 10;
    uint256 constant islandMaxLevel = 3;

    struct UpgradeRequirementsByLevel {
        uint256 chance;
        uint256 nvy;
        uint256 aks;
    }

    struct CaptainStats {
        bool staking;
        uint256 stakingRewardNVY;
        uint256 stakingStartedAt;
        uint256 stakingDurationSeconds;
    }

    struct ShipStats {
        uint256 maxIntegrity;
        uint256 currentIntegrity;
        uint256 repairCostNVY;
        uint256 repairCostAKS;
    }

    struct IslandStats {
        bool mining;
        uint256 miningStartedAt;
        uint256 miningDurationSeconds;
        uint256 miningRewardNVY;
        uint256 shipAndCaptainFee;
    }
}
