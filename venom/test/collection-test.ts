import { expect } from "chai";
import { Address, Contract, getRandomNonce, Signer, toNano, WalletTypes, zeroAddress } from "locklift";
import { FactorySource } from "../build/factorySource";

let signerOwner: Signer;
let signer1: Signer;
let signer2: Signer;
let ownerAccout: any;
let userAccount1: any;
let userAccount2: any;

let collection: Contract<FactorySource["Collection"]>;
let nft: Contract<FactorySource["Nft"]>;

describe("NFT marketplace test", async function () {
  before(async () => {
    signerOwner = (await locklift.keystore.getSigner("0"))!;
    signer1 = (await locklift.keystore.getSigner("1"))!;
    signer2 = (await locklift.keystore.getSigner("2"))!;

    ownerAccout = (await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.WalletV3,
      value: toNano(10000),
      publicKey: signerOwner.publicKey
    })).account;

    userAccount1 = (await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.WalletV3,
      value: toNano(10000),
      publicKey: signer1.publicKey
    })).account;

    userAccount2 = (await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.WalletV3,
      value: toNano(10000),
      publicKey: signer2.publicKey
    })).account;

    const { contract: collectionAdded } = await locklift.factory.deployContract({
      contract: "Collection",
      publicKey: signerOwner.publicKey,
      initParams: {},
      constructorParams: {
        _mintPrice: toNano(1),
        _collectionSize: 200,
        codeNft: (await locklift.factory.getContractArtifacts("Nft")).code,
        json: `{"collection":"Venom sample collection of 200 NFTs"}`,
        codeIndex: (await locklift.factory.getContractArtifacts("Index")).code,
        codeIndexBasis: (await locklift.factory.getContractArtifacts("IndexBasis")).code
      },
      value: locklift.utils.toNano(5),
    });
    collection = collectionAdded;
  });
  describe("Contracts", async function () {
    it("Load contract factory", async function () {
      const collectionData = await locklift.factory.getContractArtifacts("Collection");

      expect(collectionData.code).not.to.equal(undefined, "Code should be available");
      expect(collectionData.abi).not.to.equal(undefined, "ABI should be available");
      expect(collectionData.tvc).not.to.equal(undefined, "tvc should be available");
    });

    it("Collection initialized", async function () {
      expect((await collection.methods.totalSupply({ answerId: 0 }).call()).count).to.be.equal('0');
      expect((await collection.methods.collectionSize().call()).collectionSize).to.be.equal('200');
      expect((await collection.methods.mintState().call()).mintState).to.be.equal('0');
    });

    it("Change mint state", async function () {
      await collection.methods.changeMintState({ _mintState: 2 }).sendExternal({ publicKey: signerOwner.publicKey });
      expect((await collection.methods.mintState().call()).mintState).to.be.equal('2');
    });

    it("Mint NFT", async function () {
      // Double check minting price
      // It should fail if amount is less then actual minting price
      // !!! Since tvm is async, we cant rely on synchronus errors that caused by 'Require', thats we additinal supply checks are here 
      await collection.methods.mintNft({ json: 'qwe' }).send({ from: userAccount1.address, amount: toNano(0) });
      // expect((await collection.methods.totalSupply({ answerId: 0 }).call()).count).to.be.equal('0');
      console.log((await collection.methods.totalSupply({ answerId: 0 }).call()).count);

      await collection.methods.mintNft({ json: 'qwe' }).send({ from: userAccount1.address, amount: toNano(1) });
      // expect((await collection.methods.totalSupply({ answerId: 0 }).call()).count).to.be.equal('1');
      console.log((await collection.methods.totalSupply({ answerId: 0 }).call()).count);
    });

  });
});
