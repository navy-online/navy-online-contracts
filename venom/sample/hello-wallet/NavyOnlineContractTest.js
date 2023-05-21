// const { Account } = require("@eversdk/appkit");
// const { TonClient, MessageBodyType, abiContract, signerKeys, signerNone, signerExternal } = require("@eversdk/core");
// const { ResponseType } = require("@eversdk/core/dist/bin");
// const { libNode } = require("@eversdk/lib-node");

// // const { TonClient, abiContract, signerKeys, signerNone } = require('@eversdk/core');

// // Link the platform-dependable ever-sdk binary with the target Application in Typescript
// // This is a Node.js project, so we link the application with `libNode` binary
// // from `@eversdk/lib-node` package
// // If you want to use this code on other platforms, such as Web or React-Native,
// // use  `@eversdk/lib-web` and `@eversdk/lib-react-native` packages accordingly
// // (see README in  https://github.com/tonlabs/ever-sdk-js )
// TonClient.useBinaryLibrary(libNode);

// const { Collection } = require("./Collection.js");

// const collectionAddress = '0:dabb62625cdb56646b127cfab4f7e7e64a6837f50475184c3a387b4592ea3642';
// // const collectionAddress = '0:a596f6a85c315f1dc79add94ba369e3159d583c8c46083f1cc02f6d0605da9ab';

// async function main(client) {
//     const accountState = await getAccount(client, '0:e34f636fe6b7afb014ef676068814e1969e01811eeb0962dd809b01e5ee4da0a');
//     console.log("Hello wallet balance is", accountState.balance);


//     const keys = await TonClient.default.crypto.mnemonic_derive_sign_keys({
//         phrase: 'flame viable ball first eager plate smooth absent news laugh mind drive'
//     });

//     // signerKeys(keys)

//     // const helloAcc = new Account('0:e34f636fe6b7afb014ef676068814e1969e01811eeb0962dd809b01e5ee4da0a', {
//     //     signer: signerKeys(keys),
//     //     client,
//     // });

//     const collectionAccount = new Account(Collection, {
//         client,
//         address: '0:dabb62625cdb56646b127cfab4f7e7e64a6837f50475184c3a387b4592ea3642'
//     });

//     const x = await collectionAccount.runLocal("collectionSize", {});
//     // console.log(x);

//     const x1 = await collectionAccount.run("changeMintState", { _mintState: 2 }, { signer: signerKeys(keys) });

//     console.log(x1);

//     // await getCollectionMintState(client, 'mintState', collectionAddress, accountState.boc);

//     // const collectionInstance = await locklift.factory.getDeployedContract("Collection", collectionAddress);

//     // console.log((await collectionInstance.methods.totalSupply({ answerId: 0 }).call()).count);
//     // console.log((await collectionInstance.methods.collectionSize().call()).collectionSize);
//     // console.log((await collectionInstance.methods.mintState().call()).mintState);



//     // const {nft: nftAddress} = await collection.methods.nftAddress({ answerId: 0, id: 0 }).call();
//     // nft = await locklift.factory.getDeployedContract("NFT", nftAddress)

    // await client.net.subscribe_collection({
    //     collection: "messages",
    //     filter: {
    //         dst: { eq: address },
    //         OR: {
    //             dst: { eq: address },
    //         },
    //     },
    //     result: "boc msg_type id src dst"
    // }, async (params) => {
    // });
        
//     //     try {
//     //         if (params.result && params.result.msg_type == 2) {
//     //             const decoded = (await TonClient.default.abi.decode_message({
//     //                 abi: abiContract(HelloWallet.abi),
//     //                 message: params.result.boc
//     //             }));

//     //             if (decoded.body_type == 'Event' && decoded.name == 'NftMinted') {
//     //                 console.log('Nft minted');
//     //                 console.log(params.result);
//     //             }
//     //         }


//     //         // if (responseType === ResponseType.Custom) {
//     //         // const { msg_type, id, src, dst, boc } = params.result;
//     //         // console.log(params);


//     //         // const decoded = (await TonClient.default.abi.decode_message({
//     //         //     abi: abiContract(HelloWallet.abi),
//     //         //     message: boc
//     //         // }));
//     //         // switch (decoded.body_type) {
//     //         //     case MessageBodyType.Input:
//     //         //         console.log(`External inbound message, function "${decoded.name}", fields: ${JSON.stringify(decoded.value)}`);
//     //         //         break;
//     //         //     case MessageBodyType.Output:
//     //         //         console.log(`External outbound message (return) of function "${decoded.name}", fields: ${JSON.stringify(decoded.value)}`);
//     //         //         break;
//     //         //     case MessageBodyType.Event:
//     //         //         console.log(`External outbound message (event) "${decoded.name}", fields: ${JSON.stringify(decoded.value)}`);
//     //         //         break;
//     //         // }
//     //         // }
//     //     } catch (ex) {
//     //         console.log(ex);
//     //         console.log(params);
//     //     }
//     // });
// }

// async function getCollectionMintState(client, methodName, address, account) {
//     // const account1 = (await client.net.wait_for_collection({
//     //     collection: "accounts",
//     //     filter: { id: { eq: '0:e34f636fe6b7afb014ef676068814e1969e01811eeb0962dd809b01e5ee4da0a' } },
//     //     result: "boc"
//     // })).result.boc;

//     // // console.log(account1);

//     // const abi = abiContract(Collection.abi);

//     // const x = await client.tvm.run_tvm({
//     //     abi,
//     //     account: account1,
//     //     message: (await client.abi.encode_message({
//     //         address,
//     //         signer: signerExternal('d977b0faa06ebca0612251fd865bb9aea9bc22a454ca53ac52b3d67861287aa4'),
//     //         abi,
//     //         call_set: {
//     //             function_name: methodName,
//     //             input: {},
//     //         }
//     //     })).message
//     // });



//     // console.log('Пиздец тон говно');

//     const keys = await TonClient.default.crypto.mnemonic_derive_sign_keys({
//         phrase: 'flame viable ball first eager plate smooth absent news laugh mind drive'
//     });

//     const helloAcc = new Account('0:e34f636fe6b7afb014ef676068814e1969e01811eeb0962dd809b01e5ee4da0a', {
//         signer: signerKeys(keys),
//         client,
//     });

//     // Encode the message with `getTimestamp` call
//     const { message } = await client.abi.encode_message({
//         abi: {
//             type: 'Contract',
//             value: Collection.abi,
//         },
//         address,
//         call_set: {
//             function_name: 'mintPrice',
//             input: {},
//         },
//         // signer: signerNone()
//         // signer: { type: 'None' }
//         signer: {
//             type: 'Keys',
//             keys: signerKeys(keys)
//         }
//     });

//     const response = await client.tvm.run_tvm({
//         message,
//         account,
//         abi: {
//             type: 'Contract',
//             value: Collection.abi,
//         }
//         // signer: {
//         //     type: 'Keys',
//         //     keys: signerKeys(keys)
//         // },
//     });
//     // console.log(response.decoded.output);


//     // const account = (await client.net.wait_for_collection({
//     //     collection: "accounts",
//     //     filter: { id: { eq: address } },
//     //     result: "boc"
//     // })).result.boc;
//     // const abi = abiContract(Collection.abi);
//     // const { decoded } = await client.tvm.run_tvm({
//     //     abi,
//     //     account,
//     //     message: (await client.abi.encode_message({
//     //         address: address,
//     //         signer: signerNone(),
//     //         abi,
//     //         call_set: {
//     //             function_name: "mintState",
//     //             input: {},
//     //         }
//     //     })).message
//     // });
//     // console.log(decoded);
//     // const x = Buffer.from(decoded.output.text, "hex").toString();
//     // return x;
// }

// async function getAccount(client, address) {
//     // `boc` or bag of cells - native blockchain data layout. Account's boc contains full account state (code and data) that
//     // we will  need to execute get methods.
//     const query = `
//         query {
//           blockchain {
//             account(
//               address: "${address}"
//             ) {
//                info {
//                 balance(format: DEC)
//                 boc
//               }
//             }
//           }
//         }`
//     const { result } = await client.net.query({ query })
//     const info = result.data.blockchain.account.info
//     return info
// }

// (async () => {
//     const client = new TonClient({
//         network: {
//             endpoints: ["https://gql-devnet.venom.network/graphql"]
//         }
//     });
//     try {
//         console.log("Hello Venom devnet!");
//         await main(client);
//         process.exit(0);
//     } catch (error) {
//         if (error.code === 504) {
//             console.error(`Network is inaccessible. You have to start Evernode SE using \`everdev se start\`.\n If you run SE on another port or ip, replace http://localhost endpoint with http://localhost:port or http://ip:port in index.js file.`);
//         } else {
//             console.error(error);
//         }
//     }
//     client.close();
// })();