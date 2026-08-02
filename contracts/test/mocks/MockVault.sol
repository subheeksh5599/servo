// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice Minimal ERC4626 stand-in (mint-on-deposit, growing rate).
contract MockVault {
    IERC20 public immutable asset;
    uint256 public totalAssets_;
    uint256 public totalShares;
    uint256 public rateBps = 10_000; // 1.0000

    constructor(IERC20 _asset) {
        asset = _asset;
    }

    function setRateBps(uint256 _rateBps) external {
        rateBps = _rateBps;
    }

    function convertToAssets(uint256 _shares) external view returns (uint256) {
        return _shares * rateBps / 10_000;
    }

    function deposit(uint256 _assets, address _receiver) external returns (uint256 shares) {
        asset.transferFrom(msg.sender, address(this), _assets);
        shares = totalShares == 0
            ? _assets
            : _assets * totalShares / totalAssets_;
        totalAssets_ += _assets;
        totalShares += shares;
        balances[_receiver] += shares;
    }

    mapping(address => uint256) internal balances;

    function balanceOf(address _u) external view returns (uint256) {
        return balances[_u];
    }
}
