const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Deploy captains and mint", function () {
    const tokensTotal = 200;
    const mintPrice = ethers.utils.parseEther("1");
    const twoEth = ethers.utils.parseEther("2");

    async function deployCaptainsContractsFixture() {
        const marketplace = await ethers.getContractFactory("Marketplace");
        const marketplaceContract = await marketplace.deploy();
        await marketplaceContract.deployed();

        const captain = await ethers.getContractFactory("Captain");
        const captainContract = await captain.deploy();
        await captainContract.deployed();

        const collectionSale = await ethers.getContractFactory("CollectionSale");
        const saleContract = await collectionSale.deploy(tokensTotal, mintPrice, captainContract.address);
        await saleContract.deployed();

        const [ownerAccount, firstAccount, secondAccount] = await ethers.getSigners();

        await captainContract.addNvyBackendAddress(ownerAccount.address);

        console.log('captainContract: ' + captainContract.address);
        console.log('saleContract: ' + saleContract.address);
        console.log('marketplaceContract: ' + marketplaceContract.address);
        console.log('ownerAccount: ' + ownerAccount.address);
        console.log('firstAccount: ' + firstAccount.address);
        console.log('secondAccount: ' + secondAccount.address);

        return {
            captainContract,
            saleContract,
            marketplaceContract,
            ownerAccount,
            firstAccount,
            secondAccount
        }
    }

    describe("Deployment", function () {
        it("Tokens for sale amount should be equal to " + tokensTotal, async function () {
            const { saleContract } = await loadFixture(deployCaptainsContractsFixture);
            const tokensTotal = await saleContract.tokensTotal();
            const tokensLeft = await saleContract.tokensLeft();
            expect(tokensTotal).to.equal(tokensTotal);
            expect(tokensLeft).to.equal(tokensTotal);
        });

        it("Minting state should be disabled by default ", async function () {
            const { saleContract } = await loadFixture(deployCaptainsContractsFixture);
            expect(await saleContract.mintState()).to.equal(0);
        });

        it("Sale contract address should be equal to captain contract address", async function () {
            const { captainContract, saleContract } = await loadFixture(deployCaptainsContractsFixture);
            expect(await saleContract.contractAddress()).to.equal(captainContract.address);
        });
    });

    describe("Minting", function () {
        it("Minting price should be euqal to " + mintPrice, async function () {
            const { saleContract } = await loadFixture(deployCaptainsContractsFixture);
            expect(await saleContract.mintPrice()).to.equal(mintPrice);
        });

        it("Minting should fail if wrong amount of eth is passed", async function () {
            const { saleContract } = await loadFixture(deployCaptainsContractsFixture);
            await expect(saleContract.mint({ value: twoEth })).to.be.revertedWith('Wrong mint price');
        });

        it("Minting should fail because it is disabled by default", async function () {
            const { saleContract } = await loadFixture(deployCaptainsContractsFixture);
            await expect(saleContract.mint({ value: mintPrice })).to.be.revertedWith('Mint is disabled for now');
        });

        it("Sale state should be changed to public", async function () {
            const { saleContract } = await loadFixture(deployCaptainsContractsFixture);
            await saleContract.changeMintState(2);
            expect(await saleContract.mintState()).to.equal(2);
        });

        it("Should mint a new token, generate an event after successful minting and amount of tokens should be minus one", async function () {
            const { firstAccount, saleContract, captainContract } = await loadFixture(deployCaptainsContractsFixture);

            await saleContract.changeMintState(2);

            await expect(saleContract.connect(firstAccount).mint({ value: mintPrice }))
                .to.emit(saleContract, "GenerateToken")
                .withArgs(firstAccount.address, captainContract.address);
            expect(await saleContract.tokensLeft()).to.equal(tokensTotal - 1);

            await expect(captainContract.grantCaptain(firstAccount.address, 1000, 100, "https://some.url"))
                .to.emit(captainContract, "GrantEntity")
                .withArgs(firstAccount.address, 1);
        });
    });

    describe("Marketplace", function () {
        it("Owner should list a token and buyer buy it", async function () {
            const { firstAccount, secondAccount, marketplaceContract, captainContract } = await loadFixture(deployCaptainsContractsFixture);

            const tokenURI = "https://some.url";

            // Grant a captain
            await expect(captainContract.grantCaptain(firstAccount.address, 1000, 100, tokenURI))
                .to.emit(captainContract, "GrantEntity")
                .withArgs(firstAccount.address, 1);

            // Allow the marketplace to transfer the token
            await captainContract.connect(firstAccount).setApprovalForAll(marketplaceContract.address, true);

            // Token listing
            await expect(marketplaceContract.connect(firstAccount).listNft(captainContract.address, 1, mintPrice))
                .to.emit(marketplaceContract, "NFTListed")
                .withArgs(
                    captainContract.address,
                    1,
                    tokenURI,
                    firstAccount.address,
                    marketplaceContract.address,
                    mintPrice
                );

            // Tokens listed in total    
            const listedNfts = await marketplaceContract.getListedNfts();
            console.log(listedNfts);
            expect(listedNfts.length).to.be.equal(1);

            // Buy nft
            await expect(marketplaceContract.connect(secondAccount).buyNft(captainContract.address, 1, { value: mintPrice }))
                .to.emit(marketplaceContract, "NFTSold")
                .withArgs(
                    captainContract.address,
                    1,
                    firstAccount.address,
                    secondAccount.address,
                    mintPrice
                );

            // console.log((await marketplaceContract.getListedNfts())[0][1]);
        });
    });

});
