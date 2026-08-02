// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {StandingOrderRegistry} from "../src/StandingOrderRegistry.sol";
import {ExecutionController} from "../src/ExecutionController.sol";
import {MockFlareDataConnector} from "./mocks/MockFlareDataConnector.sol";
import {MockFlareContractRegistry} from "./mocks/MockFlareContractRegistry.sol";
import {MockFtsoV2} from "./mocks/MockFtsoV2.sol";
import {ProofBuilder} from "./mocks/ProofBuilder.sol";
import {IXRPPayment} from "@flarenetwork/flare-periphery-contracts/flare/IXRPPayment.sol";

contract ExecutionControllerTest is Test {
    StandingOrderRegistry public registry;
    ExecutionController public controller;
    MockFlareDataConnector public fdc;
    MockFtsoV2 public ftsoV2;
    address internal constant AGENT = address(0xBEEF);
    bytes32 internal constant OWNER = bytes32(uint256(0xaaaa));

    event ExecutionReceipt(
        uint256 indexed orderId,
        bytes32 indexed ownerXrpl,
        uint64 amountDrops,
        uint256 priceXrpUsd,
        uint8 venueId,
        address venueAdapter,
        bytes32 transactionId,
        uint256 timestamp
    );

    function setUp() public {
        vm.warp(1_700_000_000); // realistic timestamp (foundry default is 1)
        fdc = new MockFlareDataConnector();
        ftsoV2 = new MockFtsoV2();
        MockFlareContractRegistry reg = new MockFlareContractRegistry(address(fdc), address(ftsoV2));
        registry = new StandingOrderRegistry(address(reg));
        controller = new ExecutionController(address(registry), 1_000_000_000_000, 7200);
        registry.setController(address(controller));
        controller.setOperator(AGENT);
        ftsoV2.setFeed(1_082_000, 6, uint64(block.timestamp)); // XRP/USD = 1.082
    }

    function _registerOrder(uint32 _cadence, uint64 _amount) internal returns (uint256) {
        registry.registerOrder(ProofBuilder.buildProof(
            _cadence, _amount, 0, 1, true, _amount, OWNER, 0, bytes32(uint256(1))
        ));
        return registry.orderCount();
    }

    function testExecuteHappyPathEmitsReceipt() public {
        uint256 id = _registerOrder(3600, 25_000_000_000);
        vm.warp(block.timestamp + 3601);
        vm.prank(AGENT);
        vm.expectEmit(true, true, true, true, address(controller));
        emit ExecutionReceipt(id, OWNER, 25_000_000_000, 1_082_000, 0, address(0), bytes32(0), block.timestamp);
        controller.execute(id);
        StandingOrderRegistry.StandingOrder memory o = registry.getOrder(id);
        assertEq(o.executionCount, 1);
        assertEq(o.lastExecutedAt, block.timestamp);
        assertEq(o.nextExecutionAt, block.timestamp + 3600);
        assertEq(o.totalExecutedDrops, 25_000_000_000);
    }

    function testExecuteRejectsNotDue() public {
        uint256 id = _registerOrder(3600, 1_000_000);
        vm.prank(AGENT);
        vm.expectRevert(ExecutionController.OrderNotDue.selector);
        controller.execute(id);
    }

    function testExecuteRejectsInactive() public {
        uint256 id = _registerOrder(3600, 1_000_000);
        vm.prank(address(controller));
        registry.cancelOrder(id);
        vm.warp(block.timestamp + 3601);
        vm.prank(AGENT);
        vm.expectRevert(ExecutionController.OrderInactive.selector);
        controller.execute(id);
    }

    function testExecuteRejectsStalePrice() public {
        uint256 id = _registerOrder(3600, 1_000_000);
        ftsoV2.setFeed(1_082_000, 6, uint64(block.timestamp - 5000));
        vm.warp(block.timestamp + 3601);
        vm.prank(AGENT);
        vm.expectRevert(ExecutionController.PriceStale.selector);
        controller.execute(id);
    }

    function testExecuteRejectsUnsetVenueAdapter() public {
        vm.prank(address(controller));
        registry.registerVenue(7, "Firelight");
        uint256 id = registry.orderCount() + 1;
        registry.registerOrder(ProofBuilder.buildProof(
            3600, 1_000_000, 7, 1, true, 1_000_000, OWNER, 0, bytes32(uint256(2))
        ));
        vm.warp(block.timestamp + 3601);
        vm.prank(AGENT);
        vm.expectRevert(ExecutionController.VenueAdapterUnset.selector);
        controller.execute(id);
    }

    function testExecuteRejectsNonController() public {
        uint256 id = _registerOrder(3600, 1_000_000);
        vm.warp(block.timestamp + 3601);
        vm.prank(address(0x9999));
        vm.expectRevert(ExecutionController.NotController.selector);
        controller.execute(id);
    }

    function testExecuteCapsPerTick() public {
        uint256 id = _registerOrder(3600, 5_000_000_000_000); // 5M XRP > cap
        vm.warp(block.timestamp + 3601);
        vm.prank(AGENT);
        controller.execute(id);
        StandingOrderRegistry.StandingOrder memory o = registry.getOrder(id);
        assertEq(o.totalExecutedDrops, 1_000_000_000_000); // capped at maxPerTickDrops
    }

    function testCircuitBreakerBlocksExecution() public {
        uint256 id = _registerOrder(3600, 1_000_000);
        vm.warp(block.timestamp + 3601);
        vm.prank(AGENT);
        controller.toggleCircuitBreaker(true, block.timestamp + 10_000);
        vm.prank(AGENT);
        vm.expectRevert(ExecutionController.CircuitBreakerOpen.selector);
        controller.execute(id);
        vm.prank(AGENT);
        controller.toggleCircuitBreaker(false, 0);
        vm.prank(AGENT);
        controller.execute(id); // recovers
    }

    function testExecuteMintLegVerified() public {
        uint256 id = _registerOrder(3600, 1_000_000);
        IXRPPayment.Proof memory p = ProofBuilder.buildProof(
            3600, 1_000_000, 0, 1, true, 1_000_000, OWNER, 0, bytes32(uint256(9))
        );
        vm.prank(AGENT);
        vm.expectEmit(true, true, false, false, address(controller));
        emit MintRequested(id, bytes32(uint256(9)));
        controller.executeMintLeg(id, p);
    }

    event MintRequested(uint256 indexed orderId, bytes32 transactionId);

    function testExecuteMintLegFailsUnverified() public {
        uint256 id = _registerOrder(3600, 1_000_000);
        fdc.setVerifyResult(false);
        IXRPPayment.Proof memory p = ProofBuilder.buildProof(
            3600, 1_000_000, 0, 1, true, 1_000_000, OWNER, 0, bytes32(uint256(9))
        );
        vm.prank(AGENT);
        vm.expectRevert(ExecutionController.MintFailed.selector);
        controller.executeMintLeg(id, p);
    }

    function testSetVenueAdapter() public {
        vm.prank(AGENT);
        controller.setVenueAdapter(7, address(0x1234));
        (address adapter, bool set) = controller.venueAdapters(7);
        assertEq(adapter, address(0x1234));
        assertTrue(set);
    }
}
