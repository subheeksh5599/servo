// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IXRPPayment} from "@flarenetwork/flare-periphery-contracts/flare/IXRPPayment.sol";
import {
    IXRPPaymentVerification
} from "@flarenetwork/flare-periphery-contracts/flare/IXRPPaymentVerification.sol";
import {
    IFlareContractRegistry
} from "@flarenetwork/flare-periphery-contracts/flare/IFlareContractRegistry.sol";

/// @title StandingOrderRegistry
/// @notice Stores standing orders created by XRPL payments. A payment with a
///         Servo memo is attested by the Flare Data Connector; the proof is
///         verified on-chain, the memo decoded into a standing order, and the
///         order stored for the ExecutionController to run.
///
///         Memo format (first 20 bytes of firstMemoData):
///         [0..2)   magic 0x5352 ("SR")
///         [2)      version (0x01)
///         [3)      flags (bit0 = auto-execute, rest reserved)
///         [4..8)   cadence seconds (uint32 BE)
///         [8..16)  amount per cycle in drops (uint64 BE)
///         [16)     target venue id (uint8)
///         [17)     strategy id (uint8)
///         [18..20) reserved
contract StandingOrderRegistry {
    error NotVerified();
    error PaymentFailed();
    error BadMemoMagic();
    error BadMemoVersion();
    error ZeroAmount();
    error ZeroCadence();
    error UnknownVenue();
    error OrderInactive();
    error NotController();
    error NotRegistered();
    error ZeroOwnerEvm();

    event OrderRegistered(
        uint256 indexed orderId,
        bytes32 indexed ownerXrpl,
        uint64 amountDrops,
        uint32 cadenceSeconds,
        uint8 venueId,
        uint8 strategyId,
        bool autoExecute,
        bytes32 transactionId
    );
    event OrderCancelled(uint256 indexed orderId, bytes32 indexed ownerXrpl);
    event ControllerSet(address indexed controller);

    struct StandingOrder {
        bytes32 ownerXrpl; // sourceAddressHash of the XRPL account
        address ownerEvm; // Flare address holding the FXRP (funding source)
        uint64 amountDrops; // per-cycle amount in XRP drops
        uint32 cadenceSeconds; // seconds between executions
        uint8 venueId; // target yield venue
        uint8 strategyId; // routing strategy
        bool autoExecute; // agent may execute without re-asking
        bool active;
        uint64 nextExecutionAt; // unix ts of next due execution
        uint64 lastExecutedAt;
        uint64 totalExecutedDrops;
        uint32 executionCount;
    }

    /// @notice Registry contract (0x1000...0001 on all Flare networks).
    address public immutable flareDataConnector;
    /// @notice FTSO v2 for pricing (resolved once at deploy).
    address public immutable ftsoV2;
    /// @notice Address allowed to run executions.
    address public controller;

    uint256 public orderCount;
    mapping(uint256 => StandingOrder) public orders;
    mapping(bytes32 ownerXrpl => uint256[] orderIds) public ordersOf;
    mapping(uint8 venueId => bool exists) public venueExists;
    mapping(uint8 venueId => string name) public venueName;

    modifier onlyController() {
        if (msg.sender != controller) revert NotController();
        _;
    }

    constructor(address _flareContractRegistry) {
        if (_flareContractRegistry == address(0)) {
            _flareContractRegistry = 0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019;
        }
        IFlareContractRegistry reg = IFlareContractRegistry(_flareContractRegistry);
        flareDataConnector = reg.getContractAddressByName("FlareDataConnector");
        ftsoV2 = reg.getContractAddressByName("FtsoV2");
        controller = msg.sender;

        venueExists[0] = true; // 0 = held as FXRP (no external venue)
        venueName[0] = "FXRP";
    }

    function setController(address _controller) external onlyController {
        controller = _controller;
        emit ControllerSet(_controller);
    }

    function registerVenue(uint8 _venueId, string calldata _name) external onlyController {
        venueExists[_venueId] = true;
        venueName[_venueId] = _name;
    }

    /// @notice Register a standing order from an attested XRPL payment.
    /// @param _proof Attested XRPL payment (FDC-verified).
    /// @param _ownerEvm Flare address that holds the FXRP funding this order.
    function registerOrder(IXRPPayment.Proof calldata _proof, address _ownerEvm)
        external
        returns (uint256 orderId)
    {
        if (_ownerEvm == address(0)) revert ZeroOwnerEvm();
        if (!IXRPPaymentVerification(flareDataConnector).verifyXRPPayment(_proof)) {
            revert NotVerified();
        }
        IXRPPayment.ResponseBody memory body = _proof.data.responseBody;
        if (body.status != 0) revert PaymentFailed();
        if (body.receivedAmount <= 0) revert ZeroAmount();

        (uint32 cadence, uint64 amountDrops, uint8 venueId, uint8 strategyId, bool autoExecute) =
            _decodeMemo(body.firstMemoData, uint64(uint256(body.receivedAmount)));

        orderId = ++orderCount;
        StandingOrder storage o = orders[orderId];
        o.ownerXrpl = body.sourceAddressHash;
        o.ownerEvm = _ownerEvm;
        o.amountDrops = amountDrops;
        o.cadenceSeconds = cadence;
        o.venueId = venueId;
        o.strategyId = strategyId;
        o.autoExecute = autoExecute;
        o.active = true;
        o.nextExecutionAt = uint64(block.timestamp) + cadence;

        ordersOf[body.sourceAddressHash].push(orderId);
        emit OrderRegistered(
            orderId,
            body.sourceAddressHash,
            amountDrops,
            cadence,
            venueId,
            strategyId,
            autoExecute,
            _proof.data.requestBody.transactionId
        );
    }

    /// @notice Cancel an order (only the controller, on user request via a
    ///         subsequent attested payment or the off-chain service).
    function cancelOrder(uint256 _orderId) external onlyController {
        StandingOrder storage o = orders[_orderId];
        if (!o.active) revert OrderInactive();
        o.active = false;
        emit OrderCancelled(_orderId, o.ownerXrpl);
    }

    /// @notice Mark execution done (called by ExecutionController).
    function markExecuted(uint256 _orderId, uint64 _amountDrops) external onlyController {
        StandingOrder storage o = orders[_orderId];
        if (!o.active) revert OrderInactive();
        o.lastExecutedAt = uint64(block.timestamp);
        o.nextExecutionAt = uint64(block.timestamp) + o.cadenceSeconds;
        o.totalExecutedDrops += _amountDrops;
        o.executionCount += 1;
    }

    function orderIdsOf(bytes32 _ownerXrpl) external view returns (uint256[] memory) {
        return ordersOf[_ownerXrpl];
    }

    /// @notice Full order struct (public mappings only expose tuple getters).
    function getOrder(uint256 _orderId) external view returns (StandingOrder memory) {
        return orders[_orderId];
    }

    /// @notice Re-verifies an attested XRPL payment against the FDC.
    function verifyPaymentProof(IXRPPayment.Proof calldata _proof) external view returns (bool) {
        return IXRPPaymentVerification(flareDataConnector).verifyXRPPayment(_proof);
    }

    function _decodeMemo(bytes memory _memo, uint64 _receivedDrops)
        internal
        view
        returns (
            uint32 cadence,
            uint64 amountDrops,
            uint8 venueId,
            uint8 strategyId,
            bool autoExecute
        )
    {
        if (_memo.length < 20) revert BadMemoMagic();
        if (_memo[0] != 0x53 || _memo[1] != 0x52) revert BadMemoMagic(); // "SR"
        if (_memo[2] != 0x01) revert BadMemoVersion();
        autoExecute = (_memo[3] & 0x01) != 0;
        // forge-lint: disable-next-line(unsafe-typecast) -- memo offsets are in-range
        cadence = _toUint32(_memo, 4);
        amountDrops = _toUint64(_memo, 8);
        // forge-lint: disable-next-line(unsafe-typecast) -- memo offsets are in-range
        venueId = uint8(_memo[16]);
        // forge-lint: disable-next-line(unsafe-typecast) -- memo offsets are in-range
        strategyId = uint8(_memo[17]);
        if (cadence == 0) revert ZeroCadence();
        if (!venueExists[venueId]) revert UnknownVenue();
        if (amountDrops == 0) amountDrops = _receivedDrops; // 0 = sweep full amount
    }

    function _toUint32(bytes memory _b, uint256 _offset) internal pure returns (uint32 v) {
        for (uint256 i = 0; i < 4; i++) {
            v = (v << 8) | uint32(uint8(_b[_offset + i]));
        }
    }

    function _toUint64(bytes memory _b, uint256 _offset) internal pure returns (uint64 v) {
        for (uint256 i = 0; i < 8; i++) {
            v = (v << 8) | uint64(uint8(_b[_offset + i]));
        }
    }
}
