// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Script} from "forge-std/Script.sol";
import {CommunityFunding} from "../src/CommunityFunding.sol";

contract DeployCommunityFunding is Script {
    function run() external returns (CommunityFunding funding) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);
        funding = new CommunityFunding();
        vm.stopBroadcast();
    }
}
