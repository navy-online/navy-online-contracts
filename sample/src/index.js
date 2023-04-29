import Web3, { givenProvider } from "web3";
import { ethers } from "ethers";

const web3 = new Web3(givenProvider);
let myAddress = '';

if (typeof window.ethereum !== 'undefined') {
    alert('MetaMask is installed!');

    const ethereumButton = document.createElement('button');
    ethereumButton.innerHTML = 'Enable Ethereum';

    const mintButton = document.createElement('button');
    mintButton.innerHTML = 'Mint captain';

    const showMyBalanceButton = document.createElement('button');
    showMyBalanceButton.innerHTML = 'Show my balance';

    const signMessageButton = document.createElement('button');
    signMessageButton.innerHTML = 'Sign message';

    ethereumButton.addEventListener('click', async () => {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        myAddress = accounts[0];
        alert('Your ETH address: ' + accounts[0]);
        await changeNetworkToTestCronosIfNeeded();
    });

    mintButton.addEventListener('click', async () => {
        const saleContract = new web3.eth.Contract(contractSaleAbi, '0x94d6C8d99a4dF25c21DA60099F19bE5e13eb6e97');
        saleContract.methods.mint().send({ from: myAddress, value: '1000000000000000000' });
    });

    showMyBalanceButton.addEventListener('click', async () => {
        let balance = await web3.eth.getBalance(myAddress);
        balance = web3.utils.fromWei(balance);

        alert('My balance: ' + balance);
    });

    signMessageButton.addEventListener('click', async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        const accounts = await provider.listAccounts();
        const address = accounts[0];

        const signedMessage = await signer.signMessage('Navy.online wants to use your address: ' + address + ' for authentication')

        alert('signedMessage: ' + signedMessage);
    });

    document.body.appendChild(ethereumButton);
    document.body.appendChild(mintButton);
    document.body.appendChild(showMyBalanceButton);
    document.body.appendChild(signMessageButton);
} else {
    alert('MetaMask is not installed!');
}

async function changeNetworkToTestCronosIfNeeded() {
    const testCronosChainId = 338;
    if (window.ethereum.networkVersion !== testCronosChainId) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: web3.utils.toHex(testCronosChainId) }]
            });
        } catch (err) {
            if (err.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainName: 'Cronos Testnet',
                            chainId: web3.utils.toHex(testCronosChainId),
                            nativeCurrency: { name: 'tCRO', decimals: 18, symbol: 'tCRO' },
                            rpcUrls: ['https://evm-t3.cronos.org/']
                        }
                    ]
                });
            }
        }
    }
}

const contractSaleAbi = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokensTotal",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_mintPrice",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_contractAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "contractAddress",
                "type": "address"
            }
        ],
        "name": "GenerateToken",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "toAddAddresses",
                "type": "address[]"
            }
        ],
        "name": "addToWhitelist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "toAddAddress",
                "type": "address"
            }
        ],
        "name": "addToWhitelist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum CollectionSale.MintState",
                "name": "_mintState",
                "type": "uint8"
            }
        ],
        "name": "changeMintState",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contractAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "mint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "mintPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "mintState",
        "outputs": [
            {
                "internalType": "enum CollectionSale.MintState",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "toRemoveAddresses",
                "type": "address[]"
            }
        ],
        "name": "removeFromWhitelist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "toRemoveAddress",
                "type": "address"
            }
        ],
        "name": "removeFromWhitelist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokensLeft",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokensTotal",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "whitelist",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];