// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./GameLibrary.sol";

interface IIsland {
    function requireMinted(uint256 islandId) external view;

    function getIslandInfo(
        uint256 islandId
    ) external view returns (GameLibrary.IslandStats memory);

    function addMiner(uint256 islandId) external;

    function removeMiner(uint256 islandId) external;
}
