export class NftContractArtifact {
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
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "name": "sendGasTo",
                        "type": "address"
                    },
                    {
                        "name": "remainOnNft",
                        "type": "uint128"
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
                        "name": "indexDeployValue",
                        "type": "uint128"
                    },
                    {
                        "name": "indexDestroyValue",
                        "type": "uint128"
                    }
                ],
                "outputs": []
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
                "name": "resolveIndex",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    },
                    {
                        "name": "collection",
                        "type": "address"
                    },
                    {
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "index",
                        "type": "address"
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
                "name": "transfer",
                "inputs": [
                    {
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "name": "sendGasTo",
                        "type": "address"
                    },
                    {
                        "components": [
                            {
                                "name": "value",
                                "type": "uint128"
                            },
                            {
                                "name": "payload",
                                "type": "cell"
                            }
                        ],
                        "name": "callbacks",
                        "type": "map(address,tuple)"
                    }
                ],
                "outputs": []
            },
            {
                "name": "changeOwner",
                "inputs": [
                    {
                        "name": "newOwner",
                        "type": "address"
                    },
                    {
                        "name": "sendGasTo",
                        "type": "address"
                    },
                    {
                        "components": [
                            {
                                "name": "value",
                                "type": "uint128"
                            },
                            {
                                "name": "payload",
                                "type": "cell"
                            }
                        ],
                        "name": "callbacks",
                        "type": "map(address,tuple)"
                    }
                ],
                "outputs": []
            },
            {
                "name": "changeManager",
                "inputs": [
                    {
                        "name": "newManager",
                        "type": "address"
                    },
                    {
                        "name": "sendGasTo",
                        "type": "address"
                    },
                    {
                        "components": [
                            {
                                "name": "value",
                                "type": "uint128"
                            },
                            {
                                "name": "payload",
                                "type": "cell"
                            }
                        ],
                        "name": "callbacks",
                        "type": "map(address,tuple)"
                    }
                ],
                "outputs": []
            },
            {
                "name": "getInfo",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "id",
                        "type": "uint256"
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
                        "name": "collection",
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
            }
        ],
        "data": [
            {
                "key": 1,
                "name": "_id",
                "type": "uint256"
            }
        ],
        "events": [
            {
                "name": "NftCreated",
                "inputs": [
                    {
                        "name": "id",
                        "type": "uint256"
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
                        "name": "collection",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "OwnerChanged",
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
                "name": "ManagerChanged",
                "inputs": [
                    {
                        "name": "oldManager",
                        "type": "address"
                    },
                    {
                        "name": "newManager",
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
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "name": "manager",
                        "type": "address"
                    },
                    {
                        "name": "collection",
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
                "name": "_id",
                "type": "uint256"
            },
            {
                "name": "_collection",
                "type": "address"
            },
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_manager",
                "type": "address"
            },
            {
                "name": "_json",
                "type": "string"
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
                "name": "_codeIndex",
                "type": "cell"
            }
        ]
    };
    public static readonly TVC = "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";
    public static readonly CODE = "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";
    public static readonly CODE_HASH = "646d2bcd03fdedb16021aacf43ff30c31ecc1a1f5e08cde08b6b0c4b52ffceca";
}
