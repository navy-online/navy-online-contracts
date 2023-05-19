import { expect } from "chai";
import { Contract, toNano, WalletTypes } from "locklift";
import { Account } from "everscale-standalone-client/nodejs";
import { FactorySource } from "../build/factorySource";

let ownerAccount: Account;
let user1Account: Account;
let user2Account: Account;

let collection: Contract<FactorySource["Collection"]>;
let marketplace: Contract<FactorySource["Marketplace"]>;

describe("NFT marketplace test", async function () {
  before(async () => {
    const contractOwnerSigner = (await locklift.keystore.getSigner("0"))!;
    const user1Signer = (await locklift.keystore.getSigner("1"))!;
    const user2Signer = (await locklift.keystore.getSigner("2"))!;

    ownerAccount = (await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.EverWallet,
      value: toNano(10000),
      publicKey: contractOwnerSigner.publicKey
    })).account;

    user1Account = (await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.EverWallet,
      value: toNano(10000),
      publicKey: user1Signer.publicKey
    })).account;

    user2Account = (await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.EverWallet,
      value: toNano(10000),
      publicKey: user2Signer.publicKey
    })).account;

    console.log('ownerAccount address: ' + ownerAccount.address + ', balance: ' + await locklift.provider.getBalance(ownerAccount.address));
    console.log('user1Account address: ' + user1Account.address + ', balance: ' + await locklift.provider.getBalance(user1Account.address));
    console.log('user2Account address: ' + user2Account.address + ', balance: ' + await locklift.provider.getBalance(user2Account.address));

    const { contract: collectionContract } = await locklift.factory.deployContract({
      contract: "Collection",
      publicKey: contractOwnerSigner.publicKey,
      initParams: {
      },
      constructorParams: {
        _mintPrice: locklift.utils.toNano(1),
        _collectionSize: 200,
        codeNft: (await locklift.factory.getContractArtifacts("Nft")).code,
        json: `{"collection":"Navy online game captains collection of 200 NFTs"}`,
        codeIndex: (await locklift.factory.getContractArtifacts("Index")).code,
        codeIndexBasis: (await locklift.factory.getContractArtifacts("IndexBasis")).code,
        ownerAddress: ownerAccount.address
      },
      value: locklift.utils.toNano(5),
    });

    collection = collectionContract;
    console.log(`Collection deployed at: ${collection.address.toString()}`);

    const { contract: marketplaceContract } = await locklift.factory.deployContract({
      contract: "Marketplace",
      publicKey: contractOwnerSigner.publicKey,
      initParams: {
      },
      constructorParams: {
        ownerAddress: ownerAccount.address,
        _collectionAddress: collection.address
      },
      value: locklift.utils.toNano(5),
    });

    marketplace = marketplaceContract;
    console.log(`Marketplace deployed at: ${marketplace.address.toString()}`);
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
      expect((await collection.methods.mintPrice().call()).mintPrice).to.be.equal('1000000000');
    });

    it("Change mint state", async function () {
      await collection.methods.changeMintState({ _mintState: 2 }).send({ from: ownerAccount.address, amount: '1000000000' });
      expect((await collection.methods.mintState().call()).mintState).to.be.equal('2');
    });

    it("Mint NFT", async function () {
      // Try to mint an nft and fail because of amount
      await collection.methods.mintNft().send({ from: user1Account.address, amount: toNano(0) });
      expect((await collection.methods.totalSupply({ answerId: 0 }).call()).count).to.be.equal('0');

      // Try to mint and catch minted event
      const mintNft1Trace = await locklift.tracing.trace(collection.methods.mintNft().send({ from: user1Account.address, amount: toNano(1.5) }));
      const mintNft1Events = mintNft1Trace.traceTree?.findEventsForContract({
        contract: collection,
        name: "NftMinted" as const
      });

      // Make sure that we have one mint event emitted
      expect(mintNft1Events?.length).to.be.equal(1);

      const generateNft1Params = {
        id: mintNft1Events![0].id,
        json: '{dummy1}',
        minter: mintNft1Events![0].owner
      }

      // Try to generate nft by the 'backend side' and emit event
      const generateNft1Trace = await locklift.tracing.trace(collection.methods.generateNft(generateNft1Params)
        .send({ from: ownerAccount.address, amount: toNano(1.5) }));
      const generateNft1Events = generateNft1Trace.traceTree?.findEventsForContract({
        contract: collection,
        name: "NftGenerated" as const
      });

      // Make sure that event was emitted
      expect(generateNft1Events?.length).to.be.equal(1);

      // Try to get newly generated NFT (first id is 1)
      const { nft: nftAddress } = await collection.methods.nftAddress({ answerId: 0, id: 1 }).call();
      const nftContract = await locklift.factory.getDeployedContract("Nft", nftAddress);

      // Try to get NFT info and make sure that user1Account is an owner of it
      const nftInfo = await nftContract.methods.getInfo({ answerId: 0 }).call();
      expect(nftInfo?.owner.equals(user1Account.address)).to.be.equal(true);
    });

    it("List and delist nft on the marketplace", async function () {
      const nft = await getNftById(1);

      // Transfer nft 1 to the marketplace
      await listNftOnTheMarketplace(nft.nftContract, user1Account);

      // Check that nft is actually transfered and belongs to the marketplace, listed by user1
      const nftsListed1 = await marketplace.methods.nftsListedByAddress({}).call();
      expect(nftsListed1.nftsListedByAddress.length).to.be.equal(1);

      const listedNft1 = {
        address: nftsListed1.nftsListedByAddress[0][0],
        nftStruct: nftsListed1.nftsListedByAddress[0][1]
      }

      expect(listedNft1.nftStruct.owner.equals(marketplace.address)).to.be.equal(true);
      expect(listedNft1.nftStruct.seller.equals(user1Account.address)).to.be.equal(true);

      // Delist NFT and catch the event emitted
      const delistNftTrace = await locklift.tracing.trace(marketplace.methods.delistNft({ nftAddress: nft.nftAddress }).send({
        from: user1Account.address, amount: toNano(1)
      }));

      const delistNftTraceEvents = delistNftTrace.traceTree?.findEventsForContract({
        contract: marketplace,
        name: "NFTDelisted" as const
      });

      // Make sure that event was emitted
      expect(delistNftTraceEvents?.length).to.be.equal(1);

      // Make sure that nft lised mapping is cleared properly
      const nftsListed2 = await marketplace.methods.nftsListedByAddress({}).call();
      expect(nftsListed2.nftsListedByAddress.length).to.be.equal(0);
    });

    it("List and start nft sale on the marketplace", async function () {
      // After nft being listed, user needs to actually set a price for it, and nft will be available for buying
      const nft = await getNftById(1);

      // Transfer nft 1 to the marketplace
      await listNftOnTheMarketplace(nft.nftContract, user1Account);

      // Double check that nft is acually listed
      const nftsListed1 = await marketplace.methods.nftsListedByAddress({}).call();
      expect(nftsListed1.nftsListedByAddress.length).to.be.equal(1);

      // Start NFT sale and catch it's event
      const startNftSellingTrace = await locklift.tracing.trace(
        marketplace.methods.startNftSelling({ nftAddress: nft.nftAddress, price: 2000000000 }).send({
          from: user1Account.address,
          amount: toNano(1)
        })
      );

      // Double check that nft is acually on sale
      const nftsListed2 = await marketplace.methods.nftsListedByAddress({}).call();
      expect(nftsListed2.nftsListedByAddress.length).to.be.equal(0);

      const nftsOnSale1 = await marketplace.methods.nftsForSaleByAddress({}).call();
      expect(nftsOnSale1.nftsForSaleByAddress.length).to.be.equal(1);

      const startNftSellingEvents = startNftSellingTrace.traceTree?.findEventsForContract({
        contract: marketplace,
        name: "NFTPriceSet" as const
      });

      // Make sure that event was emitted
      expect(startNftSellingEvents?.length).to.be.equal(1);
    });

    it("Buy nft on the marketplace", async function () {
      const nft = await getNftById(1);

      const nftSellerBalanceBeforeSale = await locklift.provider.getBalance(user1Account.address);

      // Start NFT sale and catch it's event
      const buyNftTrace = await locklift.tracing.trace(
        marketplace.methods.buyNft({ nftAddress: nft.nftAddress }).send({
          from: user2Account.address,
          amount: toNano(3)
        })
      );

      const buyNftTraceEvents = buyNftTrace.traceTree?.findEventsForContract({
        contract: marketplace,
        name: "NFTSold" as const
      });

      // Make sure that event was emitted
      expect(buyNftTraceEvents?.length).to.be.equal(1);

      // Make sure that mappings are correct
      const nftsSold1 = await marketplace.methods.nftsSoldByAddress({}).call();
      expect(nftsSold1.nftsSoldByAddress.length).to.be.equal(1);

      const nftsForSale1 = await marketplace.methods.nftsForSaleByAddress({}).call();
      expect(nftsForSale1.nftsForSaleByAddress.length).to.be.equal(0);

      // Make sure that user2 owns NFT
      const nftInfo = await nft.nftContract.methods.getInfo({ answerId: 0 }).call();
      expect(nftInfo?.owner.equals(user2Account.address)).to.be.equal(true);

      // Make sure that seller got his money
      const nftSellerBalanceAfterSale = await locklift.provider.getBalance(user1Account.address);

      // TODO compare bignumbers
      // expect(nftSellerBalanceAfterSale).to.be.greaterThan(nftSellerBalanceBeforeSale);
      console.log(nftSellerBalanceBeforeSale, nftSellerBalanceAfterSale);
    });

  });
});

async function getNftById(id: number) {
  const { nft: nftAddress } = await collection.methods.nftAddress({ answerId: 0, id }).call();
  const nftContract = locklift.factory.getDeployedContract("Nft", nftAddress);

  return {
    nftAddress,
    nftContract
  }
}

async function listNftOnTheMarketplace(nftContract: Contract<FactorySource["Nft"]>, userAccount: Account) {
  await nftContract.methods.transfer({
    to: marketplace.address,
    sendGasTo: userAccount.address,
    // I have no idea why value is 0.1 ton... just copy/pasted it from some example.
    callbacks: [[marketplace.address, { value: toNano(0.1), payload: "" }]]
  }).send({
    from: userAccount.address,
    amount: toNano(1)
  });
}