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

    mapping(uint256 => NFT) private _nftsListedByIndex;
    mapping(uint256 => uint256) private _nftsListedIndexById;
    mapping(uint256 => NFT) private _nftsSoldByIndex;

    struct NFT {
        uint256 id;
        address seller;
        address owner;
        uint256 price;
    }

    event NFTListed(
        uint256 nftId,
        address seller,
        address owner,
        uint256 price
    );
    event NFTDelisted(uint256 nftId, address seller);
    event NFTSold(uint256 nftId, address seller, address owner, uint256 price);

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

        _nftsListedIndexById[_nftId] = _nftsListedCount.current();
        _nftsListedByIndex[_nftsListedCount.current()] = NFT(
            _nftId,
            msg.sender,
            address(this),
            _price,
            block.timestamp
        );

        emit NFTListed(_nftId, msg.sender, address(this), _price);
    }

    function delistNft(uint256 _nftId) public nonReentrant {
        uint256 nftIndex = _nftsListedIndexById[_nftId];
        NFT storage nft = _nftsListedByIndex[nftIndex];

        require(nft.seller == msg.sender, "Only seller is able to delist");

        IERC721(nft.nftContract).transferFrom(nft.owner, nft.seller, _nftId);

        _nftsListedCount.decrement();
        delete _nftsListedByIndex[nftIndex];
        delete _nftsListedIndexById[_nftId];

        emit NFTDelisted(_nftId, msg.sender);
    }

    function buyNft(
        address _nftContract,
        uint256 _nftId
    ) public payable nonReentrant {
        uint256 nftIndex = _nftsListedIndexById[_nftId];
        NFT storage nft = _nftsListedByIndex[nftIndex];

        require(
            msg.value >= nft.price,
            "Not enough ether to cover asking price"
        );

        IERC721(_nftContract).transferFrom(address(this), buyer, nft.id);

        address buyer = msg.sender;
        uint256 marketplaceShare = (nft.price / 100) *
            MARKETPLACE_ROYALTY_PERCENTAGE;
        uint256 sellerShare = msg.value - marketplaceShare;

        payable(nft.seller).transfer(sellerShare);
        _marketOwner.transfer(marketplaceShare);

        nft.owner = buyer;

        _nftsSoldCount.increment();
        _nftsSoldByIndex[_nftsSoldCount.current()] = nft;

        emit NFTSold(nft.id, nft.seller, buyer, msg.value);

        uint256 nftListedIndex = _nftsListedIndexById[_nftId];
        delete _nftsListedByIndex[nftListedIndex];
        delete _nftsListedIndexById[_nftId];
        _nftsListedCount.decrement();
    }

    function getNftsListed() public view returns (NFT[] memory) {
        uint256 nftCount = _nftsListedCount.current();

        NFT[] memory nfts = new NFT[](nftCount);
        uint nftsIndex = 0;
        for (uint i = 0; i < nftCount; i++) {
            nfts[nftsIndex] = _nftsListedByIndex[i + 1];
            nftsIndex++;
        }
        return nfts;
    }

    function getNftsSold() public view returns (NFT[] memory) {
        uint256 nftCount = _nftsSoldCount.current();

        NFT[] memory nfts = new NFT[](nftCount);
        uint nftsIndex = 0;
        for (uint i = 0; i < nftCount; i++) {
            nfts[nftsIndex] = _nftsSoldByIndex[i + 1];
            nftsIndex++;
        }
        return nfts;
    }
}
