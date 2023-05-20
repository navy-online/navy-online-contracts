const Locklift = require("locklift");

async function main() {

    // 1 - contrcat owner and backend account
    const contractOwnerSigner = await locklift.keystore.getSigner("0");

    // 2 - user 1
    const keys1 = {
        publicKey: 'add_me',
        secretKey: 'add_me'
    };
    await locklift.keystore.addKeyPair('user1', {
        publicKey: keys1.publicKey,
        secretKey: keys1.secretKey
    });
    const user1Signer = await locklift.keystore.getSigner('user1');

    // 3 - user 2
    const keys2 = {
        publicKey: 'add_me',
        secretKey: 'add_me'
    };
    await locklift.keystore.addKeyPair('user2', {
        publicKey: keys2.publicKey,
        secretKey: keys2.secretKey
    });
    const user2Signer = await locklift.keystore.getSigner('user2');

    // 4 - Give some founds to each account
    const ownerAccount = (await locklift.factory.accounts.addNewAccount({
        type: Locklift.WalletTypes.EverWallet,
        value: Locklift.toNano(10000),
        publicKey: contractOwnerSigner.publicKey
    })).account;

    const user1Account = (await locklift.factory.accounts.addNewAccount({
        type: Locklift.WalletTypes.EverWallet,
        value: Locklift.toNano(10000),
        publicKey: user1Signer.publicKey
    })).account;

    const user2Account = (await locklift.factory.accounts.addNewAccount({
        type: Locklift.WalletTypes.EverWallet,
        value: Locklift.toNano(10000),
        publicKey: user2Signer.publicKey
    })).account;

    console.log('ownerAccount address: ' + ownerAccount.address + ', balance: ' + await locklift.provider.getBalance(ownerAccount.address));
    console.log('user1Account address: ' + user1Account.address + ', balance: ' + await locklift.provider.getBalance(user1Account.address));
    console.log('user2Account address: ' + user2Account.address + ', balance: ' + await locklift.provider.getBalance(user2Account.address));

    // 5 - deploy contract
    const { contract: collectionContract, tx } = await locklift.factory.deployContract({
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

    console.log(`Collection deployed at: ${collectionContract.address.toString()}`);

    const { contract: marketplaceContract, tx1 } = await locklift.factory.deployContract({
        contract: "Marketplace",
        publicKey: contractOwnerSigner.publicKey,
        initParams: {
        },
        constructorParams: {
            ownerAddress: ownerAccount.address,
            _collectionAddress: collectionContract.address
        },
        value: locklift.utils.toNano(5),
    });

    console.log(`Marketplace deployed at: ${marketplaceContract.address.toString()}`);
}

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.log(e);
        process.exit(1);
    });