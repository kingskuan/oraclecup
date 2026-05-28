require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: false
    }
  },
  networks: {
    hardhat: {},
    xlayer: {
      url: process.env.XLAYER_RPC || "https://rpc.xlayer.tech",
      chainId: 196,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    xlayerTestnet: {
      url: process.env.XLAYER_TESTNET_RPC || "https://testrpc.xlayer.tech",
      chainId: 195,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
