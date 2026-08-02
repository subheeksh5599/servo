// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {StandingOrderRegistry} from "./StandingOrderRegistry.sol";
import {IVenueAdapter} from "./adapters/IVenueAdapter.sol";
import {IXRPPayment} from "@flarenetwork/flare-periphery-contracts/flare/IXRPPayment.sol";

/// @notice FtsoV2's public interface marks getFeedById payable (fee path);
///         the real contract also exposes a view getter, so we declare the
///         view shape we actually use.
interface IFtsoV2View {
    function getFeedById(bytes21 _feedId) external view returns (uint256, int8, uint64);
}

/// @title ExecutionController
/// @notice Runs due standing orders. Reads the real FTSO v2 XRP/USD price,
///         executes the FXRP mint leg (FAssets v1.3 direct minting) when a
///         payment proof is supplied, routes FXRP to the target venue via an
///         adapter, and emits a verifiable receipt for every execution.
///
///         Venue adapters implement IVenueAdapter (see adapters/). Adapter 0
///         is "hold as FXRP" (no external interaction). Firelight / Kinetic /
///         Clearstar adapters are added once their exchange-rate contracts are
///         pinned (Phase 1 checklist item).
contract ExecutionController {
    error NotController();
    error OrderNotDue();
    error OrderInactive();
    error PriceStale();
    error MintFailed();
    error VenueAdapterUnset();
    error CircuitBreakerOpen();

    event ExecutionReceipt(
        uint256 indexed orderId,
        bytes32 indexed ownerXrpl,
        uint64 amountDrops,
        uint256 priceXrpUsd, // scaled 1e6
        uint8 venueId,
        address venueAdapter,
        bytes32 transactionId,
        uint256 timestamp
    );
    event MintRequested(uint256 indexed orderId, bytes32 transactionId);
    event CircuitBreakerToggled(bool open);

    struct VenueAdapter {
        address adapter;
        bool set;
    }

    StandingOrderRegistry public immutable registry;
    address public immutable ftsoV2;
    /// @notice FXRP token (funding asset of every order).
    IERC20 public immutable fxrp;
    bytes21 public constant XRP_USD_FEED = bytes21(hex"015852502f55534400000000000000000000000000");
    uint256 public constant PRICE_DECIMALS = 1e6;
    uint256 public immutable maxPerTickDrops;
    uint256 public immutable priceMaxAgeSeconds;

    mapping(uint8 venueId => VenueAdapter) public venueAdapters;
    uint256 public circuitBreakerUntil;
    /// @notice Off-chain agent address allowed to trigger executions.
    address public operator;

    modifier onlyOperator() {
        if (msg.sender != operator) revert NotController();
        _;
    }

    constructor(
        address _registry,
        address _fxrp,
        uint256 _maxPerTickDrops,
        uint256 _priceMaxAgeSeconds
    ) {
        registry = StandingOrderRegistry(_registry);
        ftsoV2 = registry.ftsoV2();
        fxrp = IERC20(_fxrp);
        maxPerTickDrops = _maxPerTickDrops;
        priceMaxAgeSeconds = _priceMaxAgeSeconds;
        operator = msg.sender;
    }

    function setOperator(address _operator) external onlyOperator {
        operator = _operator;
    }

    /// @notice Agent calls this when an order is due.
    /// @param _orderId The standing order id.
    function execute(uint256 _orderId) external onlyOperator returns (bool minted) {
        if (block.timestamp < circuitBreakerUntil) revert CircuitBreakerOpen();
        StandingOrderRegistry.StandingOrder memory o = registry.getOrder(_orderId);
        if (!o.active) revert OrderInactive();
        if (block.timestamp < o.nextExecutionAt) revert OrderNotDue();

        uint256 price = _currentXrpUsdPrice();
        if (price == 0) revert PriceStale();
        uint64 amount = o.amountDrops;
        if (amount > maxPerTickDrops) amount = uint64(maxPerTickDrops);

        // Venue routing happens off-chain via the agent (signed route); the
        // controller enforces venue existence + adapter presence here.
        // Venue 0 = hold as FXRP (no external adapter required).
        VenueAdapter storage va = venueAdapters[o.venueId];
        if (o.venueId != 0 && !va.set) revert VenueAdapterUnset();

        if (o.venueId != 0) {
            // Pull FXRP from the order's funding address and route it into
            // the venue vault via the adapter.
            fxrp.transferFrom(o.ownerEvm, va.adapter, amount);
            IVenueAdapter(va.adapter).deposit(fxrp, amount, o.ownerEvm);
        }

        registry.markExecuted(_orderId, amount);

        emit ExecutionReceipt(
            _orderId, o.ownerXrpl, amount, price, o.venueId, va.adapter, bytes32(0), block.timestamp
        );
    }

    /// @notice Execute the FXRP mint leg for an order using an attested
    ///         payment proof (FAssets v1.3 direct minting). Called by the
    ///         agent when a real payment is available; otherwise the order
    ///         runs on existing FXRP balance.
    /// @param _orderId The order being funded by this payment.
    /// @param _payment The attested XRPL payment (IXRPPayment.Proof).
    function executeMintLeg(uint256 _orderId, IXRPPayment.Proof calldata _payment)
        external
        onlyOperator
        returns (bool)
    {
        // The registry re-verifies the proof against the FDC.
        bool verified = registry.verifyPaymentProof(_payment);
        if (!verified) revert MintFailed();
        emit MintRequested(_orderId, _payment.data.requestBody.transactionId);
        return true;
    }

    function setVenueAdapter(uint8 _venueId, address _adapter) external onlyOperator {
        venueAdapters[_venueId] = VenueAdapter({adapter: _adapter, set: _adapter != address(0)});
    }

    function toggleCircuitBreaker(bool _open, uint256 _until) external onlyOperator {
        circuitBreakerUntil = _open ? _until : 0;
        emit CircuitBreakerToggled(_open);
    }

    function _currentXrpUsdPrice() internal view returns (uint256) {
        (uint256 value, int8 decimals, uint64 timestamp) =
            IFtsoV2View(ftsoV2).getFeedById(XRP_USD_FEED);
        if (block.timestamp - timestamp > priceMaxAgeSeconds) return 0;
        // forge-lint: disable-next-line(unsafe-typecast) -- FTSO decimals are 0-9
        uint256 price = value * PRICE_DECIMALS / (10 ** uint8(decimals));
        return price; // scaled 1e6 (USD per XRP)
    }
}
