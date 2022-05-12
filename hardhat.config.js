require("@nomiclabs/hardhat-waffle");
require('dotenv').config({path: '.env'});
require('hardhat-deploy');

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

// Prints the Celo accounts associated with the mnemonic in .env
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
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
    },
    // alfajores: {
    //   url: "https://alfajores-forno.celo-testnet.org",
    //   accounts: {
    //     mnemonic: process.env.MNEMONIC,
    //     path: "m/44'/52752'/0'/0"
    //   },
    //   //chainId: 44787
    // },
    // celo: {
    //   url: "https://forno.celo.org",
    //   accounts: {
    //     mnemonic: process.env.MNEMONIC,
    //     path: "m/44'/52752'/0'/0"
    //   },
    //   chainId: 42220
    // },     
  },
  solidity: "0.8.4",
  mocha: {
    timeout: 600000
  }
};