const Locklift = require("locklift");

async function main() {

    // 1 - contrcat owner and backend account
    const contractOwnerSigner = await locklift.keystore.getSigner("0");

    // 2 - user 1
    const keys1 = {
        publicKey: '29a4fc88f6c7cb3eef906cded87b111e777aac80d42db977a7dbcc9e7f2f8f59',
        secretKey: '44f99156d0bb198f326ab92e185f6b9bc774aa4d4237f76ece6a417a00efc05b'
    };
    await locklift.keystore.addKeyPair('user1', {
        publicKey: keys1.publicKey,
        secretKey: keys1.secretKey
    });
    const user1Signer = await locklift.keystore.getSigner('user1');

    // 3 - user 2
    const keys2 = {
        publicKey: '90fb122667100871be388d77250b305571e27b6d3c3896a1d0e02ff70554398c',
        secretKey: '188fdf327227e3a90db81b7485c82dab264dd4ffbe569257a3a407342d929179'
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
    const { contract: sample, tx } = await locklift.factory.deployContract({
        contract: "Marketplace",
        publicKey: contractOwnerSigner.publicKey,
        initParams: {
        },
        constructorParams: {
        },
        value: locklift.utils.toNano(5),
    });

    console.log(`Marketplace deployed at: ${sample.address.toString()}`);
}

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.log(e);
        process.exit(1);
    });