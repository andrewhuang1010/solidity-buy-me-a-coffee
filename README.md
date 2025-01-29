# solidity-buy-me-a-coffee

Buy me a coffee project written in solidity.

Deploys a smart contract using Hardhat/Alchemy to the Ethereum blockchain (or Sepolia testnet)

## Description

Smart contract allows others to buy me a coffee (make a donation). This is sent directly to the contract owner's address.

Also allows sending Ether to the contract and withdrawing the entire balance to the contract owner's address.


## Commands

Compile the project
>npx hardhat compile

Run deploy script to deploy smart contract to the sepolia testnet. Returns the deployed contract address
>npx hardhat run scripts/deploy.js --network sepolia

Verify the contract on etherscan.io
(Everyone is able to see the contract details once verified)
>npx hardhat verify --network sepolia CONTRACT_ADDRESS

## Links

Smart Contract address on Sepolia testnet
>https://sepolia.etherscan.io/address/0xc1a6726838551D0cE38324dbDD1149136f6b1C59
