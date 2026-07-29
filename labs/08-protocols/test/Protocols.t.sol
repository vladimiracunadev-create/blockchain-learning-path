// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {CourseToken} from "../src/CourseToken.sol";
import {FreshOracle} from "../src/FreshOracle.sol";
import {SimpleGovernor} from "../src/SimpleGovernor.sol";

contract GovernedTarget {
    uint256 public value;
    function setValue(uint256 next) external { value = next; }
}

contract ProtocolsTest is Test {
    address private alice = makeAddr("alice");
    address private bob = makeAddr("bob");

    function testTokenCapAndTransfer() public {
        CourseToken token = new CourseToken(100 ether);
        token.mint(alice, 50 ether);
        vm.prank(alice);
        token.transfer(bob, 10 ether);
        assertEq(token.balanceOf(bob), 10 ether);
        vm.expectRevert(CourseToken.CapExceeded.selector);
        token.mint(alice, 51 ether);
    }

    function testOracleRejectsStalePrice() public {
        FreshOracle oracle = new FreshOracle(alice, 1 hours);
        vm.prank(alice);
        oracle.update(2_000e8);
        assertEq(oracle.read(), 2_000e8);
        vm.warp(block.timestamp + 1 hours + 1);
        vm.expectRevert();
        oracle.read();
    }

    function testGovernorVotesWaitsAndExecutes() public {
        address[] memory voters = new address[](2);
        voters[0] = alice;
        voters[1] = bob;
        uint256[] memory weights = new uint256[](2);
        weights[0] = 60;
        weights[1] = 40;
        SimpleGovernor governor = new SimpleGovernor(voters, weights, 60, 3 days, 2 days);
        GovernedTarget target = new GovernedTarget();
        bytes memory data = abi.encodeCall(target.setValue, (42));
        vm.prank(alice);
        uint256 id = governor.propose(address(target), data);
        vm.prank(alice);
        governor.vote(id, true);
        vm.warp(block.timestamp + 5 days + 1);
        governor.execute(id);
        assertEq(target.value(), 42);
    }
}
