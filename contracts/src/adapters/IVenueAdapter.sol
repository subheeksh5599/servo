// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title IVenueAdapter
/// @notice Interface for yield-venue adapters (Firelight, Kinetic,
///         Clearstar/Upshift, ...). Adapters are the ONLY contracts that touch
///         external venues, so the controller stays venue-agnostic.
interface IVenueAdapter {
    /// @notice Name of the venue, e.g. "Firelight stXRP".
    function venueName() external view returns (string memory);

    /// @notice Route FXRP into the venue on behalf of the user.
    /// @param _fxrp The FXRP token (caller guarantees it is the real one).
    /// @param _amountDrops Amount in FXRP base units.
    /// @param _user The user the position is credited to.
    function deposit(IERC20 _fxrp, uint256 _amountDrops, address _user) external;

    /// @notice Realized exchange rate / share price (USD per unit, 1e18).
    ///         Used by the off-chain indexer to compute realized APY.
    function exchangeRate() external view returns (uint256);
}
