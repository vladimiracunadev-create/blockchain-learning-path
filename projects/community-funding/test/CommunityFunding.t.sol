// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {CommunityFunding} from "../src/CommunityFunding.sol";

contract CommunityFundingTest is Test {
    CommunityFunding private funding;
    address private creator = makeAddr("creator");
    address private backer = makeAddr("backer");

    function setUp() public {
        funding = new CommunityFunding();
        vm.deal(backer, 100 ether);
    }

    function _create(uint128 goal) private returns (uint256) {
        vm.prank(creator);
        return funding.createCampaign(goal, uint64(block.timestamp + 7 days));
    }

    function testSuccessfulCampaign() public {
        uint256 id = _create(5 ether);
        vm.prank(backer);
        funding.contribute{value: 5 ether}(id);
        vm.warp(block.timestamp + 8 days);
        uint256 beforeBalance = creator.balance;
        vm.prank(creator);
        funding.claim(id);
        assertEq(creator.balance - beforeBalance, 5 ether);
    }

    function testRefundsWhenCampaignFails() public {
        uint256 id = _create(5 ether);
        vm.prank(backer);
        funding.contribute{value: 2 ether}(id);
        vm.warp(block.timestamp + 8 days);
        vm.prank(backer);
        funding.refund(id);
        assertEq(funding.contributions(id, backer), 0);
    }

    function testFuzzContributionAccounting(uint96 amount) public {
        vm.assume(amount > 0);
        vm.deal(backer, amount);
        uint256 id = _create(type(uint128).max);
        vm.prank(backer);
        funding.contribute{value: amount}(id);
        (,,, uint128 pledged,) = funding.campaigns(id);
        assertEq(pledged, amount);
        assertEq(funding.contributions(id, backer), amount);
    }
}
