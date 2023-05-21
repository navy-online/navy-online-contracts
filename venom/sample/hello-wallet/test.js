const { Account } = require("@eversdk/appkit");
const { TonClient, MessageBodyType, abiContract, signerKeys, signerNone, signerExternal } = require("@eversdk/core");
const { ResponseType } = require("@eversdk/core/dist/bin");
const { libNode } = require("@eversdk/lib-node");

// // const { TonClient, abiContract, signerKeys, signerNone } = require('@eversdk/core');

// // Link the platform-dependable ever-sdk binary with the target Application in Typescript
// // This is a Node.js project, so we link the application with `libNode` binary
// // from `@eversdk/lib-node` package
// // If you want to use this code on other platforms, such as Web or React-Native,
// // use  `@eversdk/lib-web` and `@eversdk/lib-react-native` packages accordingly
// // (see README in  https://github.com/tonlabs/ever-sdk-js )
TonClient.useBinaryLibrary(libNode);

const { Collection } = require("../../artifacts/Collection.js");

async function main(client) {

    const contractOwnerKeys = await TonClient.default.crypto.mnemonic_derive_sign_keys({
        phrase: 'flame viable ball first eager plate smooth absent news laugh mind drive'
    });
    const user1Keys = await TonClient.default.crypto.mnemonic_derive_sign_keys({
        phrase: 'steel throw innocent borrow speed airport suspect essay edit time prepare boss'
    });
    const user2Keys = await TonClient.default.crypto.mnemonic_derive_sign_keys({
        phrase: 'fetch crime pet night attract small sketch train crawl render picnic rescue'
    });
    // console.log(keys);


    // const keys = await TonClient.default.crypto.nacl_box_keypair_from_secret_key({
    //     secret: '172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3'
    // });
    // const giverAccount = new Account('0:ece57bcc6c530283becbbd8a3b24d3c5987cdddc3c8b7b33be6e4a6312490415', {
    //     signer: signerKeys(keys),
    //     client,
    // });


    const initialData = {
        _mintPrice: 4_000_000_000,
        _collectionSize: 200,
        codeNft: NFT_CODE,
        json: `{"collection":"Navy online game captains collection of 200 NFTs"}`,
        codeIndex: INDEX_CODE,
        codeIndexBasis: INDEX_BASIS_CODE
    };

    const collectionInstance = new Account(Collection, {
        signer: signerKeys(contractOwnerKeys),
        client,
        initData: initialData,
    });

    const collectionInstanceAddress = await collectionInstance.getAddress();

    console.log('Collection address: ' + collectionInstanceAddress);

    async function getFromCollectionContract(functionName, input) {
        try {
            const result = await collectionInstance.runLocal(functionName, input);
            return {
                success: true,
                decodedMessageOutput: result.decoded.output
            }
        } catch (error) {
            console.error(error);
        }
        return {
            success: false
        }
    }

    const collectionSize = await getFromCollectionContract("collectionSize", {});
    if (collectionSize.success) {
        console.log("collectionSize: " + collectionSize.decodedMessageOutput.collectionSize);
    }

    const totalSupply = await getFromCollectionContract("totalSupply", { answerId: 0 });
    if (totalSupply.success) {
        console.log("totalSupply: " + totalSupply.decodedMessageOutput.count);
    }

    const mintState = await getFromCollectionContract("mintState", {});
    if (mintState.success) {
        console.log("mintState: " + mintState.decodedMessageOutput.mintState);
    }

    // await collectionInstance.run("changeMintState", {
    //     _mintState: 2
    // }, {
    //     signer: signerKeys(contractOwnerKeys)
    // });

    // TODO try to mint first token and catch its event



    await client.net.subscribe_collection({
        collection: "messages",
        filter: {
            src: { eq: collectionInstanceAddress },
            // dst: { eq: address },
            OR: {
                dst: { eq: collectionInstanceAddress },
            },
            // msg_type: { eq: 2 }
            // msg_type: { in: [0, 1, 2] }
        },
        result: "boc msg_type id src dst"
    }, async (params, x) => {
        console.log(params);
        console.log(x);
    });

    // Mint NFT
    await collectionInstance.run("mintNft", {
        json: "dummy json"
    }, {
        signer: signerKeys(user1Keys),
        value: 1_000_000_000
    });

    //     try {
    //         if (params.result && params.result.msg_type == 2) {
    //             const decoded = (await TonClient.default.abi.decode_message({
    //                 abi: abiContract(HelloWallet.abi),
    //                 message: params.result.boc
    //             }));

    //             if (decoded.body_type == 'Event' && decoded.name == 'NftMinted') {
    //                 console.log('Nft minted');
    //                 console.log(params.result);
    //             }
    //         }


    //         // if (responseType === ResponseType.Custom) {
    //         // const { msg_type, id, src, dst, boc } = params.result;
    //         // console.log(params);


    //         // const decoded = (await TonClient.default.abi.decode_message({
    //         //     abi: abiContract(HelloWallet.abi),
    //         //     message: boc
    //         // }));
    //         // switch (decoded.body_type) {
    //         //     case MessageBodyType.Input:
    //         //         console.log(`External inbound message, function "${decoded.name}", fields: ${JSON.stringify(decoded.value)}`);
    //         //         break;
    //         //     case MessageBodyType.Output:
    //         //         console.log(`External outbound message (return) of function "${decoded.name}", fields: ${JSON.stringify(decoded.value)}`);
    //         //         break;
    //         //     case MessageBodyType.Event:
    //         //         console.log(`External outbound message (event) "${decoded.name}", fields: ${JSON.stringify(decoded.value)}`);
    //         //         break;
    //         // }
    //         // }















    // await collectionInstance.deploy({
    //     // useGiver: true,
    //     initInput: initialData
    // })
    // console.log(`Simple storage deployed at : ${simpleStorageInstanceAddress}`);

    // await collectionInstance.deploy({
    //     useGiver: true,
    //     initInput: {
    //       _initial_value: '0x1'
    //     }});



    // let simpleStorageInstance= new Account(SimpleStorageContract, {
    //     signer: signerKeys(keys),
    //     client,
    //     initData: {
    //       random_number: Math.floor(Math.random() * 100)
    //     },
    //   });


    // console.log(await collectionInstance.getAddress());

    // // 1 - get collection minting state
    // let collectionSize = await collectionInstance.runLocal("collectionSize", {});
    // console.log('collectionSize: ' + collectionSize);

    // const xxx = await getAccount(client, '0:ece57bcc6c530283becbbd8a3b24d3c5987cdddc3c8b7b33be6e4a6312490415');

    // console.log(helloAcc);
    // console.log(xxx);
}

async function getAccount(client, address) {
    const query = `
        query {
          blockchain {
            account(
              address: "${address}"
            ) {
               info {
                balance(format: DEC)
                boc
              }
            }
          }
        }`
    const { result } = await client.net.query({ query })
    const info = result.data.blockchain.account.info
    return info
}

(async () => {
    const client = new TonClient({
        network: {
            endpoints: ["http://localhost"]
        }
    });
    try {
        console.log("Hello Venom local network!");
        await main(client);
        process.exit(0);
    } catch (error) {
        if (error.code === 504) {
            console.error(`Network is inaccessible. You have to start Evernode SE using \`everdev se start\`.\n If you run SE on another port or ip, replace http://localhost endpoint with http://localhost:port or http://ip:port in index.js file.`);
        } else {
            console.error(error);
        }
    }
    client.close();
})();



const NFT_CODE = "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";
const INDEX_CODE = "te6ccgECIAEAA4IAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAgaK2zUfBAQkiu1TIOMDIMD/4wIgwP7jAvILHAYFHgOK7UTQ10nDAfhmifhpIds80wABn4ECANcYIPkBWPhC+RDyqN7TPwH4QyG58rQg+COBA+iogggbd0CgufK0+GPTHwHbPPI8EQ4HA3rtRNDXScMB+GYi0NMD+kAw+GmpOAD4RH9vcYIImJaAb3Jtb3Nwb3T4ZNwhxwDjAiHXDR/yvCHjAwHbPPI8GxsHAzogggujrde64wIgghAWX5bBuuMCIIIQR1ZU3LrjAhYSCARCMPhCbuMA+EbycyGT1NHQ3vpA0fhBiMjPjits1szOyds8Dh8LCQJqiCFus/LoZiBu8n/Q1PpA+kAwbBL4SfhKxwXy4GT4ACH4a/hs+kJvE9cL/5Mg+GvfMNs88gAKFwA8U2FsdCBkb2Vzbid0IGNvbnRhaW4gYW55IHZhbHVlAhjQIIs4rbNYxwWKiuIMDQEK103Q2zwNAELXTNCLL0pA1yb0BDHTCTGLL0oY1yYg10rCAZLXTZIwbeICFu1E0NdJwgGOgOMNDxoCSnDtRND0BXEhgED0Do6A34kg+Gz4a/hqgED0DvK91wv/+GJw+GMQEQECiREAQ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAD/jD4RvLgTPhCbuMA0x/4RFhvdfhk0ds8I44mJdDTAfpAMDHIz4cgznHPC2FeIMjPkll+WwbOWcjOAcjOzc3NyXCOOvhEIG8TIW8S+ElVAm8RyM+EgMoAz4RAzgH6AvQAcc8LaV4gyPhEbxXPCx/OWcjOAcjOzc3NyfhEbxTi+wAaFRMBCOMA8gAUACjtRNDT/9M/MfhDWMjL/8s/zsntVAAi+ERwb3KAQG90+GT4S/hM+EoDNjD4RvLgTPhCbuMAIZPU0dDe+kDR2zww2zzyABoYFwA6+Ez4S/hK+EP4QsjL/8s/z4POWcjOAcjOzc3J7VQBMoj4SfhKxwXy6GXIz4UIzoBvz0DJgQCg+wAZACZNZXRob2QgZm9yIE5GVCBvbmx5AELtRNDT/9M/0wAx+kDU0dD6QNTR0PpA0fhs+Gv4avhj+GIACvhG8uBMAgr0pCD0oR4dABRzb2wgMC41OC4yAAAADCD4Ye0e2Q==";
const INDEX_BASIS_CODE = "te6ccgECFwEAApEAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgBCSK7VMg4wMgwP/jAiDA/uMC8gsUBQQWA4rtRNDXScMB+GaJ+Gkh2zzTAAGfgQIA1xgg+QFY+EL5EPKo3tM/AfhDIbnytCD4I4ED6KiCCBt3QKC58rT4Y9MfAds88jwNCgYDeu1E0NdJwwH4ZiLQ0wP6QDD4aak4APhEf29xggiYloBvcm1vc3BvdPhk3CHHAOMCIdcNH/K8IeMDAds88jwTEwYDOiCCC6Ot17rjAiCCEGi1Xz+64wIgghBswcwMuuMCDgkHA+Iw+Eby4Ez4Qm7jANMf+ERYb3X4ZNHbPCGOHSPQ0wH6QDAxyM+HIM5xzwthAcjPk7MHMDLOzclwjjH4RCBvEyFvEvhJVQJvEcjPhIDKAM+EQM4B+gL0AHHPC2kByPhEbxXPCx/Ozcn4RG8U4vsA4wDyABIIDwAa+ERwb3KAQG90+GT4SgM2MPhCbuMA+Ebyc9GI+En4SscF8uhl+ADbPPIAChEPAhbtRNDXScIBjoDjDQsSAT5w7UTQ9AVxIYBA9A6OgN/4aoBA9A7yvdcL//hicPhjDAECiQ0AQ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABADNjD4RvLgTPhCbuMAIZPU0dDe+kDR2zww2zzyABIQDwAi+Er4Q/hCyMv/yz/Pg87J7VQBNoj4SfhKxwXy6GX4AMjPhQjOgG/PQMmBAKD7ABEANE1ldGhvZCBmb3IgY29sbGVjdGlvbiBvbmx5ACbtRNDT/9M/0wAx+kDR+Gr4Y/hiAAr4RvLgTAIK9KQg9KEWFQAUc29sIDAuNTguMgAA";