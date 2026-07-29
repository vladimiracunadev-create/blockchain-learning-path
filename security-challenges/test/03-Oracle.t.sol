// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {VulnerableOracleConsumer, GuardedOracleConsumer, ISpotPool} from "../contracts/03-Oracle.sol";

// Pool de precio spot manipulable (p. ej. por un flash loan sobre un AMM de baja liquidez).
contract MockPool is ISpotPool {
    uint256 private price;

    function set(uint256 p) external {
        price = p;
    }

    function spotPrice() external view returns (uint256) {
        return price;
    }
}

contract OracleTest is Test {
    function test_exploit_precioSpotManipulable() public {
        MockPool pool = new MockPool();
        pool.set(100);
        VulnerableOracleConsumer c = new VulnerableOracleConsumer(pool);

        uint256 honesto = c.collateralValue(1e18);
        pool.set(100_000); // el atacante infla el precio spot
        uint256 manipulado = c.collateralValue(1e18);

        assertGt(manipulado, honesto * 100, "una sola fuente puntual se manipula sin limite");
    }

    function test_guarded_rechazaPrecioObsoleto() public {
        GuardedOracleConsumer g = new GuardedOracleConsumer(3600);
        vm.warp(10_000);

        // un precio fresco pasa
        assertEq(g.value(1e18, 100, block.timestamp), 1e18 * 100);

        // un precio mas viejo que maxAge se rechaza
        vm.expectRevert(bytes("stale"));
        g.value(1e18, 100, block.timestamp - 4000);
    }
}
