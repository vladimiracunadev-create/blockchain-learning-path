// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract ProxyLayoutV1 {
    address public owner; // slot 0
    uint256 public limit; // slot 1
}

contract UnsafeProxyLayoutV2 {
    uint256 public newValue; // desplaza owner y rompe compatibilidad
    address public owner;
    uint256 public limit;
}

contract AppendOnlyLayoutV2 {
    address public owner;
    uint256 public limit;
    uint256 public newValue; // agregar al final preserva slots anteriores en este ejemplo
}
