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

contract StandingOrderRegistryTest is Test {
    StandingOrderRegistry public registry;
    MockFlareDataConnector public fdc;
    MockFtsoV2 public ftsoV2;
    bytes32 internal constant OWNER = bytes32(uint256(0xaaaa));

    function setUp() public {
        fdc = new MockFlareDataConnector();
        ftsoV2 = new MockFtsoV2();
        MockFlareContractRegistry reg = new MockFlareContractRegistry(address(fdc), address(ftsoV2));
        registry = new StandingOrderRegistry(address(reg));
    }

    function _proof(uint32 _cadence, uint64 _amount) internal view returns (IXRPPayment.Proof memory) {
        return ProofBuilder.buildProof(_cadence, _amount, 0, 1, true, _amount, OWNER, 0, bytes32(uint256(1)));
    }

    function testRegisterOrderHappyPath() public {
        uint64 amount = 25_000_000_000; // 25 XRP in drops
        registry.registerOrder(_proof(3600, amount), address(this));
        uint256 id = registry.orderCount();
        StandingOrderRegistry.StandingOrder memory o = registry.getOrder(id);
        assertEq(o.ownerXrpl, OWNER);
        assertEq(o.amountDrops, amount);
        assertEq(o.cadenceSeconds, 3600);
        assertEq(o.venueId, 0);
        assertEq(o.strategyId, 1);
        assertTrue(o.active);
        assertEq(o.nextExecutionAt, block.timestamp + 3600);
        assertEq(registry.orderIdsOf(OWNER).length, 1);
    }

    function testRegisterOrderSweepsFullAmountWhenMemoAmountZero() public {
        // memo amount 0 = sweep; payment itself is 50 XRP
        IXRPPayment.Proof memory p = ProofBuilder.buildProof(
            3600, 0, 0, 1, true, 50_000_000_000, OWNER, 0, bytes32(uint256(5))
        );
        registry.registerOrder(p, address(this));
        uint256 id = registry.orderCount();
        StandingOrderRegistry.StandingOrder memory o = registry.getOrder(id);
        assertEq(o.amountDrops, 50_000_000_000);
    }

    function testRegisterOrderRevertsWhenProofNotVerified() public {
        fdc.setVerifyResult(false);
        vm.expectRevert(StandingOrderRegistry.NotVerified.selector);
        registry.registerOrder(_proof(3600, 1_000_000), address(this));
    }

    function testRegisterOrderRevertsWhenPaymentFailed() public {
        IXRPPayment.Proof memory p = ProofBuilder.buildProof(
            3600, 1_000_000, 0, 1, true, 1_000_000, OWNER, 1, bytes32(uint256(2))
        );
        vm.expectRevert(StandingOrderRegistry.PaymentFailed.selector);
        registry.registerOrder(p, address(this));
    }

    function testRegisterOrderRevertsBadMagic() public {
        IXRPPayment.Proof memory p = _proof(3600, 1_000_000);
        p.data.responseBody.firstMemoData = abi.encodePacked(bytes2(0x4242), bytes18(0));
        vm.expectRevert(StandingOrderRegistry.BadMemoMagic.selector);
        registry.registerOrder(p, address(this));
    }

    function testRegisterOrderRevertsZeroCadence() public {
        vm.expectRevert(StandingOrderRegistry.ZeroCadence.selector);
        registry.registerOrder(_proof(0, 1_000_000), address(this));
    }

    function testRegisterOrderRevertsUnknownVenue() public {
        IXRPPayment.Proof memory p = ProofBuilder.buildProof(
            3600, 1_000_000, 99, 1, true, 1_000_000, OWNER, 0, bytes32(uint256(3))
        );
        vm.expectRevert(StandingOrderRegistry.UnknownVenue.selector);
        registry.registerOrder(p, address(this));
    }

    function testRegisterVenueThenOrder() public {
        registry.registerVenue(7, "Firelight");
        IXRPPayment.Proof memory p = ProofBuilder.buildProof(
            3600, 1_000_000, 7, 1, true, 1_000_000, OWNER, 0, bytes32(uint256(4))
        );
        registry.registerOrder(p, address(this));
        assertEq(registry.getOrder(1).venueId, 7);
    }

    function testCancelOrder() public {
        registry.registerOrder(_proof(3600, 1_000_000), address(this));
        registry.cancelOrder(1);
        assertFalse(registry.getOrder(1).active);
        vm.expectRevert(StandingOrderRegistry.OrderInactive.selector);
        registry.cancelOrder(1);
    }

    function testOnlyControllerCanCancel() public {
        registry.registerOrder(_proof(3600, 1_000_000), address(this));
        vm.prank(address(0x1234));
        vm.expectRevert(StandingOrderRegistry.NotController.selector);
        registry.cancelOrder(1);
    }
}
