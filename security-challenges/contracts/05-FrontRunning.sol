// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract VulnerableQuiz {
    uint256 public reward;
    bytes32 private answerHash;
    constructor(bytes32 expected) payable { answerHash = expected; reward = msg.value; }
    function answer(string calldata plain) external {
        require(keccak256(bytes(plain)) == answerHash);
        reward = 0;
        payable(msg.sender).transfer(address(this).balance);
    }
}

contract CommitRevealQuiz {
    mapping(address => bytes32) public commitments;
    function commit(bytes32 commitment) external { commitments[msg.sender] = commitment; }
    function reveal(string calldata plain, bytes32 salt) external view returns (bool) {
        return commitments[msg.sender] == keccak256(abi.encode(msg.sender, plain, salt));
    }
}
