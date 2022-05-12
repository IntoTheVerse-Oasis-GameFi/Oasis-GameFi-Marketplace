import {ethers} from 'ethers'
import { useEffect,useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {
  nftaddress,
  nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import Token from '../artifacts/contracts/VerseToken.sol/VerseToken.json'
import { byteCode } from '../verseToken'


export default function Home() {

  const [nfts,setNfts] = useState([])
  const [loadingState,setLoadingState] = useState(true)

  useEffect(()=>{
    loadNfts()
  },[])

  async function loadNfts(){
    const provider = new ethers.providers.JsonRpcProvider("https://testnet.emerald.oasis.dev")
    const tokenContract = new ethers.Contract(nftaddress,NFT.abi,provider)
    const marketContract = new ethers.Contract(nftmarketaddress,Market.abi,provider)

    const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(data.map(async i => {
      
      const tokenUri = await tokenContract.tokenURI( i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(),"ether")
      let item = {
        price ,
        tokenId : i.tokenId.toString(),
        seller:i.seller,
        owner:i.owner,
        image:meta.data.image,
        name:meta.data.name,
        description:meta.data.description
      }
      return item
    }))
    console.log(items)
    setNfts(items)
    setLoadingState(false)
  }

  async function buyNft(nft){
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)

    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress,Market.abi,signer)
    const price = ethers.utils.parseUnits(nft.price.toString(),'ether')

    // const transaction = await contract.createMarketSale(nftaddress,nft.tokenId,{
    //   value:price
    // })
    const verseToken = new ethers.Contract("0x334D0512a87f6549fAAffD7325F2b9cE8449B416",byteCode,signer)
    await verseToken.approve(nftmarketaddress,price)
    const transaction = await contract.createMarketSale(nftaddress,nft.tokenId)

    await transaction.wait()

    loadNfts()
  }

  if (!loadingState && nfts.length == 0) return (
    <h1 className="px-20 py-10 text-3xl text-white bg-purple-900 h-screen">
      No items in the marketplace!
    </h1>
  )

  

  return (
    <div className="flex justify-center bg-purple-900 h-full">
        <div className="px-4" style={{maxWidth:"1600 px"}}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {
                
                nfts.map((nft,i) =>{
                  return (
                    <div key={i} className="border bg-purple-500 shadow rounded-xl overflow-hidden">
                        <img src={nft.image}/>
                        <div className="p-4">
                          <p style={{height:'64px'}} className="textcolor text-white font-semibold">
                            {nft.name}
                          </p>
                          <div style={{height:'70px', overflow:"hidden"}}>
                            <p className="text-700 text-white"> {nft.description}</p>
                          </div> 
                        </div>
                        <div className="p-4 bg-black">
                            <p className="text-2xl mb-4 font-bold text-white">
                              {nft.price} DGN
                            </p>
                            <button className="w-full bg-purple-500 text-white font-bold py-2 px-12 rounded"
                              onClick={()=> buyNft(nft)}
                            >
                              Buy 
                            </button>
                        </div>
                    </div>
                  )
                    
                })
              }
          </div>

        </div>
    </div>
  )
}
