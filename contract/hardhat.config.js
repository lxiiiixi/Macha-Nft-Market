require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
require("@nomicfoundation/hardhat-verify");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  networks: {
    "base-goerli": {
      url: `https://base-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API}`,
      accounts: [process.env.PRIVATE_KEY], // 0x037B83c8C7E8169565B8E14C03aeCF1855428de1
      gasPrice: 1000000000,
    }
  },
  etherscan: {
    apiKey: process.env.PRIVATE_KEY
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true
  }
};
