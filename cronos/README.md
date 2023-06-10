# Navy.online smart contracts

```shell
npm i
npx hardhat compile
npx hardhat test
npm run deploy***
```

Contracts verification sample:

```shell

Marketplace contract:
npx hardhat verify 0x59911FF9eFee39d96EbDeee940F28e26DccD8530 --network cronosTestnet

Captain contract:
npx hardhat verify 0x2f79860E2a2829AF3C135880da1e8fC3fD9AE398 --network cronosTestnet

Captain sale sontract:
npx hardhat verify 0x16223935C5b2Ae50785604dDee8E350334805f05 --network cronosTestnet 1000000000000000000 200

1) Change mint state for sale contract
2) Add backend address for collection nft
3) Mint

```

Last deployed:

Marketplace address: 0x59911FF9eFee39d96EbDeee940F28e26DccD8530
Captain address: 0x2f79860E2a2829AF3C135880da1e8fC3fD9AE398
Captain collection address: 0x16223935C5b2Ae50785604dDee8E350334805f05