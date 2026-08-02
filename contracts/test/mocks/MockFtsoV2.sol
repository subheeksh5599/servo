// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Test double for FtsoV2. Mirrors the view getter Servo uses.
contract MockFtsoV2 {
    uint256 public value;
    int8 public decimals;
    uint64 public timestamp;

    function setFeed(uint256 _value, int8 _decimals, uint64 _timestamp) external {
        value = _value;
        decimals = _decimals;
        timestamp = _timestamp;
    }

    function getFeedById(bytes21) external view returns (uint256, int8, uint64) {
        return (value, decimals, timestamp);
    }
}
