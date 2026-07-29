// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {LearningVault} from "../src/LearningVault.sol";

contract LearningVaultTest is Test {
    LearningVault private vault;
    address private learner = makeAddr("learner");

    function setUp() public {
        vault = new LearningVault();
        vm.deal(learner, 10 ether);
    }

    function testDepositAndWithdraw() public {
        vm.startPrank(learner);
        vault.deposit{value: 2 ether}();
        vault.withdraw(1 ether);
        vm.stopPrank();
        assertEq(vault.balances(learner), 1 ether);
    }

    function testFuzzCannotWithdrawMoreThanBalance(uint96 deposit, uint96 extra) public {
        vm.assume(deposit > 0 && extra > 0);
        vm.deal(learner, deposit);
        vm.prank(learner);
        vault.deposit{value: deposit}();
        vm.expectRevert();
        vm.prank(learner);
        vault.withdraw(uint256(deposit) + extra);
    }
}
