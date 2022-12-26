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
        const captain = await ethers.getContractFactory("Captain");
        const captainContract = await captain.deploy();
        await captainContract.deployed();

        const collectionSale = await ethers.getContractFactory("CollectionSale");
        const saleContract = await collectionSale.deploy(tokensTotal, mintPrice, captainContract.address);
        await saleContract.deployed();

        const [owner, otherAccount] = await ethers.getSigners();

        return {
            captainContract,
            saleContract,
            owner,
            otherAccount
        }
    }

    async function deployOneYearLockFixture() {
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
        const ONE_GWEI = 1_000_000_000;

        const lockedAmount = ONE_GWEI;
        const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const Lock = await ethers.getContractFactory("Lock");
        const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

        return { lock, unlockTime, lockedAmount, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Tokens for sale amount should be equal to " + tokensTotal, async function () {
            const { saleContract } = await loadFixture(deployCaptainsContractsFixture);
            expect(await saleContract.tokensTotal()).to.equal(tokensTotal);
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

        it("Should generate an event after successful minting", async function () {
            const { saleContract, owner, captainContract } = await loadFixture(deployCaptainsContractsFixture);

            await saleContract.changeMintState(2);
            await expect(saleContract.mint({ value: mintPrice }))
                .to.emit(saleContract, "GenerateToken")
                .withArgs(owner.address, captainContract.address);
        });
    });

});
