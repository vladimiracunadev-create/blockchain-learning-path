// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract VulnerableReentrancy {
    mapping(address => uint256) public balance;
    function deposit() external payable { balance[msg.sender] += msg.value; }
    function withdraw() external {
        uint256 amount = balance[msg.sender];
        (bool ok,) = msg.sender.call{value: amount}("");
        require(ok);
        balance[msg.sender] = 0; // efecto demasiado tarde
    }
}

contract FixedReentrancy {
    mapping(address => uint256) public balance;
    bool private entered;
    function deposit() external payable { balance[msg.sender] += msg.value; }
    function withdraw() external {
        require(!entered);
        entered = true;
        uint256 amount = balance[msg.sender];
        balance[msg.sender] = 0;
        (bool ok,) = msg.sender.call{value: amount}("");
        require(ok);
        entered = false;
    }
}
