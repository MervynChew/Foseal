require("dotenv").config();
console.log("API_URL:", process.env.API_URL);
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // Enable the IR-based compiler pipeline to reduce "stack too deep" errors
    },
  },
  networks: {
    amoy: {
      url: process.env.API_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGON_KEY
    },
  },
};
