// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {UnsafeProxyLayoutV2, AppendOnlyLayoutV2} from "../contracts/06-StorageCollision.sol";

contract StorageCollisionTest is Test {
    // El estado guardado por la V1 tiene `owner` en el slot 0.
    address internal realOwner = address(0xBEEF);

    function test_exploit_layoutInseguroCorrompeOwner() public {
        UnsafeProxyLayoutV2 v2 = new UnsafeProxyLayoutV2();
        // Simulamos el slot 0 escrito por la V1 (owner).
        vm.store(address(v2), bytes32(uint256(0)), bytes32(uint256(uint160(realOwner))));

        // En la V2 insegura, el slot 0 es `newValue`, no `owner`: se lee mal.
        assertTrue(v2.owner() != realOwner, "layout desplazado: owner corrupto");
        assertEq(v2.newValue(), uint256(uint160(realOwner)), "el slot 0 paso a ser newValue");
    }

    function test_appendOnly_preservaLosSlots() public {
        AppendOnlyLayoutV2 v2 = new AppendOnlyLayoutV2();
        vm.store(address(v2), bytes32(uint256(0)), bytes32(uint256(uint160(realOwner))));

        // Agregar variables solo al final conserva los slots anteriores.
        assertEq(v2.owner(), realOwner, "owner se preserva en el slot 0");
    }
}
