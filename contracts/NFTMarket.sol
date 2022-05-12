//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';


contract NFTMarket is ReentrancyGuard{
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    address payable owner;
    uint256 listingPrice = 0.1 ether;
    IERC20 private gameTokenAddress = IERC20(address(0x334D0512a87f6549fAAffD7325F2b9cE8449B416));

    constructor(){
        owner = payable(msg.sender);
    }


    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }


    mapping(uint256 => MarketItem) private idToMarketItem;

    event marketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    function getListingPrice() public view returns(uint256){
        return listingPrice;
    }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant{
        require(price > 0,"Price must be at least 1 wei");
        require(msg.value == listingPrice,"Price must be equal to listing price");
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        //because at this point of time, the nft is owned by the persion who creates it, but when he lists it to marketplace, then it becomes of the marketplace

        IERC721(nftContract).transferFrom(msg.sender,address(this),tokenId);
        payable(owner).transfer(listingPrice);

        emit marketItemCreated(itemId, nftContract, tokenId, msg.sender, address(0), price, false);

    }


    // function createMarketSale(
    //     address nftContract,
    //     uint256 itemId
    // ) public payable nonReentrant{
    //     uint price =idToMarketItem[itemId].price;
    //     uint tokenId = idToMarketItem[itemId].tokenId;

    //     require(msg.value == price,"Please submit the asking price in order to complete the purchase");

    //     //Externet transactions/interactions
    //     idToMarketItem[itemId].seller.transfer(msg.value);
    //     IERC721(nftContract).transferFrom(address(this),msg.sender,tokenId);

    //     idToMarketItem[itemId].owner = payable(msg.sender);
    //     idToMarketItem[itemId].sold = true;
    //     _itemsSold.increment();

    //     // payable(owner).transfer(listingPrice);
    // }

      function createMarketSale(
        address nftContract,
        uint256 itemId
    ) public  nonReentrant{
        uint price =idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        

        // require(msg.value == price,"Please submit the asking price in order to complete the purchase");
        require(gameTokenAddress.balanceOf(msg.sender) >= price,"You dont have sufficient game tokens to buy the nft");

        //Externet transactions/interactions
        // idToMarketItem[itemId].seller.transfer(msg.value);
        address sellerAddress = idToMarketItem[itemId].seller;
        gameTokenAddress.transferFrom(msg.sender,sellerAddress,price);

        IERC721(nftContract).transferFrom(address(this),msg.sender,tokenId);

        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();

        // payable(owner).transfer(listingPrice);
    }



    function fetchMarketItems() public view returns (MarketItem[] memory ){
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i=0;i<itemCount;i++){
            if (idToMarketItem[i+1].owner == address(0)){
                uint currentId = idToMarketItem[i+1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }


    function fetchMyNFTs() public view returns (MarketItem[] memory ){
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0;i<totalItemCount;i++){
            if (idToMarketItem[i+1].owner == msg.sender){
                itemCount += 1;
            }
        }



        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i=0;i<totalItemCount;i++){
            if (idToMarketItem[i+1].owner == msg.sender){
                uint currentId = idToMarketItem[i+1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }




    function fetchItemsCreated() public view returns (MarketItem[] memory ){
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0;i<totalItemCount;i++){
            if (idToMarketItem[i+1].seller == msg.sender){
                itemCount += 1;
            }
        }



        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i=0;i<totalItemCount;i++){
            if (idToMarketItem[i+1].seller == msg.sender){
                uint currentId = idToMarketItem[i+1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }


    function setGameTokenAddress(address tokenAddress) external{
        require(msg.sender == owner,"Only owner can set the token address");
        gameTokenAddress = IERC20(address(tokenAddress));
    } 


    



}