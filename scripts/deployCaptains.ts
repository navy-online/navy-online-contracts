import { ethers } from "hardhat";

async function main() {
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplaceContract = await Marketplace.deploy();
  await marketplaceContract.deployed();

  const Captain = await ethers.getContractFactory("Captain");
  const captainContract = await Captain.deploy();
  await captainContract.deployed();

  const tokensTotal = 200;
  const mintPrice = ethers.utils.parseEther("1");
  const captainContractAddress = captainContract.address;

  const CollectionSale = await ethers.getContractFactory("CollectionSale");
  const captainCollectionSaleContract = await CollectionSale.deploy(tokensTotal, mintPrice, captainContractAddress);
  await captainCollectionSaleContract.deployed();

  console.log('Marketplace address: ' + marketplaceContract.address);
  console.log('Captain address: ' + captainContract.address);
  console.log('Captain collection sale address: ' + captainCollectionSaleContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});