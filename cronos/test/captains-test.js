const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Deploy captains and mint", function () {
    const initialCollectionSupply = 200;
    const mintPrice = ethers.utils.parseEther("2");
    const halfOfMintPrice = ethers.utils.parseEther("1");

    async function deployCaptainsContractsFixture() {
        const captain = await ethers.getContractFactory("Captain");
        const captainContract = await captain.deploy();
        await captainContract.deployed();

        const collection = await ethers.getContractFactory("Collection");
        const collectionContract = await collection.deploy(mintPrice, initialCollectionSupply);
        await collectionContract.deployed();

        const marketplace = await ethers.getContractFactory("Marketplace");
        const marketplaceContract = await marketplace.deploy(captainContract.address);
        await marketplaceContract.deployed();

        const [ownerAccount, firstAccount, secondAccount] = await ethers.getSigners();

        console.log('captainContract: ' + captainContract.address);
        console.log('collectionContract: ' + collectionContract.address);
        console.log('marketplaceContract: ' + marketplaceContract.address);
        console.log('ownerAccount: ' + ownerAccount.address);
        console.log('firstAccount: ' + firstAccount.address);
        console.log('secondAccount: ' + secondAccount.address);

        return {
            captainContract,
            collectionContract,
            marketplaceContract,
            ownerAccount,
            firstAccount,
            secondAccount
        }
    }

    describe("Deployment", function () {
        it("Tokens for sale amount should be equal to " + initialCollectionSupply, async function () {
            const { collectionContract } = await loadFixture(deployCaptainsContractsFixture);
            const totalSupply = await collectionContract.totalSupply();
            const currentSupply = await collectionContract.currentSupply();
            expect(totalSupply).to.equal(initialCollectionSupply);
            expect(currentSupply).to.equal(0);
        });

        it("Minting state should be disabled by default ", async function () {
            const { collectionContract } = await loadFixture(deployCaptainsContractsFixture);
            expect(await collectionContract.mintState()).to.equal(0);
        });
    });

    describe("Minting", function () {
        it("Minting price should be euqal to " + mintPrice, async function () {
            const { collectionContract } = await loadFixture(deployCaptainsContractsFixture);
            expect(await collectionContract.mintPrice()).to.equal(mintPrice);
        });

        it("Minting should fail if wrong amount of eth is passed", async function () {
            const { collectionContract } = await loadFixture(deployCaptainsContractsFixture);
            await expect(collectionContract.mintNft({ value: halfOfMintPrice })).to.be.revertedWith('Wrong mint price');
        });

        it("Minting should fail because it is disabled by default", async function () {
            const { collectionContract } = await loadFixture(deployCaptainsContractsFixture);
            await expect(collectionContract.mintNft({ value: mintPrice })).to.be.revertedWith('Mint is disabled for now');
        });

        it("Sale state should be changed to public", async function () {
            const { collectionContract } = await loadFixture(deployCaptainsContractsFixture);
            await collectionContract.changeMintState(2);
            expect(await collectionContract.mintState()).to.equal(2);
        });

        it("Should mint a new token, generate an event after successful minting and amount of tokens should be minus one", async function () {
            const { firstAccount, collectionContract, captainContract } = await loadFixture(deployCaptainsContractsFixture);

            await collectionContract.changeMintState(2);

            await expect(collectionContract.connect(firstAccount).mintNft({ value: mintPrice }))
                .to.emit(collectionContract, "NftMinted")
                .withArgs(1, firstAccount.address);
            expect(await collectionContract.currentSupply()).to.equal(1);

            await expect(captainContract.generateNft(1, "https://some.url", firstAccount.address))
                .to.emit(captainContract, "NftGenerated")
                .withArgs(1, firstAccount.address);
        });
    });

    describe("Marketplace", function () {
        it("Owner should list a token and buyer buy it", async function () {
            const { firstAccount, secondAccount, marketplaceContract, captainContract } = await loadFixture(deployCaptainsContractsFixture);

            // Generate a captain
            await expect(captainContract.generateNft(1, "https://some.url", firstAccount.address))
                .to.emit(captainContract, "NftGenerated")
                .withArgs(1, firstAccount.address);

            // Allow the marketplace to transfer the token
            await captainContract.connect(firstAccount).setApprovalForAll(marketplaceContract.address, true);

            // Token listing
            await expect(marketplaceContract.connect(firstAccount).listNft(captainContract.address, 1, mintPrice))
                .to.emit(marketplaceContract, "NftListed")
                .withArgs(
                    1,
                    firstAccount.address,
                    marketplaceContract.address,
                    mintPrice
                );

            // Tokens listed in total    
            const nftsListedBefore = await marketplaceContract.getNftsListed();
            expect(nftsListedBefore.length).to.equal(1);

            // Buy nft
            await expect(marketplaceContract.connect(secondAccount).buyNft(captainContract.address, 1, { value: mintPrice }))
                .to.emit(marketplaceContract, "NftSold")
                .withArgs(
                    1,
                    firstAccount.address,
                    secondAccount.address,
                    mintPrice
                );

            const nftsListedAfter = await marketplaceContract.getNftsListed();
            expect(nftsListedAfter.length).to.be.equal(0);

            const nftsSold = await marketplaceContract.getNftsSold();
            expect(nftsSold.length).to.be.equal(1);
        });
    });

});
