const { TonClient, } = require("@eversdk/core");
const { libNode } = require("@eversdk/lib-node");
TonClient.useBinaryLibrary(libNode);

const { ProviderRpcClient } = require('everscale-inpage-provider');
const { EverscaleStandaloneClient, SimpleAccountsStorage, EverWalletAccount } = require('everscale-standalone-client/nodejs');
const { SimpleKeystore } = require("everscale-standalone-client/client/keystore");
const { NftContract } = require("../../artifacts/NftContract.js");
const { MarketplaceContract } = require("../../artifacts/MarketplaceContract.js");

const nftContractAddress = '0:dcfa44f5457ba371c33e026fedb310324855861e68fe363df9e619a76cd32aee';
const collectionContractAddress = '0:dbcdf5d43044c8039fc34fcf8e695f10774ef942b10f93bd9c78513761c518de';
const marketplaceContractAddress = '0:94fedec5c692c3a6524b9192c68d1651251cb0428e5e3c2ce526f318a75c5231';

const eventNFTListed = 'NFTListed';
const eventNFTDelisted = 'NFTDelisted';
const eventNFTSold = 'NFTSold';

const accountStorage = new SimpleAccountsStorage();
const keyStore = new SimpleKeystore();

const provider = new ProviderRpcClient({
    fallback: () =>
        EverscaleStandaloneClient.create({
            connection: {
                id: 1,
                type: 'graphql',
                data: {
                    endpoints: ['localhost'],
                },
            },
            keystore: keyStore,
            accountsStorage: accountStorage
        }),
});


async function main() {

    // --------------------------------
    // Accounts init
    // --------------------------------

    const user1Keys = await TonClient.default.crypto.mnemonic_derive_sign_keys({
        phrase: 'steel throw innocent borrow speed airport suspect essay edit time prepare boss'
    });
    const user1Address = '0:d3d74c409a8961c335d2111e1f64c7daa0dd40835aab5e0b500de91b4be8083e';

    const user2Keys = await TonClient.default.crypto.mnemonic_derive_sign_keys({
        phrase: 'fetch crime pet night attract small sketch train crawl render picnic rescue'
    });
    const user2Address = '0:ae7325c291e857b425e92b5d4af7d415d9d89e6318ef9299ddb3560f6a21b8be';

    const contractOwnerKeys = await TonClient.default.crypto.mnemonic_derive_sign_keys({
        phrase: 'flame viable ball first eager plate smooth absent news laugh mind drive'
    });
    const ownerAddress = '0:e34f636fe6b7afb014ef676068814e1969e01811eeb0962dd809b01e5ee4da0a';

    const ownerAccount = await EverWalletAccount.fromPubkey({ publicKey: contractOwnerKeys.public, workchain: 0 });
    const user1Account = await EverWalletAccount.fromPubkey({ publicKey: user1Keys.public, workchain: 0 });
    const user2Account = await EverWalletAccount.fromPubkey({ publicKey: user2Keys.public, workchain: 0 });

    accountStorage.addAccount(ownerAccount);
    accountStorage.addAccount(user1Account);
    accountStorage.addAccount(user2Account);

    keyStore.addKeyPair('owner', {
        publicKey: contractOwnerKeys.public,
        secretKey: contractOwnerKeys.secret
    });
    keyStore.addKeyPair('user1', {
        publicKey: user1Keys.public,
        secretKey: user1Keys.secret
    });
    keyStore.addKeyPair('user2', {
        publicKey: user2Keys.public,
        secretKey: user2Keys.secret
    });

    // --------------------------------
    // Marketplace contract init
    // --------------------------------

    const marketplaceContract = new provider.Contract(MarketplaceContract.abi, collectionContractAddress);

    const subscriber = new provider.Subscriber();
    const contractEvents = marketplaceContract.events(subscriber);

    contractEvents.on(async (contractEvent) => {
        console.log('contractEvent:');
        console.log(contractEvent);
    });

    // Subscribe pause
    await new Promise(resolve => setTimeout(resolve, 1000));

    // --------------------------------
    // Marketplace tests
    // --------------------------------

    // TODO refactor, get user nft's autimatically
    const nftContract = new provider.Contract(NftContract.abi, nftContractAddress);


    await extractError(marketplaceContract.methods.listNft({ nftAddress: nftContractAddress, price: 1000000000 })
        .send({
            from: user1Address,
            amount: "2000000000"
        })
    );


    async function readMarketplaceDetails() {
        const collectionSizeResult = await marketplaceContract.methods.collectionSize({}).call({});

        console.log('\n\nCollection info\n\n');
        console.log(collectionSizeResult);
    }
}

async function extractError(transactionPromise) {
    return transactionPromise.then(res => {
        console.log(res);
        if (res.transaction && res.transaction.aborted) {
            throw new Error(`Transaction aborted ${res.transaction.exitCode ? `with code ${transaction.exitCode}` : ``}`)
        }
        if (res.aborted) {
            throw new Error(`Transaction aborted ${res.exitCode ? `with code ${res.exitCode}` : ``}`)
        }
        return res;
    });
}

(async () => {
    await main();
})();