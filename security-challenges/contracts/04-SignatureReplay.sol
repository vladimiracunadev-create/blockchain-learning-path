// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract ReplayLesson {
    mapping(bytes32 => bool) public consumed;

    function vulnerableDigest(address recipient, uint256 amount) external pure returns (bytes32) {
        return keccak256(abi.encode(recipient, amount)); // faltan dominio, nonce y expiración
    }

    function boundedDigest(address recipient, uint256 amount, uint256 nonce, uint256 deadline)
        external
        view
        returns (bytes32)
    {
        return keccak256(abi.encode(block.chainid, address(this), recipient, amount, nonce, deadline));
    }

    function consume(bytes32 digest) external {
        require(!consumed[digest]);
        consumed[digest] = true;
    }
}
