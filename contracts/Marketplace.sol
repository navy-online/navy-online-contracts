// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _nftsSold;
    Counters.Counter private _nftCount;
    address payable private _marketOwner;
    uint256 public MARKETPLACE_ROYALTY_PERCENTAGE = 5;

    mapping(uint256 => NFT) private _nftListed;

    struct NFT {
        address nftContract;
        uint256 tokenId;
        address seller;
        address owner;
        uint256 price;
        bool listed;
    }

    event NFTListed(
        address nftContract,
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price
    );

    event NFTDelisted(uint256 tokenId, address seller);

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

        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

        _nftCount.increment();

        _nftListed[_tokenId] = NFT(
            _nftContract,
            _tokenId,
            msg.sender,
            address(this),
            _price,
            true
        );

        emit NFTListed(
            _nftContract,
            _tokenId,
            msg.sender,
            address(this),
            _price
        );
    }

    function delistNft(uint256 _tokenId) public nonReentrant {
        NFT storage nft = _nftListed[_tokenId];

        require(nft.seller == msg.sender, "Only seller is able to delist");

        delete _nftListed[_tokenId];

        emit NFTDelisted(_tokenId, msg.sender);
    }

    function buyNft(
        address _nftContract,
        uint256 _tokenId
    ) public payable nonReentrant {
        NFT storage nft = _nftListed[_tokenId];
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
        nft.listed = false;

        _nftsSold.increment();
        emit NFTSold(_nftContract, nft.tokenId, nft.seller, buyer, msg.value);
    }

    function getListedNfts() public view returns (NFT[] memory) {
        uint256 nftCount = _nftCount.current();
        uint256 unsoldNftsCount = nftCount - _nftsSold.current();

        NFT[] memory nfts = new NFT[](unsoldNftsCount);
        uint nftsIndex = 0;
        for (uint i = 0; i < nftCount; i++) {
            if (_nftListed[i + 1].listed) {
                nfts[nftsIndex] = _nftListed[i + 1];
                nftsIndex++;
            }
        }
        return nfts;
    }
}
