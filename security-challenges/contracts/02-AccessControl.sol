// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract VulnerableAccess {
    address public owner;
    constructor() { owner = msg.sender; }
    function setOwner(address next) external { owner = next; }
}

contract FixedAccess {
    address public owner;
    address public pendingOwner;
    constructor() { owner = msg.sender; }
    function proposeOwner(address next) external {
        require(msg.sender == owner && next != address(0));
        pendingOwner = next;
    }
    function acceptOwner() external {
        require(msg.sender == pendingOwner);
        owner = pendingOwner;
        pendingOwner = address(0);
    }
}
