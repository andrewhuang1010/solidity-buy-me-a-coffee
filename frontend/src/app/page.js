"use client"

import React from "react";
import ReactDOM from 'react-dom';
import { useEffect, useState } from "react";
import "./global.css";
import {
  buyCoffee,
  buyMeACoffeeContract,
  connectWallet,
  getCurrentWalletConnected,
  loadOwnerAddress,
} from "./util/interact.js";

import coffeeImg from "./coffee.png";
import { $dispatcherGuard } from "react-compiler-runtime";

const BuyMeACoffee = () => {
  //state variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [contractOwner, setOwner] = useState("");
  const [coffeePrice, setCoffeePrice] = useState(0);
  const [currency, setCurrency] = useState("Eth");
  const [blockchain, setBlockchain] = useState("Sepolia testnet");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const send = "Send";
  const about = "About";

  //called only once
  useEffect(() => {
    async function getOwnerAddress() {
      const {address} = await loadOwnerAddress();
      setOwner(address);
    }
    getOwnerAddress();
    addSmartContractListener();

    async function fetchWallet() {
      const {address, status} = await getCurrentWalletConnected();
      setWallet(address);
      setStatus(status);
    }
    fetchWallet();
    addWalletListener();
  }, []);

  function addSmartContractListener() {
    buyMeACoffeeContract.events.SentCoffee({
      filter: {from: walletAddress}
    }, (error, data) => {
      if (error) {
        setStatus(error.message);
      }
      else {
        setStatus("Thanks for the coffee" + (data.returnValues.name.length > 0 ? (", " + data.returnValues.name) : "") + "!");
      }
    });
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("Changed wallet to " + accounts[0]);
        }
        else {
          setWallet("");
          setStatus("Connect to Metamask using the top right button.");
        }
      });
    }
    else {
      setStatus(
        <p>
          <a target="_blank" href={`https://metamask.io/download`}>
            You must install Metamask, a virtual Ethereum wallet, in your browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const sendPressed = async () => {
    const sendResponse = await buyCoffee(walletAddress, name, message, coffeePrice, currency);
    setStatus(sendResponse.status);
  };

  const aboutPressed = async () => {};

  //the UI of our component
  return (
    <div id="container">
      <header>
      <img id="logo" src={coffeeImg}></img>
      <p id="title">Buy Me A Coffee!</p>
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
      </header>

      <div id="body">
        <input
          type="number"
          placeholder="Amount to send"
          onChange={(e) => setCoffeePrice(e.target.valueAsNumber??0)}
          value={coffeePrice}
          min="0"
        />
        <label>
          <select id="currencies" onChange={(e) => setCurrency(e.target.value)}>
            <option value="Eth">Eth</option>
            <option value="Gwei">Gwei</option>
            <option value="Wei">Wei</option>
          </select>
        </label>
        <label>
          <select id="blockchains" onChange={(e) => setBlockchain(e.target.value)}>
            <option value="Sepolia Testnet">Sepolia Testnet</option>
            <option value="Ethereum Mainnet">Ethereum Mainnet</option>
            <option value="Base">Base</option>
          </select>
        </label>
        <input
          type="text"
          placeholder="Name (Optional)"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          type="text"
          placeholder="Message (Optional)"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button id="send" onClick={sendPressed}>{send} {coffeePrice} {currency} on {blockchain}</button>
        <p id="status">{status}</p>
      </div>

      <button id="about" onClick={aboutPressed}>{about}</button>
    </div>
  );
};

export default BuyMeACoffee;
