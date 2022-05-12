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


export default function CreatorDashboard(){
    const [nfts,setNfts] = useState([])
    const [sold,setSold] = useState([])

    const [loadingState,setLoadingState] = useState(true)

    useEffect(()=>{
        loadNfts()
    },[])


    async function loadNfts(){
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const tokenContract = new ethers.Contract(nftaddress,NFT.abi,provider)

        //Here we use signer to pass as provider, because in contract we are using msg.sender to extract the sender
        const marketContract = new ethers.Contract(nftmarketaddress,Market.abi,signer)
    
        const data = await marketContract.fetchItemsCreated()
    
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
            description:meta.data.description,
            sold:i.sold
          }
          return item
        }))
        // console.log("my owned items",items)
        const soldItems = items.filter(i => i.sold)
        console.log('my sold items',soldItems)
        setSold(soldItems)
        setNfts(items)
        setLoadingState(false)
      }

      if (!loadingState  && !nfts.length ) return (
        <h1 className="px-20 py-10 text-3xl text-white h-full bg-purple-900">
        No Assets owned!
      </h1>
      )

    return (
        <div >
            <div className="px-4 bg-purple-900 h-full" style={{maxWidth:"1600 px"}}>
                <h2 className="text-2xl py-2 text-white">Collectibles Minted</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    
                    {  
                        nfts.map((nft,i) =>{
                        return (
                            <div key={i} className="border shadow rounded-xl overflow-hidden bg-purple-600">
                                <img className="h-1/2 w-full " src={nft.image}/>
                                <div className="h-1/4 p-4">
                                <p style={{height:'64px'}} className="text-2xl font-semibold">
                                    {nft.name}
                                </p>
                                <div style={{height:'70px', overflow:"hidden"}}>
                                    <p className="text-gray-400"> {nft.description}</p>
                                </div> 
                                </div>
                                <div className="h-1/4 p-4 bg-black items-center">
                                    <p className="text-2xl mb-4 font-bold text-white">
                                    {nft.price} DGN
                                    </p>
                                    
                                </div>
                            </div>
                        )
                            
                        })
                    }
                </div>
            </div>

            <div className="px-4 bg-purple-900 h-full" style={{maxWidth:"1600 px"}}>
                
                    {  
                        (sold.length > 0) && (
                            <div>
                                <h2 className="text-2xl py-2 text-white">Collectibles Sold</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                                {  
                                    sold.map((nft,i) =>{
                                    return (
                                        <div key={i} className="bg-purple-600 border shadow rounded-xl overflow-hidden">
                                            <img className="h-1/2 w-full " src={nft.image}/>
                                            <div className="h-1/4 p-4">
                                            <p style={{height:'64px'}} className="text-2xl font-semibold">
                                    {nft.name}
                                </p>
                                <div style={{height:'70px', overflow:"hidden"}}>
                                    <p className="text-gray-400"> {nft.description}</p>
                                </div> 
                                </div>
                                <div className="h-1/4 p-4 bg-black items-center">
                                    <p className="text-2xl mb-4 font-bold text-white">
                                    {nft.price} DGN
                                    </p>
                                    
                                </div>
                                        </div>
                                    )
                                        
                                    })
                                }
                                </div>
                            </div>
                        )
                    }
                
            </div>
        </div>
      )
}