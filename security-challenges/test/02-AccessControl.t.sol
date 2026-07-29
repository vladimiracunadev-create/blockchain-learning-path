// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {VulnerableAccess, FixedAccess} from "../contracts/02-AccessControl.sol";

contract AccessControlTest is Test {
    address internal attacker = address(0xBAD);
    address internal bob = address(0xB0B);

    function test_exploit_cualquieraRobaLaPropiedad() public {
        VulnerableAccess t = new VulnerableAccess();
        assertEq(t.owner(), address(this));

        vm.prank(attacker);
        t.setOwner(attacker); // no hay control de acceso

        assertEq(t.owner(), attacker, "cualquiera puede tomar la propiedad");
    }

    function test_fixed_rechazaNoDuenoYUsaDosPasos() public {
        FixedAccess t = new FixedAccess();

        // un tercero no puede proponer
        vm.prank(attacker);
        vm.expectRevert();
        t.proposeOwner(attacker);

        // el dueno propone y el nuevo debe aceptar (transferencia en dos pasos)
        t.proposeOwner(bob);
        assertEq(t.owner(), address(this), "aun no cambia hasta la aceptacion");
        vm.prank(bob);
        t.acceptOwner();
        assertEq(t.owner(), bob);
    }
}
