// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract LearningVault {
    mapping(address account => uint256 amount) public balances;
    bool private entered;

    error ZeroDeposit();
    error InsufficientBalance(uint256 requested, uint256 available);
    error TransferFailed();
    error Reentrancy();

    event Deposited(address indexed account, uint256 amount);
    event Withdrawn(address indexed account, uint256 amount);

    modifier nonReentrant() {
        if (entered) revert Reentrancy();
        entered = true;
        _;
        entered = false;
    }

    function deposit() external payable {
        if (msg.value == 0) revert ZeroDeposit();
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external nonReentrant {
        uint256 available = balances[msg.sender];
        if (amount > available) revert InsufficientBalance(amount, available);

        balances[msg.sender] = available - amount;
        (bool success,) = msg.sender.call{value: amount}("");
        if (!success) revert TransferFailed();

        emit Withdrawn(msg.sender, amount);
    }
}
