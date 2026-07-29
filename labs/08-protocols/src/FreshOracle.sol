// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract FreshOracle {
    address public immutable updater;
    uint256 public immutable maxAge;
    uint256 public price;
    uint256 public updatedAt;

    error Unauthorized();
    error InvalidPrice();
    error StalePrice(uint256 updatedAt, uint256 currentTime);

    event PriceUpdated(uint256 price, uint256 updatedAt);

    constructor(address authorizedUpdater, uint256 maximumAge) {
        if (authorizedUpdater == address(0) || maximumAge == 0) revert InvalidPrice();
        updater = authorizedUpdater;
        maxAge = maximumAge;
    }

    function update(uint256 nextPrice) external {
        if (msg.sender != updater) revert Unauthorized();
        if (nextPrice == 0) revert InvalidPrice();
        price = nextPrice;
        updatedAt = block.timestamp;
        emit PriceUpdated(nextPrice, block.timestamp);
    }

    function read() external view returns (uint256) {
        if (price == 0 || block.timestamp > updatedAt + maxAge) {
            revert StalePrice(updatedAt, block.timestamp);
        }
        return price;
    }
}
