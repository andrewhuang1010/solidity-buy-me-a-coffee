const alchemyKey = "wss://eth-sepolia.g.alchemy.com/v2/qitzveWa6MD4z0cRv_LHr6aqg6XHG_lQ";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
const contractABI = require("../contract-abi.json");
const contractAddress = "0xc1a6726838551D0cE38324dbDD1149136f6b1C59";

export const buyMeACoffeeContract = new web3.eth.Contract(
    contractABI,
    contractAddress
);

export const loadOwnerAddress = async () => { 
    return {
        address: await buyMeACoffeeContract.methods.getOwner().call(),
    }
};

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
        const addressArray = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        const obj = {
            status: "👆🏽 Write a message in the text-field above.",
            address: addressArray[0],
        };
        return obj;
    }
    catch (err) {
        return {
            address: "",
            status: "😥 " + err.message,
        };
    }
  }
  else {
    return {
        address: "",
        status: (
            <span>
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" href={`https://metamask.io/download`}>
                        You must install Metamask, a virtual Ethereum wallet, in your browser.
                    </a>
                </p>
            </span>
        ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
        const addressArray = await window.ethereum.request({
            method: "eth_accounts",
        });
        if (addressArray.length > 0) {
            return {
                address: addressArray[0],
                status: "Connected!",
            };
        }
        else {
            return {
                address: "",
                status: "🦊 Connect to Metamask using the top right button.",
            };
        }
    }
    catch (err) {
        return {
            address: "",
            status: "😥 " + err.message,
        };
    }
  }
  else {
    return {
        address: "",
        status: (
            <span>
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" href={`https://metamask.io/download`}>
                        You must install Metamask, a virtual Ethereum wallet, in your browser.
                    </a>
                </p>
            </span>
        ),
    };
  }
};

export const buyCoffee = async (address, name, message, amount, currency) => {
    if (!window.ethereum || address === null) {
        return {
            status:
            "💡 Connect your Metamask wallet to update the message on the blockchain.",
        };
    }

    let mult = 1;
    switch(currency) {
        case "Eth":
            mult *= 1000000000;
        case "Gwei":
            mult *= 1000000000;
        case "Wei":
        default:
            break;
    }

    //set up transcation parameters
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: address, // must match user's active address.
        data: buyMeACoffeeContract.methods.buyCoffee(name, message).encodeABI(),
        value: "0x" + (amount*mult).toString(16), // hex
    };

    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" href={`https://sepolia.etherscan.io/tx/${txHash}`}>
                        View the status of your transaction on Etherscan!
                    </a>
                    <br />
                    ℹ️ Once the transaction is verified by the network, the message will
                    be updated automatically.
                </span>
            ),
        }
    }
    catch (error) {
        return {
            status: "😥 " + error.message,
        };
    }
};
