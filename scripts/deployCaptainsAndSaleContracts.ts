import { ethers } from "hardhat";

async function main() {
  const Captain = await ethers.getContractFactory("Captain");
  const captainContract = await Captain.deploy('0x175Df5CF497C1FbC843699244E8deAb3B15aA9a4');
  await captainContract.deployed();

  const tokensTotal = 200;
  const mintPrice = ethers.utils.parseEther("1");
  const captainContractAddress = captainContract.address;

  const CollectionSale = await ethers.getContractFactory("CollectionSale");
  const captainCollectionSaleContract = await CollectionSale.deploy(tokensTotal, mintPrice, captainContractAddress);
  await captainCollectionSaleContract.deployed();

  const isActiveContract = await captainCollectionSaleContract.tokensTotal();
  const mintPriceContract = await captainCollectionSaleContract.mintPrice();
  const contractAddressContract = await captainCollectionSaleContract.contractAddress();
  const mintState = await captainCollectionSaleContract.mintState();

  console.log(isActiveContract, mintPriceContract, contractAddressContract, mintState);
  console.log('Captains gen 1 and sale contracts deployed!');
  console.log('Captain contract address: ' + captainContract.address + ', sale contract address: ' + captainCollectionSaleContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});