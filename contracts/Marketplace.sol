// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _nftsListedCount;
    Counters.Counter private _nftsSoldCount;
    address payable private _marketOwner;
    uint256 public MARKETPLACE_ROYALTY_PERCENTAGE = 5;

    mapping(uint256 => NFT) private _nftsListedByIndex;
    mapping(uint256 => uint256) private _nftsListedIndexByTokenId;

    mapping(uint256 => NFT) private _nftsSoldByIndex;

    // TODO pass struct into the event ?
    struct NFT {
        address nftContract;
        uint256 tokenId;
        string tokenUri;
        address seller;
        address owner;
        uint256 price;
        uint lastUpdated;
    }

    event NFTListed(
        address nftContract,
        uint256 tokenId,
        string tokenUri,
        address seller,
        address owner,
        uint256 price
    );

    event NFTDelisted(uint256 tokenId, address nftContract, address seller);

    event NFTSold(
        address nftContract,
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price
    );

    constructor() {
        _marketOwner = payable(msg.sender);
    }

    function listNft(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price
    ) public nonReentrant {
        require(_price > 0, "Price must be at least 1 wei");

        ERC721URIStorage(_nftContract).transferFrom(
            msg.sender,
            address(this),
            _tokenId
        );

        string memory tokenUri = ERC721URIStorage(_nftContract).tokenURI(
            _tokenId
        );

        _nftsListedCount.increment();

        _nftsListedIndexByTokenId[_tokenId] = _nftsListedCount.current();
        _nftsListedByIndex[_nftsListedCount.current()] = NFT(
            _nftContract,
            _tokenId,
            tokenUri,
            msg.sender,
            address(this),
            _price,
            block.timestamp
        );

        emit NFTListed(
            _nftContract,
            _tokenId,
            tokenUri,
            msg.sender,
            address(this),
            _price
        );
    }

    function delistNft(uint256 _tokenId) public nonReentrant {
        uint256 nftIndex = _nftsListedIndexByTokenId[_tokenId];
        NFT storage nft = _nftsListedByIndex[nftIndex];

        require(nft.seller == msg.sender, "Only seller is able to delist");

        _nftsListedCount.decrement();
        delete _nftsListedByIndex[nftIndex];
        delete _nftsListedIndexByTokenId[_tokenId];

        emit NFTDelisted(_tokenId, nft.nftContract, msg.sender);
    }

    function buyNft(
        address _nftContract,
        uint256 _tokenId
    ) public payable nonReentrant {
        uint256 nftIndex = _nftsListedIndexByTokenId[_tokenId];
        NFT storage nft = _nftsListedByIndex[nftIndex];

        require(
            msg.value >= nft.price,
            "Not enough ether to cover asking price"
        );

        address buyer = msg.sender;
        uint256 marketplaceShare = (nft.price / 100) *
            MARKETPLACE_ROYALTY_PERCENTAGE;
        uint256 sellerShare = msg.value - marketplaceShare;

        payable(nft.seller).transfer(sellerShare);
        _marketOwner.transfer(marketplaceShare);

        IERC721(_nftContract).transferFrom(address(this), buyer, nft.tokenId);
        nft.owner = buyer;
        nft.lastUpdated = block.timestamp;

        _nftsSoldCount.increment();
        _nftsSoldByIndex[_nftsSoldCount.current()] = nft;

        emit NFTSold(_nftContract, nft.tokenId, nft.seller, buyer, msg.value);

        uint256 nftListedIndex = _nftsListedIndexByTokenId[_tokenId];
        delete _nftsListedByIndex[nftListedIndex];
        delete _nftsListedIndexByTokenId[_tokenId];
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
