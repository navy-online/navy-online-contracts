const { TonClient, } = require("@eversdk/core");
const { libNode } = require("@eversdk/lib-node");
TonClient.useBinaryLibrary(libNode);

const { ProviderRpcClient } = require('everscale-inpage-provider');
const { EverscaleStandaloneClient, SimpleAccountsStorage, EverWalletAccount } = require('everscale-standalone-client/nodejs');
const { SimpleKeystore } = require("everscale-standalone-client/client/keystore");
const { CollectionContract } = require("../../artifacts/CollectionContract.js");

const collectionContractAddress = '0:dbcdf5d43044c8039fc34fcf8e695f10774ef942b10f93bd9c78513761c518de';
const mintPriceVenom = '2000000000';
const eventNftMinted = 'NftMinted';
const eventNftGenerated = 'NftGenerated';
let collectionMintState = '0'; // 0 - disabled, 1 - whitelised, 2 - public

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
    // Collection contract init
    // --------------------------------

    const collectionContract = new provider.Contract(CollectionContract.abi, collectionContractAddress);

    const subscriber = new provider.Subscriber();
    const contractEvents = collectionContract.events(subscriber);

    contractEvents.on(async (contractEvent) => {
        if (contractEvent.event == eventNftMinted) {
            const nftId = contractEvent.data.id;
            const ownerAddress = contractEvent.owner;

            console.log('Nft minted! ' + { nftId, ownerAddress });

            await generateNft(nftId, '{dummy json}', ownerAddress);
        } else if (contractEvent.event == eventNftGenerated) {
            const nftId = contractEvent.data.id;
            const ownerAddress = contractEvent.owner;

            console.log('Nft generated! ' + { nftId, ownerAddress });

            await getNftAddressById(nftId);
        }
    });

    // Subscribe pause
    await new Promise(resolve => setTimeout(resolve, 1000));

    // --------------------------------
    // Collection tests
    // --------------------------------

    // Print general collection params
    await updateAndPrintCollectionInfo();

    if (collectionMintState == '0') {
        // Alow mint first
        await changeMintState(2);

        // Print general collection params one more time,
        // To make sure that minting state is actually changed
        await updateAndPrintCollectionInfo();
    }

    // await generateNft(1, '{dummy json}', user1Address);

    // await getNftAddressById(0);

    // Mint very first item and catch for an event 
    // await collectionMintByUser(user1Address);

    // TODO show ALL user nfts here


    async function updateAndPrintCollectionInfo() {
        const collectionSizeResult = await collectionContract.methods.collectionSize({}).call({});
        const totalSupplyResult = await collectionContract.methods.totalSupply({ answerId: 0 }).call({});
        const mintPriceResult = await collectionContract.methods.mintPrice({}).call({});
        const mintStateResult = await collectionContract.methods.mintState({}).call({});

        collectionMintState = mintStateResult.mintState;

        console.log('\n\nCollection info\n\n');
        console.log(collectionSizeResult);
        console.log(totalSupplyResult);
        console.log(mintPriceResult);
        console.log(mintStateResult);
    }

    async function changeMintState(_mintState) {
        await extractError(collectionContract.methods.changeMintState({ _mintState })
            .send({
                from: ownerAccount.address,
                amount: "2000000000"
            })
        );
    }

    async function collectionMintByUser(userAddress) {
        await extractError(collectionContract.methods.mintNft()
            .send({
                from: userAddress,
                amount: mintPriceVenom
            })
        );
    }

    async function generateNft(id, json, minter) {
        await extractError(collectionContract.methods.generateNft({ id, json, minter })
            .send({
                from: ownerAddress,
                amount: mintPriceVenom
            })
        );
    }

    async function getNftAddressById(id) {
        const nftAddressResult = await collectionContract.methods.nftAddress({ answerId: 0, id }).call({});
        console.log('nftAddressResult: ');
        console.log(nftAddressResult);
    }

}

async function extractError(transactionPromise) {
    return transactionPromise.then(res => {
        // console.log(res);
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