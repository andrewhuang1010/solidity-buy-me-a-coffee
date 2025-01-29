const { ethers } = require("hardhat");

async function getBalance(address) {
    const balanceBigInt = await ethers.provider.getBalance(address);
    return ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
    for (const [index, address] of addresses.entries()) {
        console.log("Address ", index, " balance: ", await getBalance(address));
    }
}

async function main() {
    const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();
    console.log("owner: ", owner.address);
    console.log("tipper: ", tipper.address);
    const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();
    await buyMeACoffee.deployed();
    console.log("BuyMeACoffee deployed to:", buyMeACoffee.address);
    const addresses = [owner.address, tipper.address, tipper2.address, tipper3.address, buyMeACoffee.address];

    console.log("== start ==");
    await printBalances(addresses);

    console.log("== buying coffee ==");
    const tip = { value: ethers.utils.parseEther("1") };
    const tip2 = { value: ethers.utils.parseEther("0.000001") };
    await buyMeACoffee.connect(tipper).buyCoffee("A", "Cheers!", tip);
    await buyMeACoffee.connect(tipper2).buyCoffee("B", "You're the best!", tip2);
    await printBalances(addresses);

    console.log("== sending eth directly to contract ==");
    const tip3 = ethers.utils.parseEther("5");
    await tipper3.sendTransaction({ to: buyMeACoffee.address, value: tip3 });
    await printBalances(addresses);

    console.log("== withdrawing balance from smart contract ==");
    await buyMeACoffee.withdrawAll();
    await printBalances(addresses);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });