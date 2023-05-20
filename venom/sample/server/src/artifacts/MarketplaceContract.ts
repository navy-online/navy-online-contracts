export class MarketplaceContractArtifact {

    public static readonly ABI = {
        "ABI version": 2,
        "version": "2.2",
        "header": [
            "time"
        ],
        "functions": [
            {
                "name": "listNft",
                "inputs": [
                    {
                        "name": "nftAddress",
                        "type": "address"
                    },
                    {
                        "name": "price",
                        "type": "uint256"
                    }
                ],
                "outputs": []
            },
            {
                "name": "delistNft",
                "inputs": [
                    {
                        "name": "nftAddress",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "buyNft",
                "inputs": [
                    {
                        "name": "nftAddress",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "constructor",
                "inputs": [],
                "outputs": []
            },
            {
                "name": "NFT_LISTED",
                "inputs": [],
                "outputs": [
                    {
                        "name": "NFT_LISTED",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "NFT_SOLD",
                "inputs": [],
                "outputs": [
                    {
                        "name": "NFT_SOLD",
                        "type": "uint128"
                    }
                ]
            }
        ],
        "data": [],
        "events": [
            {
                "name": "NFTListed",
                "inputs": [
                    {
                        "name": "nftAddress",
                        "type": "address"
                    },
                    {
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "name": "price",
                        "type": "uint256"
                    }
                ],
                "outputs": []
            },
            {
                "name": "NFTDelisted",
                "inputs": [
                    {
                        "name": "nftAddress",
                        "type": "address"
                    },
                    {
                        "name": "seller",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "NFTSold",
                "inputs": [
                    {
                        "name": "nftAddress",
                        "type": "address"
                    },
                    {
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "name": "newOwner",
                        "type": "address"
                    },
                    {
                        "name": "price",
                        "type": "uint256"
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
                "name": "NFT_LISTED",
                "type": "uint128"
            },
            {
                "name": "NFT_SOLD",
                "type": "uint128"
            },
            {
                "components": [
                    {
                        "name": "nftAddress",
                        "type": "address"
                    },
                    {
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "name": "price",
                        "type": "uint256"
                    }
                ],
                "name": "_nftsListedByAddress",
                "type": "map(address,tuple)"
            },
            {
                "components": [
                    {
                        "name": "nftAddress",
                        "type": "address"
                    },
                    {
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "name": "price",
                        "type": "uint256"
                    }
                ],
                "name": "_nftsSoldByAddress",
                "type": "map(address,tuple)"
            }
        ]
    };
    public static readonly TVC = "te6ccgECIQEABM8AAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgBCSK7VMg4wMgwP/jAiDA/uMC8gseBQQgA4jtRNDXScMB+GaJ+Gkh2zzTAAGegwjXGCD5AVj4QvkQ8qje0z8B+EMhufK0IPgjgQPoqIIIG3dAoLnytPhj0x8B2zzyPBkOBgNS7UTQ10nDAfhmItDTA/pAMPhpqTgA3CHHAOMCIdcNH/K8IeMDAds88jwdHQYCKCCCEGi1Xz+74wIgghB5xBWqu+MCDAcCKCCCEHT+0ia64wIgghB5xBWquuMCCwgDNjD4RvLgTPhCbuMAIZPU0dDe+kDR2zww2zzyABwJFQT8IPhMgQEL9AuOgI6A4mim/mAhbxOCEBHhowCgvPLgZnB0+wJt+ElTA3DIz4WAygDPhEDOgoAh3NZQAAAAAAAAAAAAAAAAAAHPC45VIMjPkEd2ekrOWcjO9ADNzclx+wBcbxH4SSNvE28EIvhNWNs8yVmBAQv0E/htIfhMgQELGhgSCgB09Fkw+GwgbxP4SVhvEVUCi9wAAAAAAAAAAAAAAAAYyM5VMMjPkDgVxnbOVSDIzlnIzsv/zc3NyXD7AAFQMNHbPPhKIY4cjQRwAAAAAAAAAAAAAAAAPT+0iaDIzst/yXD7AN7yABwEUCCCEBYprsW64wIgghAWLkVduuMCIIIQYRMMk7rjAiCCEGi1Xz+64wIUEw8NAiIw+EJu4wD4RvJz0fgA2zzyAA4VAWLtRNDXScIBjiZw7UTQ9AVwIG0g+G34bPhr+GqAQPQO8r3XC//4YnD4Y3D4anX4a+MNHAM6MPhG8uBM+EJu4wAhk9TR0N76QNP/0ds8MNs88gAcEBUC6CCCEDuaygC88uBmaKb+YIIQEeGjALzy4GZwdPsCbfhJ+CgkcMjPhYDKAM+EQM6CgCHc1lAAAAAAAAAAAAAAAAAAAc8LjlUgyM+QR3Z6Ss5ZyM70AM3NyXH7ACH4SfgoI28EIvhMWNs8yVmBAQv0E/hs+ElYEhEATIvcAAAAAAAAAAAAAAAAGMjOVSDIz5A8pmqezlnIzsv/zc3JcPsAACJvJF4gyM5VIMjOWcjOy//NzQFQMNHbPPhLIY4cjQRwAAAAAAAAAAAAAAAAJYuRV2DIzst/yXD7AN7yABwDNjD4RvLgTPhCbuMAIZPU0dDe+kDR2zww2zzyABwWFQA8+E34TPhL+Er4Q/hCyMv/yz/Pg8t/y3/0APQAye1UA+Ropv5gghAR4aMAvPLgZiD4TIEBC/QLjoCOgOJvEfhJxwXy4GVwdPsCbfhJUwJwyM+FgMoAz4RAzoKAIdzWUAAAAAAAAAAAAAAAAAABzwuOVSDIz5BHdnpKzlnIzvQAzc3JcfsAIPhMgQEL9Fkw+Gz4SQEaGBcARovcAAAAAAAAAAAAAAAAGMjOWcjPkDoVA6LOAcjOzc3JcPsAAQyJXyBwbwQZAEOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAQbQ2zwbACL6QNTR0PpA1NHQ+kDT/9FvBAA+7UTQ0//TP9MAMdN/03/0BPQE0fht+Gz4a/hq+GP4YgAK+Eby4EwCCvSkIPShIB8AFHNvbCAwLjYyLjAAAA==";
    public static readonly CODE = "te6ccgECHgEABKIABCSK7VMg4wMgwP/jAiDA/uMC8gsbAgEdA4jtRNDXScMB+GaJ+Gkh2zzTAAGegwjXGCD5AVj4QvkQ8qje0z8B+EMhufK0IPgjgQPoqIIIG3dAoLnytPhj0x8B2zzyPBYLAwNS7UTQ10nDAfhmItDTA/pAMPhpqTgA3CHHAOMCIdcNH/K8IeMDAds88jwaGgMCKCCCEGi1Xz+74wIgghB5xBWqu+MCCQQCKCCCEHT+0ia64wIgghB5xBWquuMCCAUDNjD4RvLgTPhCbuMAIZPU0dDe+kDR2zww2zzyABkGEgT8IPhMgQEL9AuOgI6A4mim/mAhbxOCEBHhowCgvPLgZnB0+wJt+ElTA3DIz4WAygDPhEDOgoAh3NZQAAAAAAAAAAAAAAAAAAHPC45VIMjPkEd2ekrOWcjO9ADNzclx+wBcbxH4SSNvE28EIvhNWNs8yVmBAQv0E/htIfhMgQELFxUPBwB09Fkw+GwgbxP4SVhvEVUCi9wAAAAAAAAAAAAAAAAYyM5VMMjPkDgVxnbOVSDIzlnIzsv/zc3NyXD7AAFQMNHbPPhKIY4cjQRwAAAAAAAAAAAAAAAAPT+0iaDIzst/yXD7AN7yABkEUCCCEBYprsW64wIgghAWLkVduuMCIIIQYRMMk7rjAiCCEGi1Xz+64wIREAwKAiIw+EJu4wD4RvJz0fgA2zzyAAsSAWLtRNDXScIBjiZw7UTQ9AVwIG0g+G34bPhr+GqAQPQO8r3XC//4YnD4Y3D4anX4a+MNGQM6MPhG8uBM+EJu4wAhk9TR0N76QNP/0ds8MNs88gAZDRIC6CCCEDuaygC88uBmaKb+YIIQEeGjALzy4GZwdPsCbfhJ+CgkcMjPhYDKAM+EQM6CgCHc1lAAAAAAAAAAAAAAAAAAAc8LjlUgyM+QR3Z6Ss5ZyM70AM3NyXH7ACH4SfgoI28EIvhMWNs8yVmBAQv0E/hs+ElYDw4ATIvcAAAAAAAAAAAAAAAAGMjOVSDIz5A8pmqezlnIzsv/zc3JcPsAACJvJF4gyM5VIMjOWcjOy//NzQFQMNHbPPhLIY4cjQRwAAAAAAAAAAAAAAAAJYuRV2DIzst/yXD7AN7yABkDNjD4RvLgTPhCbuMAIZPU0dDe+kDR2zww2zzyABkTEgA8+E34TPhL+Er4Q/hCyMv/yz/Pg8t/y3/0APQAye1UA+Ropv5gghAR4aMAvPLgZiD4TIEBC/QLjoCOgOJvEfhJxwXy4GVwdPsCbfhJUwJwyM+FgMoAz4RAzoKAIdzWUAAAAAAAAAAAAAAAAAABzwuOVSDIz5BHdnpKzlnIzvQAzc3JcfsAIPhMgQEL9Fkw+Gz4SQEXFRQARovcAAAAAAAAAAAAAAAAGMjOWcjPkDoVA6LOAcjOzc3JcPsAAQyJXyBwbwQWAEOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAQbQ2zwYACL6QNTR0PpA1NHQ+kDT/9FvBAA+7UTQ0//TP9MAMdN/03/0BPQE0fht+Gz4a/hq+GP4YgAK+Eby4EwCCvSkIPShHRwAFHNvbCAwLjYyLjAAAA==";
    public static readonly CODE_HASH = "fd4557b87f496f1c7e758947895021c7826f6e00e03b5b7fa134c0e0fd239011";

}