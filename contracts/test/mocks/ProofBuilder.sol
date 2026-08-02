// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IXRPPayment} from "@flarenetwork/flare-periphery-contracts/flare/IXRPPayment.sol";

/// @notice Test fixture: builds IXRPPayment proofs with a Servo memo.
library ProofBuilder {
    bytes32 internal constant ATTESTATION_TYPE = bytes32("XRPPayment");
    bytes32 internal constant SOURCE_ID = bytes32("testXRP");

    /// @dev memo layout: "SR" | 0x01 | flags | cadence(4) | amount(8) | venue(1) | strategy(1) | 0x00
    function buildProof(
        uint32 _cadence,
        uint64 _amountDrops,
        uint8 _venueId,
        uint8 _strategyId,
        bool _autoExecute,
        uint64 _receivedDrops,
        bytes32 _sourceAddressHash,
        uint8 _status,
        bytes32 _transactionId
    ) internal pure returns (IXRPPayment.Proof memory proof) {
        bytes memory memo = abi.encodePacked(
            bytes2(0x5352), // "SR"
            bytes1(0x01), // version
            bytes1(_autoExecute ? 0x01 : 0x00), // flags
            _cadence,
            _amountDrops,
            bytes1(_venueId),
            bytes1(_strategyId),
            bytes2(0x0000)
        );
        proof.data.attestationType = ATTESTATION_TYPE;
        proof.data.sourceId = SOURCE_ID;
        proof.data.requestBody.transactionId = _transactionId;
        proof.data.responseBody.sourceAddressHash = _sourceAddressHash;
        proof.data.responseBody.receivedAmount = int256(uint256(_receivedDrops));
        proof.data.responseBody.status = _status;
        proof.data.responseBody.hasMemoData = true;
        proof.data.responseBody.firstMemoData = memo;
        proof.merkleProof = new bytes32[](1);
        proof.merkleProof[0] = keccak256(memo);
    }
}
