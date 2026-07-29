// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {ReplayLesson} from "../contracts/04-SignatureReplay.sol";

contract SignatureReplayTest is Test {
    address internal bob = address(0xB0B);

    function test_exploit_digestVulnerableEsReutilizable() public {
        ReplayLesson a = new ReplayLesson();
        ReplayLesson b = new ReplayLesson();

        // El digest vulnerable no ata cadena ni contrato: el mismo mensaje sirve en otro
        // contrato/cadena, por lo que una firma se puede repetir.
        bytes32 da = a.vulnerableDigest(bob, 1 ether);
        bytes32 db = b.vulnerableDigest(bob, 1 ether);
        assertEq(da, db, "digest sin dominio: replicable entre contratos");
    }

    function test_fixed_digestAtadoYConsumoUnico() public {
        ReplayLesson a = new ReplayLesson();

        bytes32 d1 = a.boundedDigest(bob, 1 ether, 1, block.timestamp + 1);
        bytes32 d2 = a.boundedDigest(bob, 1 ether, 2, block.timestamp + 1);
        assertTrue(d1 != d2, "el nonce cambia el digest");

        a.consume(d1);
        assertTrue(a.consumed(d1));

        vm.expectRevert();
        a.consume(d1); // no se puede volver a consumir
    }
}
