// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _nftsListedCount;
    Counters.Counter private _nftsSoldCount;

    address payable private _marketOwner;
    address public collectionAddress;
    uint256 public MARKETPLACE_ROYALTY_PERCENTAGE = 5;

    mapping(uint256 => NFT) private _nftListedByIndex;
    mapping(uint256 => NFT) private _nftSoldByIndex;

    mapping(uint256 => uint256) private _nftListedIndexById;
    mapping(uint256 => uint256) private _nftSoldIndexById;

    struct NFT {
        uint256 id;
        address seller;
        address owner;
        uint256 price;
        uint256 updateTime;
    }

    event NftListed(
        uint256 nftId,
        address seller,
        address owner,
        uint256 price
    );
    event NftDelisted(uint256 nftId, address seller);
    event NftSold(uint256 nftId, address seller, address owner, uint256 price);

    constructor(address _collectionAddress) {
        collectionAddress = _collectionAddress;
        _marketOwner = payable(msg.sender);
    }

    function listNft(
        address _nftContract,
        uint256 _nftId,
        uint256 _price
    ) public nonReentrant {
        require(_nftContract == collectionAddress, "Unsupported collection");
        require(_price > 0, "Price must be at least 1 wei");

        // TODO make sure that ERC721 transfer is checking the ownership
        ERC721(_nftContract).transferFrom(msg.sender, address(this), _nftId);

        _nftsListedCount.increment();

        _nftListedIndexById[_nftId] = _nftsListedCount.current();
        _nftListedByIndex[_nftsListedCount.current()] = NFT(
            _nftId,
            msg.sender,
            address(this),
            _price,
            block.timestamp
        );

        emit NftListed(_nftId, msg.sender, address(this), _price);
    }

    function delistNft(
        address _nftContract,
        uint256 _nftId
    ) public nonReentrant {
        require(_nftContract == collectionAddress, "Unsupported collection");

        uint256 nftIndex = _nftListedIndexById[_nftId];
        NFT storage nft = _nftListedByIndex[nftIndex];

        require(nft.id == _nftId, "Unsupported collection");
        require(nft.seller == msg.sender, "Only seller is able to delist");

        IERC721(_nftContract).transferFrom(nft.owner, nft.seller, nft.id);

        emit NftDelisted(nft.id, msg.sender);

        _nftsListedCount.decrement();
        delete _nftListedByIndex[nftIndex];
        delete _nftListedIndexById[nft.id];
    }

    function buyNft(
        address _nftContract,
        uint256 _nftId
    ) public payable nonReentrant {
        require(_nftContract == collectionAddress, "Unsupported collection");

        uint256 nftIndex = _nftListedIndexById[_nftId];
        NFT storage nft = _nftListedByIndex[nftIndex];

        require(nft.id == _nftId, "Unsupported collection");

        require(
            msg.value >= nft.price,
            "Not enough ether to cover asking price"
        );

        IERC721(_nftContract).transferFrom(address(this), msg.sender, nft.id);

        uint256 marketplaceShare = (nft.price / 100) *
            MARKETPLACE_ROYALTY_PERCENTAGE;
        uint256 sellerShare = msg.value - marketplaceShare;

        payable(nft.seller).transfer(sellerShare);
        _marketOwner.transfer(marketplaceShare);

        nft.owner = msg.sender;
        nft.updateTime = block.timestamp;

        _nftsSoldCount.increment();
        _nftSoldIndexById[nft.id] = _nftsSoldCount.current();
        _nftSoldByIndex[_nftsSoldCount.current()] = nft;

        emit NftSold(nft.id, nft.seller, msg.sender, msg.value);

        _nftsListedCount.decrement();
        delete _nftListedByIndex[nftIndex];
        delete _nftListedIndexById[nft.id];
    }

    function getNftsListed() public view returns (NFT[] memory) {
        uint256 nftCount = _nftsListedCount.current();

        NFT[] memory nfts = new NFT[](nftCount);
        uint nftsIndex = 0;
        for (uint i = 0; i < nftCount; i++) {
            nfts[nftsIndex] = _nftListedByIndex[_nftListedIndexById[i + 1]];
            nftsIndex++;
        }
        return nfts;
    }

    function getNftsSold() public view returns (NFT[] memory) {
        uint256 nftCount = _nftsSoldCount.current();

        NFT[] memory nfts = new NFT[](nftCount);
        uint nftsIndex = 0;
        for (uint i = 0; i < nftCount; i++) {
            nfts[nftsIndex] = _nftSoldByIndex[_nftSoldIndexById[i + 1]];
            nftsIndex++;
        }
        return nfts;
    }
}
