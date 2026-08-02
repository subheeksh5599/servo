// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {StandingOrderRegistry} from "../src/StandingOrderRegistry.sol";

/// @notice Read-only: dump all orders from a deployed registry.
///   forge script script/Inspect.s.sol --rpc-url $COSTON2_RPC -vv
contract Inspect is Script {
    function run() external view {
        address reg = vm.envAddress("REGISTRY");
        StandingOrderRegistry registry = StandingOrderRegistry(reg);
        uint256 n = registry.orderCount();
        console2.log("orders:", n);
        for (uint256 i = 1; i <= n; i++) {
            StandingOrderRegistry.StandingOrder memory o = registry.getOrder(i);
            console2.log("order", i);
            console2.log("amount", o.amountDrops);
            console2.log("cadence", o.cadenceSeconds);
            console2.log("venue", o.venueId);
            console2.log("next", o.nextExecutionAt);
            console2.log("executed", o.totalExecutedDrops);
            console2.log("count", o.executionCount);
            console2.log("active", o.active);
        }
    }
}
