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
    uint256 public MARKETPLACE_ROYALTY_PERCENTAGE = 10;
    mapping(uint256 => NFT) private _idToNFT;

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

        // TODO check ownership

        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

        _nftCount.increment();

        _idToNFT[_tokenId] = NFT(
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
        NFT storage nft = _idToNFT[_tokenId];

        require(nft.seller == msg.sender, "Only seller is able to delist");

        delete _idToNFT[_tokenId];

        emit NFTDelisted(_tokenId, msg.sender);
    }

    function buyNft(
        address _nftContract,
        uint256 _tokenId
    ) public payable nonReentrant {
        NFT storage nft = _idToNFT[_tokenId];
        require(
            msg.value >=
                nft.price +
                    ((nft.price / 100) * MARKETPLACE_ROYALTY_PERCENTAGE),
            "Not enough ether to cover asking price"
        );

        address buyer = msg.sender;
        payable(nft.seller).transfer(msg.value);
        IERC721(_nftContract).transferFrom(address(this), buyer, nft.tokenId);
        _marketOwner.transfer(
            (nft.price / 100) * MARKETPLACE_ROYALTY_PERCENTAGE
        );
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
            if (_idToNFT[i + 1].listed) {
                nfts[nftsIndex] = _idToNFT[i + 1];
                nftsIndex++;
            }
        }
        return nfts;
    }
}
