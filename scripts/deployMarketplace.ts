import { ethers } from "hardhat";

async function main() {
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplaceContract = await Marketplace.deploy();
  await marketplaceContract.deployed();

  console.log('Marketplace contract address: ' + marketplaceContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});