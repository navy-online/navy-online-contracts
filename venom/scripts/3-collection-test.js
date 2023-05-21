const { Address, ProviderRpcClient } = require('everscale-inpage-provider');
const { EverscaleStandaloneClient } = require('everscale-standalone-client/nodejs');
const { SimpleKeystore } = require("everscale-standalone-client/client/keystore");
const { Collection } = require("../artifacts/Collection.js");

const keyStore = new SimpleKeystore();
const provider = new ProviderRpcClient({
    fallback: () =>
        EverscaleStandaloneClient.create({
            connection: {
                id: 1,
                type: 'graphql',
                data: {
                    endpoints: ['127.0.0.1'],
                },
            },
            keystore: keyStore
        }),
});

const collectionAddress = '0:9fe9e2215253e15aa48e69b70a91caa3789b3345338bb6fca12e7685911a68a6';

async function main() {
    try {
        const keyPair = await TonClient.default.crypto.mnemonic_derive_sign_keys({
            phrase: 'flame viable ball first eager plate smooth absent news laugh mind drive'
        });

        console.log(keyPair);

        // {
        //     secretKey: '172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3',
        //     publicKey: '2ada2e65ab8eeab09490e3521415f45b6e42df9c760a639bcf53957550b25a16'
        //   }

        // await locklift.keystore.addKeyPair('MyRealWallet', {
        //     publicKey: 'd977b0faa06ebca0612251fd865bb9aea9bc22a454ca53ac52b3d67861287aa4',
        //     secretKet: 'c7fbea967d779e0270610c7cdf2fa1015e790db1a1da5870b57ccd8cd7f9a2ac'
        // });

        // keyStore.addKeyPair(keyPair);

        // signerKeys(keys)

        // const helloAcc = new Account('0:e34f636fe6b7afb014ef676068814e1969e01811eeb0962dd809b01e5ee4da0a', {
        //     signer: signerKeys(keys),
        //     client,
        // });

        // keyStore.addKeyPair(getGiverKeypair());


        // const { address: expectedAddress, stateInit } = await provider.getStateInit(Collection.abi, {
        //     tvc: Collection.tvc,
        //     workchain: 0,
        //     publicKey: keyPair.publicKey,
        //     initParams: {
        //         random_number: Math.floor(Math.random() * 10000)
        //     }
        // });

        // await getTokensFromGiver(provider, expectedAddress, 10_000_000_000);

        // const contract = new provider.Contract(Collection.abi, collectionAddress);

        // await extractError(contract.methods.constructor({ _initial_value: 1 }).sendExternal({
        //     stateInit: stateInit,
        //     publicKey: keyPair.publicKey,
        // }))

        // let x = await contract.methods.collectionSize({}).call({});
        // console.log(x);


        // console.log('Set variable to 42');
        // await extractError(contract.methods.set({ _value: 42 }).sendExternal({
        //     publicKey: keyPair.publicKey,
        // }))

        // let { value0: newVariableValue } = await contract.methods.get({}).call({});

        // if (newVariableValue !== '42') {
        //     throw new Error('Variable is not 42')
        // } else {
        //     console.log('Success, variable value is', newVariableValue);
        // }

        console.log("Test successful");
    } catch (e) {
        console.error(e);
    }
}

async function extractError(transactionPromise) {
    return transactionPromise.then(res => {
        if (res.transaction.aborted) {
            throw new Error(`Transaction aborted with code ${transaction.exitCode}`)
        }
        return res;
    });
}

(async () => {
    try {
        console.log("Hello VENOM!");
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
    }
})();