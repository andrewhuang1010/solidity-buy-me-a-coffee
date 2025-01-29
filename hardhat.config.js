/** @type import('hardhat/config').HardhatUserConfig */

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");

const { PRIVATE_KEY1, PRIVATE_KEY2, PRIVATE_KEY3, PRIVATE_KEY4 } = process.env;
const { SEPOLIA_API_URL, TEST_PRIVATE_KEY} = process.env;
const { MAIN_API_URL, MAIN_PRIVATE_KEY} = process.env;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [`0x${PRIVATE_KEY1}`, `0x${PRIVATE_KEY2}`, `0x${PRIVATE_KEY3}`, `0x${PRIVATE_KEY4}`],
    },
    sepolia: {
      url: SEPOLIA_API_URL,
      accounts: [`0x${TEST_PRIVATE_KEY}`],
    },
    mainnet: {
      url: MAIN_API_URL,
      accounts: [`0x${MAIN_PRIVATE_KEY}`],
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  }
};
