// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {GameAsset} from "../src/GameAsset.sol";

contract GameAssetTest is Test {
    GameAsset private asset;
    address private authority = makeAddr("authority");
    address private alice = makeAddr("alice");
    address private bob = makeAddr("bob");
    address private marketplace = makeAddr("marketplace");

    function setUp() public {
        asset = new GameAsset(authority, 2, "ipfs://andes-quest/");
    }

    function testOnlyAuthorityCanMint() public {
        vm.prank(authority);
        asset.mint(alice, 42);
        assertEq(asset.ownerOf(42), alice);
        assertEq(asset.totalSupply(), 1);
    }

    function testUnauthorizedMintIsRejected() public {
        vm.expectRevert(GameAsset.Unauthorized.selector);
        vm.prank(alice);
        asset.mint(alice, 42);
    }

    function testSupplyPolicyRejectsMintAboveCap() public {
        vm.startPrank(authority);
        asset.mint(alice, 1);
        asset.mint(bob, 2);
        vm.expectRevert(GameAsset.SupplyCapExceeded.selector);
        asset.mint(alice, 3);
        vm.stopPrank();
    }

    function testOwnerCanTransfer() public {
        vm.prank(authority);
        asset.mint(alice, 42);
        vm.prank(alice);
        asset.transferFrom(alice, bob, 42);
        assertEq(asset.ownerOf(42), bob);
        assertEq(asset.balanceOf(alice), 0);
        assertEq(asset.balanceOf(bob), 1);
    }

    function testInvalidTransferIsRejected() public {
        vm.prank(authority);
        asset.mint(alice, 42);
        vm.expectRevert(GameAsset.Unauthorized.selector);
        vm.prank(bob);
        asset.transferFrom(alice, bob, 42);
    }

    function testMetadataURI() public {
        vm.prank(authority);
        asset.mint(alice, 42);
        assertEq(asset.tokenURI(42), "ipfs://andes-quest/42.json");
    }

    function testPerTokenApproval() public {
        vm.prank(authority);
        asset.mint(alice, 42);
        vm.prank(alice);
        asset.approve(marketplace, 42);
        vm.prank(marketplace);
        asset.transferFrom(alice, bob, 42);
        assertEq(asset.ownerOf(42), bob);
        assertEq(asset.getApproved(42), address(0));
    }

    function testOperatorApproval() public {
        vm.prank(authority);
        asset.mint(alice, 42);
        vm.prank(alice);
        asset.setApprovalForAll(marketplace, true);
        vm.prank(marketplace);
        asset.transferFrom(alice, bob, 42);
        assertEq(asset.ownerOf(42), bob);
    }
}
