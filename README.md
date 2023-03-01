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
npx hardhat verify 0x6d2ce1f3341c49A791bf8b545f0A64CAe81FA8b3 --network cronosTestnet

Captain contract:
npx hardhat verify 0x219b82877f2E8004960265823d51CA50C8C81455 --network cronosTestnet

Captain sale sontract:
npx hardhat verify 0x375dFdAB64BB19008FB64970A29333f58dAC6a3d --network cronosTestnet 200 1000000000000000000 0x219b82877f2E8004960265823d51CA50C8C81455

1) Change mint state for sale contract
2) Add backend address for collection nft
3) Mint

```