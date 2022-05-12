const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("NFT Market", function () {
  it("Should create and execute market sales", async function () {
    console.log("hey")
    const Market = await ethers.getContractFactory("NFTMarket")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    console.log(marketAddress)

    const NFT = await ethers.getContractFactory('NFT')
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftAddress = nft.address

    let listingPrice = await market.getListingPrice()

    listingPrice = listingPrice.toString()

    console.log(listingPrice)
    
    const auctionPrice = ethers.utils.parseUnits("10","ether")//price for the nft in OASIS Emerald Paratime network

    await nft.createToken("https://www.token1location.com")
    await nft.createToken("https://www.token2location.com")


    await market.createMarketItem(nftAddress,1,auctionPrice,{value:listingPrice})
    await market.createMarketItem(nftAddress,2,auctionPrice,{value:listingPrice})

    //We are ignoring the first address because that is used for deployment.so,we move on to the second address
    //This is for specyfying different buyer and seller address
    const [_,buyerAddress] = await ethers.getSigners()
    await market.connect(buyerAddress).createMarketSale(nftAddress,1)


    let items = await market.fetchMarketItems()

    items = await Promise.all(items.map(async i => {
      
      const tokenUri = await nft.tokenURI( i.tokenId)
      let item = {
        price : i.price.toString(),
        tokenId : i.tokenId.toString(),
        seller:i.seller,
        owner:i.owner,
        tokenUri
      }
      return item
    }))

    console.log(items)


  });
});
