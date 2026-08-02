// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {StandingOrderRegistry} from "../src/StandingOrderRegistry.sol";
import {ExecutionController} from "../src/ExecutionController.sol";
import {ERC4626VenueAdapter} from "../src/adapters/ERC4626VenueAdapter.sol";
import {MockFlareDataConnector} from "./mocks/MockFlareDataConnector.sol";
import {MockFlareContractRegistry} from "./mocks/MockFlareContractRegistry.sol";
import {MockFtsoV2} from "./mocks/MockFtsoV2.sol";
import {MockERC20} from "./mocks/MockERC20.sol";
import {MockVault} from "./mocks/MockVault.sol";
import {ProofBuilder} from "./mocks/ProofBuilder.sol";

contract VenueAdapterTest is Test {
    StandingOrderRegistry public registry;
    ExecutionController public controller;
    ERC4626VenueAdapter public adapter;
    MockERC20 public fxrp;
    MockVault public vault;
    MockFtsoV2 public ftsoV2;
    address internal constant AGENT = address(0xBEEF);
    address internal constant USER = address(0xCAFE);
    bytes32 internal constant OWNER = bytes32(uint256(0xaaaa));

    function setUp() public {
        vm.warp(1_700_000_000);
        MockFlareDataConnector fdc = new MockFlareDataConnector();
        ftsoV2 = new MockFtsoV2();
        MockFlareContractRegistry reg = new MockFlareContractRegistry(address(fdc), address(ftsoV2));
        registry = new StandingOrderRegistry(address(reg));
        fxrp = new MockERC20();
        controller = new ExecutionController(address(registry), address(fxrp), 1_000_000_000_000_000_000_000, 7200);
        registry.setController(address(controller));
        controller.setOperator(AGENT);
        ftsoV2.setFeed(1_082_000, 6, uint64(block.timestamp));

        vault = new MockVault(fxrp);
        adapter = new ERC4626VenueAdapter(address(vault), "TESTstXRP");
        vm.prank(AGENT);
        controller.setVenueAdapter(1, address(adapter));
        vm.prank(address(controller));
        registry.registerVenue(1, "TESTstXRP");
    }

    function testDepositRoutesFxrpToVault() public {
        // user funds the order, approves the controller, order is due
        fxrp.mint(USER, 10_000_000_000_000_000_000); // 10 FXRP (18 dec)
        vm.prank(USER);
        fxrp.approve(address(controller), type(uint256).max);

        registry.registerOrder(ProofBuilder.buildProof(
            3600, 5_000_000_000_000_000_000, 1, 1, true, 5_000_000_000_000_000_000, OWNER, 0, bytes32(uint256(1))
        ), USER);
        uint256 id = registry.orderCount();

        vm.warp(block.timestamp + 3601);
        vm.prank(AGENT);
        controller.execute(id);

        // FXRP left user, shares credited to user in the vault
        assertEq(fxrp.balanceOf(USER), 5_000_000_000_000_000_000);
        assertEq(vault.balanceOf(USER), 5_000_000_000_000_000_000);
        // order advanced
        StandingOrderRegistry.StandingOrder memory o = registry.getOrder(id);
        assertEq(o.executionCount, 1);
        assertEq(o.totalExecutedDrops, 5_000_000_000_000_000_000);
    }

    function testExchangeRateReflectsVaultRate() public {
        assertEq(adapter.exchangeRate(), 1e18);
        vault.setRateBps(10_100); // 1.0100
        assertEq(adapter.exchangeRate(), 1.01e18);
    }

    function testVenueName() public view {
        assertEq(adapter.venueName(), "TESTstXRP");
    }
}
