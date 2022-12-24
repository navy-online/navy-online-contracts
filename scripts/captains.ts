// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
import { ethers } from "hardhat";

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  // const Lock = await hre.ethers.getContractFactory("Lock");
  // const lock = await Lock.deploy(unlockTime, { value: lockedAmount });
  // await lock.deployed();

  // console.log(
  //   `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  // );

  const Captain = await ethers.getContractFactory("Captain");
  const captainContract = await Captain.deploy();
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

  // TODO make mint public
  // await captainCollectionSaleContract.changeSaleState(2);

  // uint256 public tokensTotal;
  // uint256 public mintPrice;
  // address public contractAddress;

  // TODO set admin stuff here

  console.log('Captains gen 1 and sale contracts deployed!');
  console.log('Captain contract address: ' + captainContract.address + ', sale contract address: ' + captainCollectionSaleContract.address);


  // 1000, {from: accounts[1], value: 1000}

  await captainCollectionSaleContract.changeSaleState(2);

  await captainCollectionSaleContract.mint({ value: mintPrice });
  // await captainCollectionSaleContract.mint({ value: mintPrice });

  console.log('Minted ?');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
