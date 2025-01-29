// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.28;

contract BuyMeACoffee {
    event SentCoffee(address indexed from, uint256 timestamp, string name, string message, uint256 amount);

    address payable private _owner;

    constructor() {
        _owner = payable(msg.sender);
    }

    receive() external payable {}

    function getOwner() public view returns(address) {
        return _owner;
    }

    function getBalance() private view returns(uint) {
        return address(this).balance;
    }

    function onlyOwner() private view {
        require(msg.sender == getOwner(), "Only the contract owner can call this function");
    }

    function withdrawAll() external {
        onlyOwner();

        (bool success, ) = _owner.call{value: getBalance()}("Withdrawing balance from smart contract!");

        require(success, "Withdraw failed");
    }

    function buyCoffee(string calldata name, string calldata message) external payable {
        require(msg.value > 0, "amount should be greater than zero");

        (bool success, ) = _owner.call{value: msg.value}("Buying coffee!");

        require(success, "Buying coffee failed");
        emit SentCoffee(msg.sender, block.timestamp, name, message, msg.value);
    }
}