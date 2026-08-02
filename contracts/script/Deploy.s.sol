// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {StandingOrderRegistry} from "../src/StandingOrderRegistry.sol";
import {ExecutionController} from "../src/ExecutionController.sol";
import {ERC4626VenueAdapter} from "../src/adapters/ERC4626VenueAdapter.sol";

/// @notice Deploy + wire Servo on Coston2 (or mainnet with env overrides).
///
/// Usage:
///   forge script script/Deploy.s.sol --rpc-url $COSTON2_RPC \
///     --private-key $RELAYER_PK --broadcast
///
/// Env overrides (defaults = Coston2 testnet):
///   FXRP=0x0b6A3645c240605887a5532109323A3E12273dc7
///   VENUE_STXRP=0x4066A1363a04ce3B23eEcB53dEfa65f94A24355E
///   VENUE_EARNXRP=0xF97B2bBdB2f4a561806e5038a503eCA81554634E
///   OPERATOR=<agent evm address>
contract Deploy is Script {
    function run() external {
        address fxrp = vm.envOr("FXRP", address(0x0b6A3645c240605887a5532109323A3E12273dc7));
        address stxrpVault = vm.envOr("VENUE_STXRP", address(0x4066A1363a04ce3B23eEcB53dEfa65f94A24355E));
        address earnVault = vm.envOr("VENUE_EARNXRP", address(0xF97B2bBdB2f4a561806e5038a503eCA81554634E));
        address operator = vm.envOr("OPERATOR", msg.sender);

        vm.startBroadcast();

        // 1. Registry (resolves FDC + FTSO v2 from the on-chain registry)
        StandingOrderRegistry registry = new StandingOrderRegistry(
            address(0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019)
        );
        console2.log("StandingOrderRegistry:", address(registry));

        // 2. Execution controller
        ExecutionController controller = new ExecutionController(
            address(registry),
            fxrp,
            1_000_000_000_000_000_000, // 1 FXRP per tick max
            7200 // 2h price staleness window
        );
        console2.log("ExecutionController:", address(controller));

        // 3. Wire roles: registry.controller = controller; controller.operator = agent
        //    (venues are registered BEFORE controller handoff — only the
        //     registry controller may register venues)
        registry.registerVenue(1, "TESTstXRP");
        registry.registerVenue(2, "TESTearnXRP");
        registry.setController(address(controller));
        controller.setOperator(operator);

        // 4. Venue adapters (1 = stXRP vault, 2 = earnXRP vault — Coston2 test vaults)
        ERC4626VenueAdapter stxrp = new ERC4626VenueAdapter(stxrpVault, "TESTstXRP");
        ERC4626VenueAdapter earn = new ERC4626VenueAdapter(earnVault, "TESTearnXRP");
        controller.setVenueAdapter(1, address(stxrp));
        controller.setVenueAdapter(2, address(earn));

        console2.log("operator:", operator);
        console2.log("fxrp:", fxrp);
        console2.log("adapter stXRP:", address(stxrp));
        console2.log("adapter earnXRP:", address(earn));

        vm.stopBroadcast();
    }
}
