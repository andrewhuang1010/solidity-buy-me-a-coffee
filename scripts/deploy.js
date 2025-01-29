async function main() {
    const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");

    const buy_me_a_coffee = await BuyMeACoffee.deploy();
    console.log("Contract deployed to address: ", buy_me_a_coffee.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });