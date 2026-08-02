// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @notice Minimal FXRP stand-in for tests.
contract MockERC20 is ERC20 {
    constructor() ERC20("Mock FXRP", "mFXRP") {}

    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }
}
