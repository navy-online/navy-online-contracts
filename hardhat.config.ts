import * as dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

const GanachePrivateKey = <string>process.env.GANACHE_PRIVATE_KEY;
const MainnetPrivateKey = <string>process.env.MAINNET_PRIVATE_KEY;
const TestnetPrivateKey = <string>process.env.TESTNET_PRIVATE_KEY;

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  console.log('Accounts:');
  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  networks: {
    hardhat: {},
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [GanachePrivateKey],
    },
    cronosTestnet: {
      url: "https://evm-t3.cronos.org",
      chainId: 338,
      accounts: [TestnetPrivateKey],
      gasPrice: 5000000000000,
    },
    cronos: {
      url: "https://evm.cronos.org/",
      chainId: 25,
      accounts: [MainnetPrivateKey],
      gasPrice: 5000000000000,
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  }
};

export default config;