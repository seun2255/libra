require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
      viaIR: true,
    },
  },
  networks: {
    matic: {
      url: "https://polygon-mumbai.infura.io/v3/deb2867c7bbe4471aacc26f7105b3702",
      accounts: [process.env.PRIVATE_KEY],
    },
    filecoin: {
      url: "https://api.calibration.node.glif.io/rpc/v1",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
