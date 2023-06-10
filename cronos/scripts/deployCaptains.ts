import { ethers } from "hardhat";

async function main() {
  const Captain = await ethers.getContractFactory("Captain");
  const captainContract = await Captain.deploy();
  await captainContract.deployed();
  const captainContractAddress = captainContract.address;

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplaceContract = await Marketplace.deploy(captainContractAddress);
  await marketplaceContract.deployed();

  const tokensTotal = 200;
  const mintPrice = ethers.utils.parseEther("1");

  const CollectionSale = await ethers.getContractFactory("Collection");
  const captainCollectionSaleContract = await CollectionSale.deploy(mintPrice, tokensTotal);
  await captainCollectionSaleContract.deployed();

  console.log('Marketplace address: ' + marketplaceContract.address);
  console.log('Captain address: ' + captainContract.address);
  console.log('Captain collection sale address: ' + captainCollectionSaleContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});