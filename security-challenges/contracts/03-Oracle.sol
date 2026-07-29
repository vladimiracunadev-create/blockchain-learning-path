// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

interface ISpotPool {
    function spotPrice() external view returns (uint256);
}

contract VulnerableOracleConsumer {
    ISpotPool public immutable pool;
    constructor(ISpotPool source) { pool = source; }
    function collateralValue(uint256 amount) external view returns (uint256) {
        return amount * pool.spotPrice(); // una sola fuente puntual manipulable
    }
}

contract GuardedOracleConsumer {
    uint256 public immutable maxAge;
    constructor(uint256 age) { maxAge = age; }
    function value(uint256 amount, uint256 price, uint256 updatedAt) external view returns (uint256) {
        require(price > 0 && block.timestamp - updatedAt <= maxAge, "stale");
        return amount * price;
    }
}
