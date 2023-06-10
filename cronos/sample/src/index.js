import Web3, { givenProvider } from "web3";
import { ethers } from "ethers";

const { NftContractAbi } = require('./abi/NftContract.js');
const { CollectionContractAbi } = require('./abi/CollectionContract.js');
const { MarketplaceContractAbi } = require('./abi/MarketplaceContract.js');

const web3 = new Web3(givenProvider);

const CaptainsContractAddress = '0x2f79860E2a2829AF3C135880da1e8fC3fD9AE398';
const CaptainsCollectionContractAddress = '0x16223935C5b2Ae50785604dDee8E350334805f05';
const CaptainsMarketplaceContractAddress = '0x59911FF9eFee39d96EbDeee940F28e26DccD8530';

let myAddress = '';

if (typeof window.ethereum !== 'undefined') {
    alert('MetaMask is installed!');

    const ethereumButton = document.createElement('button');
    ethereumButton.innerHTML = 'Enable Ethereum';

    const enableMintingButton = document.createElement('button');
    enableMintingButton.innerHTML = 'Enable minting';

    const mintButton = document.createElement('button');
    mintButton.innerHTML = 'Mint captain';

    const approveCaptainsButton = document.createElement('button');
    approveCaptainsButton.innerHTML = 'Approve captains';

    const listCaptainButton = document.createElement('button');
    listCaptainButton.innerHTML = 'List captain';

    const delistCaptainButton = document.createElement('button');
    delistCaptainButton.innerHTML = 'Delist captain';

    const buyCaptainButton = document.createElement('button');
    buyCaptainButton.innerHTML = 'Buy captain';

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
        const saleContract = new web3.eth.Contract(CollectionContractAbi, CaptainsCollectionContractAddress);
        saleContract.methods.mintNft().send({ from: myAddress, value: '1000000000000000000' });
    });

    enableMintingButton.addEventListener('click', async () => {
        const saleContract = new web3.eth.Contract(CollectionContractAbi, CaptainsCollectionContractAddress);
        saleContract.methods.changeMintState(2).send({ from: myAddress });
    });

    approveCaptainsButton.addEventListener('click', async () => {
        const captainsContract = new web3.eth.Contract(NftContractAbi, CaptainsContractAddress);
        const isMarketpalceApproved = await captainsContract.methods.isApprovedForAll(myAddress, CaptainsMarketplaceContractAddress).call();

        if (isMarketpalceApproved) {
            alert('No need to approve');
        } else {
            alert('Need to approve');
            await captainsContract.methods.setApprovalForAll(CaptainsMarketplaceContractAddress, true).send({ from: myAddress });
        }
    });

    listCaptainButton.addEventListener('click', async () => {
        const marketplaceContract = new web3.eth.Contract(MarketplaceContractAbi, CaptainsMarketplaceContractAddress);
        marketplaceContract.methods.listNft(CaptainsContractAddress, 2, '1000000000000000000').send({ from: myAddress });
    });

    delistCaptainButton.addEventListener('click', async () => {
        const marketplaceContract = new web3.eth.Contract(MarketplaceContractAbi, CaptainsMarketplaceContractAddress);
        marketplaceContract.methods.delistNft(1).send({ from: myAddress });
    });

    buyCaptainButton.addEventListener('click', async () => {
        const marketplaceContract = new web3.eth.Contract(MarketplaceContractAbi, CaptainsMarketplaceContractAddress);
        marketplaceContract.methods.buyNft(CaptainsContractAddress, 1).send({ from: myAddress, value: '1000000000000000000' });
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
    document.body.appendChild(enableMintingButton);
    document.body.appendChild(mintButton);
    document.body.appendChild(approveCaptainsButton);
    document.body.appendChild(listCaptainButton);
    document.body.appendChild(delistCaptainButton);
    document.body.appendChild(buyCaptainButton);
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