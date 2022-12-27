# Navy.online smart contracts

```shell
npm i
npx hardhat compile
npx hardhat test
npm run deploy***
```

Contracts verification sample:

```shell

Captain contract - npx hardhat verify 0x9383A4BeC79fBFD5A2A9A88078504eCC87d6D0A3 --network cronosTestnet
Captain sale sontract - npx hardhat verify 0x9c65C527927f378a680c7EA75C48e666E09d4b72 --network cronosTestnet 200 1000000000000000000 "0x9383A4BeC79fBFD5A2A9A88078504eCC87d6D0A3"
```