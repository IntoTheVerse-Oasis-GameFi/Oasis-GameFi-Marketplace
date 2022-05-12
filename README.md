# QuestForOasis Marketplace

This is the place to shop your game assets using the DGN game token and later use these to equip the purchased heroes inside the dungeon based QuestForOasis Game. You can obtain DGN (Game Native Token) token by swapping an equivalent amount of ROSE on the swap inside our Metaverse.

<img width="1435" alt="image" src="https://user-images.githubusercontent.com/43913734/168139519-234e0956-11d6-4d43-add6-a665a18c46db.png">
<img width="1440" alt="image" src="https://user-images.githubusercontent.com/43913734/168139758-c51891e3-1af5-49ec-9a50-b0bee0a2641c.png">

# Smart Contracts Deployed to Emerald Paratime Network
`nftaddress = "0xD493fBE541130c9414d4DFF4f714357ffd8F6ec8"` 

[Verify Here on Emereal Paratime testnet explorer](https://testnet.explorer.emerald.oasis.dev/address/0xD493fBE541130c9414d4DFF4f714357ffd8F6ec8/transactions)

`nftmarketaddress ="0x1a6451B4E9dDC3f9EEa54Eb2Dd93eC4CA6daA660"`

[Verify Here on Emereal Paratime testnet explorer](https://testnet.explorer.emerald.oasis.dev/address/0x1a6451B4E9dDC3f9EEa54Eb2Dd93eC4CA6daA660/transactions)

<img width="1440" alt="image" src="https://user-images.githubusercontent.com/43913734/168140642-b10bca31-5c71-4435-815e-748f259201d9.png">

Refer to `hardhat.config.js`:

`module.exports = {
  defaultNetwork: "alfajores",
  networks: {
    localhost: {
        url: "http://127.0.0.1:7545"
    },
    emerald_local: {
      url: "http://localhost:8545",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    emerald_testnet: {
      url: "https://testnet.emerald.oasis.dev",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    emerald_mainnet: {
      url: "https://emerald.oasis.dev",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    }   
  },
  solidity: "0.8.4",
  mocha: {
    timeout: 600000
  }
};`


# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
