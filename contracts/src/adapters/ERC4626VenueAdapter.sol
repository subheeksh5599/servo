// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IVenueAdapter} from "./IVenueAdapter.sol";

/// @notice Minimal ERC4626 surface used by the venue vaults (Firelight-style
///         stXRP / earnXRP vaults on Coston2 expose convertToAssets).
interface IERC4626View {
    function convertToAssets(uint256 _shares) external view returns (uint256);
    function deposit(uint256 _assets, address _receiver) external returns (uint256);
}

/// @title ERC4626VenueAdapter
/// @notice Routes FXRP into an ERC4626 yield vault (stXRP / earnXRP) and
///         exposes the realized exchange rate (convertToAssets(1e18)) that
///         the off-chain indexer turns into realized APY.
contract ERC4626VenueAdapter is IVenueAdapter {
    IERC4626View public immutable vault;
    string public venueName;

    event Deposited(address indexed user, uint256 assets, uint256 shares);

    constructor(address _vault, string memory _name) {
        vault = IERC4626View(_vault);
        venueName = _name;
    }

    /// @inheritdoc IVenueAdapter
    function deposit(IERC20 _fxrp, uint256 _amountDrops, address _user) external {
        // FXRP arrives at this adapter pre-funded by the controller.
        _fxrp.approve(address(vault), _amountDrops);
        uint256 shares = vault.deposit(_amountDrops, _user);
        emit Deposited(_user, _amountDrops, shares);
    }

    /// @inheritdoc IVenueAdapter
    function exchangeRate() external view returns (uint256) {
        return vault.convertToAssets(1e18);
    }
}
