// import { toNano } from "locklift";

const LK = require("locklift");

async function main() {
    const signer = await locklift.keystore.getSigner("1");
    const collectionAddress = '0:a596f6a85c315f1dc79add94ba369e3159d583c8c46083f1cc02f6d0605da9ab';


    // const { contract: sample, tx } = await locklift.factory.deployContract({
    //     contract: "Collection",
    //     publicKey: signer.publicKey,
    //     initParams: {},
    //     constructorParams: {
    //         _mintPrice: locklift.utils.toNano(1),
    //         _collectionSize: 200,
    //         codeNft: (await locklift.factory.getContractArtifacts("Nft")).code,
    //         json: `{"collection":"Venom sample collection of 200 NFTs"}`,
    //         codeIndex: (await locklift.factory.getContractArtifacts("Index")).code,
    //         codeIndexBasis: (await locklift.factory.getContractArtifacts("IndexBasis")).code
    //     },
    //     value: locklift.utils.toNano(5),
    // });

    // console.log(tx);
    // console.log(`Collection deployed at: ${sample.address.toString()}`);
}

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.log(e);
        process.exit(1);
    });