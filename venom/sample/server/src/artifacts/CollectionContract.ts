
export class CollectionContractArtifact {

    public static readonly ABI = {
        "ABI version": 2,
        "version": "2.2",
        "header": [
            "time"
        ],
        "functions": [
            {
                "name": "constructor",
                "inputs": [
                    {
                        "name": "_mintPrice",
                        "type": "uint128"
                    },
                    {
                        "name": "_collectionSize",
                        "type": "uint128"
                    },
                    {
                        "name": "codeNft",
                        "type": "cell"
                    },
                    {
                        "name": "json",
                        "type": "string"
                    },
                    {
                        "name": "codeIndex",
                        "type": "cell"
                    },
                    {
                        "name": "codeIndexBasis",
                        "type": "cell"
                    },
                    {
                        "name": "ownerAddress",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "mintNft",
                "inputs": [],
                "outputs": []
            },
            {
                "name": "generateNft",
                "inputs": [
                    {
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "name": "json",
                        "type": "string"
                    },
                    {
                        "name": "minter",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "changeMintState",
                "inputs": [
                    {
                        "name": "_mintState",
                        "type": "uint8"
                    }
                ],
                "outputs": []
            },
            {
                "name": "addToWhitelist",
                "inputs": [
                    {
                        "name": "toAddAddress",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "removeFromWhitelist",
                "inputs": [
                    {
                        "name": "toRemoveAddress",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "owner",
                "inputs": [],
                "outputs": [
                    {
                        "name": "owner",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "transferOwnership",
                "inputs": [
                    {
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "indexBasisCode",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "code",
                        "type": "cell"
                    }
                ]
            },
            {
                "name": "indexBasisCodeHash",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "hash",
                        "type": "uint256"
                    }
                ]
            },
            {
                "name": "resolveIndexBasis",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "indexBasis",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "indexCode",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "code",
                        "type": "cell"
                    }
                ]
            },
            {
                "name": "indexCodeHash",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "hash",
                        "type": "uint256"
                    }
                ]
            },
            {
                "name": "getJson",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "json",
                        "type": "string"
                    }
                ]
            },
            {
                "name": "totalSupply",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "count",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "nftCode",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "code",
                        "type": "cell"
                    }
                ]
            },
            {
                "name": "nftCodeHash",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "codeHash",
                        "type": "uint256"
                    }
                ]
            },
            {
                "name": "nftAddress",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    },
                    {
                        "name": "id",
                        "type": "uint256"
                    }
                ],
                "outputs": [
                    {
                        "name": "nft",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "supportsInterface",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    },
                    {
                        "name": "interfaceID",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "mintPrice",
                "inputs": [],
                "outputs": [
                    {
                        "name": "mintPrice",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "mintState",
                "inputs": [],
                "outputs": [
                    {
                        "name": "mintState",
                        "type": "uint8"
                    }
                ]
            },
            {
                "name": "whitelist",
                "inputs": [],
                "outputs": [
                    {
                        "name": "whitelist",
                        "type": "map(address,bool)"
                    }
                ]
            },
            {
                "name": "collectionSize",
                "inputs": [],
                "outputs": [
                    {
                        "name": "collectionSize",
                        "type": "uint128"
                    }
                ]
            }
        ],
        "data": [],
        "events": [
            {
                "name": "NftMinted",
                "inputs": [
                    {
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "NftGenerated",
                "inputs": [
                    {
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "OwnershipTransferred",
                "inputs": [
                    {
                        "name": "oldOwner",
                        "type": "address"
                    },
                    {
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "NftCreated",
                "inputs": [
                    {
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "name": "nft",
                        "type": "address"
                    },
                    {
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "name": "manager",
                        "type": "address"
                    },
                    {
                        "name": "creator",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "NftBurned",
                "inputs": [
                    {
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "name": "nft",
                        "type": "address"
                    },
                    {
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "name": "manager",
                        "type": "address"
                    }
                ],
                "outputs": []
            }
        ],
        "fields": [
            {
                "name": "_pubkey",
                "type": "uint256"
            },
            {
                "name": "_timestamp",
                "type": "uint64"
            },
            {
                "name": "_constructorFlag",
                "type": "bool"
            },
            {
                "name": "_supportedInterfaces",
                "type": "optional(cell)"
            },
            {
                "name": "_codeNft",
                "type": "cell"
            },
            {
                "name": "_totalSupply",
                "type": "uint128"
            },
            {
                "name": "_json",
                "type": "string"
            },
            {
                "name": "_codeIndex",
                "type": "cell"
            },
            {
                "name": "_codeIndexBasis",
                "type": "cell"
            },
            {
                "name": "_indexDeployValue",
                "type": "uint128"
            },
            {
                "name": "_indexDestroyValue",
                "type": "uint128"
            },
            {
                "name": "_deployIndexBasisValue",
                "type": "uint128"
            },
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "mintPrice",
                "type": "uint128"
            },
            {
                "name": "mintState",
                "type": "uint8"
            },
            {
                "name": "whitelist",
                "type": "map(address,bool)"
            },
            {
                "name": "collectionSize",
                "type": "uint128"
            }
        ]
    };
    public static readonly TVC = "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";
    public static readonly CODE = "te6ccgECTwEADrUABCSK7VMg4wMgwP/jAiDA/uMC8gtMAgFOA4jtRNDXScMB+GaJ+Gkh2zzTAAGegwjXGCD5AVj4QvkQ8qje0z8B+EMhufK0IPgjgQPoqIIIG3dAoLnytPhj0x8B2zzyPCEfAwN67UTQ10nDAfhmItDTA/pAMPhpqTgA+ER/b3GCCJiWgG9ybW9zcG90+GTcIccA4wIh1w0f8rwh4wMB2zzyPEtLAwIoIIIQVMe7H7vjAiCCEGul/G674wISBAIoIIIQXwvP3rvjAiCCEGul/G674wIMBQM8IIIQYR8AZLrjAiCCEGNQZ6264wIgghBrpfxuuuMCCggGAyYw+Eby4Ez4Qm7jANHbPDDbPPIASgdDAMz4VfLgaPhVwAGOE/hJ+FaBAQv0Cm+Rk9cKAN7y4GneaKb+YPhUghAR4aMAoLV/vPLgZvhX+Ey88uBncHT7AvhMpLV/+Gz4SfhMjQRwAAAAAAAAAAAAAAAAFfcrteDIzsv/zslw+wADNjD4RvLgTPhCbuMAIZPU0dDe+kDR2zww2zzyAEoJQwE02zz4SccF8uBkaKb+YPLgZfhWgQEL9Fkw+HZGA9gw+Eby4Ez4Qm7jANMf+ERYb3X4ZNHbPCGOGiPQ0wH6QDAxyM+HIM6CEOEfAGTPC4HLf8lwji/4RCBvEyFvEvhJVQJvEcjPhIDKAM+EQM4B+gL0AIBqz0D4RG8Vzwsfy3/J+ERvFOL7AOMA8gBKC0gAIPhEcG9ygEBvdHBvcfhk+EwEUCCCEFUIP+G64wIgghBYNi2CuuMCIIIQWZ0oibrjAiCCEF8Lz9664wIRDw4NA24w+Eby4Ez4Qm7jANHbPCGOHyPQ0wH6QDAxyM+HIM5xzwthAcjPk3wvP3rOzclw+wCRMOLjAPIASkZIAVAw0ds8+FUhjhyNBHAAAAAAAAAAAAAAAAA2Z0oiYMjOywfJcPsA3vIASgPUMPhG8uBM+EJu4wDTH/hEWG91+GTR2zwhjhkj0NMB+kAwMcjPhyDOghDYNi2CzwuBzMlwji74RCBvEyFvEvhJVQJvEcjPhIDKAM+EQM4B+gL0AIBqz0D4RG8VzwsfzMn4RG8U4vsA4wDyAEoQSAAg+ERwb3KAQG90cG9x+GT4TwFQMNHbPPhWIY4cjQRwAAAAAAAAAAAAAAAANUIP+GDIzvQAyXD7AN7yAEoEUCCCEBTMp8a74wIgghAu3sY7u+MCIIIQONt4hrvjAiCCEFTHux+74wI3MCQTBFAgghA7uGhVuuMCIIIQQHIRSrrjAiCCEFJ553C64wIgghBUx7sfuuMCIhsXFANEMPhG8uBM+EJu4wAhltP/1NTR0JPT/9Ti+kDR2zww2zzyAEoVQwSY2zz4SccF8uBkaKb+YPLgZfhX+Ey88uBncHT7Avgo2zwj2zz4UfhQ+E5VBIIQEeGjAPhJJ1UGIPkAyM+KAEDL/8nQyM+FiM5zzwtuIUY8GhYBgNs8zM+DVWDIz5EeAYtCzlVQyM7Lf8zMy3/Lf83NyYMG+wABjQRwAAAAAAAAAAAAAAAAHZhuESDIzsv/zslw+wAeA+Yw+Eby4Ez4Qm7jANMf+ERYb3X4ZNP/0ds8IY4dI9DTAfpAMDHIz4cgznHPC2EByM+TSeedws7NyXCOMfhEIG8TIW8S+ElVAm8RyM+EgMoAz4RAzgH6AvQAcc8LaQHI+ERvFc8LH87NyfhEbxTi+wDjAPIAShhIASD4RHBvcoBAb3Rwb3H4ZNs8GQIy+CjbPAHbPPkA+Cj6Qm8SyM+GQMoHy//J0DwaAEhwyMv/cG2AQPRDAcjL/3FYgED0Q8j0AMkByM+EgPQA9ADPgckD/jD4Qm7jAPhG8nMhmtN/03/U1NTU0dCX03/Tf9TU1OLU+kDRVQP4APhrghAyBOwp+ErIz4NZgCD0QyD4aoIQYR8AZIIQD6+LhLKCEC7exjuyghBSeedwsgHIz4NZgCD0Q/hqVQL4APhtghAk19X1+ErIz4NZgCD0Q/hqWSH5AIgfThwDkvkAvfLgZ/gAAfhu+G/4SoIQWDYtgoIQNHPXXLKCC9WeZbKCEBTMp8ayghA423iGsgHIz4NZgCD0Q/hq2zzbPPgA+Hf4dNs88gAdRUMEivhP+QCI+QC98uBn+CdvEPhSvPLgZNs8+CjbPCD5AMjPigBAy//J0AH4UljIz4WIzgH6AnPPC2oh2zzMz5DRar5/yXD7AE4sJx4ANNDSAAGT0gQx3tIAAZPSATHe9AT0BPQE0V8DAhbtRNDXScIBjoDjDSBKA7Jw7UTQ9AVtiHCIXyBwXyCJcCBtcPh3+Hb4dfh0+HP4cvhx+HD4b/hu+G34bPhr+GqAQPQO8r3XC//4YnD4Y4IQCPDRgPhwghAF9eEA+HGCEAjw0YD4cnD4dU5OIQBDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAM2MPhG8uBM+EJu4wDTByHCAvLQSdHbPDDbPPIASiNDASTbPPhJxwXy4GRopv5g8uBl+HVGBFAgghAyBOwpuuMCIIIQNHPXXLrjAiCCEDTR0qi64wIgghA423iGuuMCLiooJQPiMPhG8uBM+EJu4wDTH/hEWG91+GTR2zwhjh0j0NMB+kAwMcjPhyDOcc8LYQHIz5LjbeIazs3JcI4x+EQgbxMhbxL4SVUCbxHIz4SAygDPhEDOAfoC9ABxzwtpAcj4RG8Vzwsfzs3J+ERvFOL7AOMA8gBKJkgCTNs8+CjbPPkA+Cj6Qm8SyM+GQMoHy//J0PhEcG9ygEBvdHBvcfhkLCcAQnDIy/9wbYBA9EMBcViAQPQWyPQAyQHIz4SA9AD0AM+ByQM2MPhG8uBM+EJu4wAhk9TR0N76QNHbPDDbPPIASilDATrbPPhJxwXy4GRopv5g8uBl+FbIz4NZgQEL9EH4dkYD3jD4RvLgTPhCbuMA0x/4RFhvdfhk0ds8IY4aI9DTAfpAMDHIz4cgzoIQtHPXXM8Lgcv/yXCOMvhEIG8TIW8S+ElVAm8RyM+EgMoAz4RAzgH6AvQAcc8LaQHI+ERvFc8LH8v/zcn4RG8U4vsA4wDyAEorSAEk+ERwb3KAQG90cG9x+GTbPPkALAIUiMjM+E/QAcnbPC09AAZuZnQD3DD4RvLgTPhCbuMA0x/4RFhvdfhk0x/R2zwhjhoj0NMB+kAwMcjPhyDOghCyBOwpzwuBygDJcI4v+EQgbxMhbxL4SVUCbxHIz4SAygDPhEDOAfoC9ACAas9A+ERvFc8LH8oAyfhEbxTi+wDjAPIASi9IADb4RHBvcoBAb3Rwb3H4ZPhKgCD0Dm+Rk9cKAN4EUCCCEBssTXC64wIgghAk19X1uuMCIIIQLSWS9LrjAiCCEC7exju64wI2NDMxA94w+Eby4Ez4Qm7jANMf+ERYb3X4ZNHbPCGOGiPQ0wH6QDAxyM+HIM6CEK7exjvPC4HL/8lwjjL4RCBvEyFvEvhJVQJvEcjPhIDKAM+EQM4B+gL0AHHPC2kByPhEbxXPCx/L/83J+ERvFOL7AOMA8gBKMkgBKPhEcG9ygEBvdHBvcfhk+CjbPPkAPAFQMNHbPPhUIY4cjQRwAAAAAAAAAAAAAAAAK0lkvSDIzst/yXD7AN7yAEoD1DD4RvLgTPhCbuMA0x/4RFhvdfhk0ds8IY4ZI9DTAfpAMDHIz4cgzoIQpNfV9c8LgczJcI4u+EQgbxMhbxL4SVUCbxHIz4SAygDPhEDOAfoC9ACAas9A+ERvFc8LH8zJ+ERvFOL7AOMA8gBKNUgAIPhEcG9ygEBvdHBvcfhk+E0BUDDR2zz4VyGOHI0EcAAAAAAAAAAAAAAAACbLE1wgyM7Lf8lw+wDe8gBKBE4gggvVnmW64wIgghAOBNKeuuMCIIIQD6+LhLrjAiCCEBTMp8a64wJHQjo4A94w+Eby4Ez4Qm7jANMf+ERYb3X4ZNHbPCGOGiPQ0wH6QDAxyM+HIM6CEJTMp8bPC4HL/8lwjjL4RCBvEyFvEvhJVQJvEcjPhIDKAM+EQM4B+gL0AHHPC2kByPhEbxXPCx/L/83J+ERvFOL7AOMA8gBKOUgAJPhEcG9ygEBvdHBvcfhk+E75AAPUMPhG8uBM+EJu4wDTH/hEWG91+GTR2zwhjhkj0NMB+kAwMcjPhyDOghCPr4uEzwuBzMlwji74RCBvEyFvEvhJVQJvEcjPhIDKAM+EQM4B+gL0AIBqz0D4RG8VzwsfzMn4RG8U4vsA4wDyAEo7SAEk+ERwb3KAQG90cG9x+GT4KNs8PAESyM74S9AByds8PQIWIYs4rbNYxwWKiuI/PgEIAds8yUABJgHU1DAS0Ns8yM+OK2zWEszPEclAAWbViy9KQNcm9ATTCTEg10qR1I6A4osvShjXJjAByM+L0pD0AIAgzwsJz4vShswSzMjPEc5BAQSIAU4DNjD4RvLgTPhCbuMAIZPU0dDe+kDR2zww2zzyAEpEQwCS+Ff4VvhV+FT4U/hS+FH4UPhP+E74TfhM+Ev4SvhD+ELIy//LP8+D9ADMy3/MVZDIzMzLf8t/y3/OVTDIy3/LB/QAy3/NzcntVAI62zz4SccF8uBkaKb+YPLgZSD6Qm8T1wv/8uBk2zxGRQBQ+FMh+HOL3AAAAAAAAAAAAAAAABjIzlnIz5GEV8HKzgHIzs3NyXD7AAAE+FMD1DD4RvLgTPhCbuMA0x/4RFhvdfhk0ds8IY4ZI9DTAfpAMDHIz4cgzoIQg9WeZc8LgczJcI4u+EQgbxMhbxL4SVUCbxHIz4SAygDPhEDOAfoC9ACAas9A+ERvFc8LH8zJ+ERvFOL7AOMA8gBKSUgAKO1E0NP/0z8x+ENYyMv/yz/Oye1UACD4RHBvcoBAb3Rwb3H4ZPhOAJ7tRNDT/9M/0wAx9ATU03/U1NHQ1NTTf9N/03/6QNTR0NN/0wchwgLy0En0BNN/0fh3+Hb4dfh0+HP4cvhx+HD4b/hu+G34bPhr+Gr4Y/hiAAr4RvLgTAIK9KQg9KFOTQAUc29sIDAuNjIuMAAA";
    public static readonly CODE_HASH = "ce81590af7883772311ccfbb179bebbacb740368448e8e3655d768303960af30";

}