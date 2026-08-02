// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IXRPPayment} from "@flarenetwork/flare-periphery-contracts/flare/IXRPPayment.sol";

/// @notice Test double for the FlareDataConnector's XRP payment verification.
///         Accepts proofs whose requestBody.transactionId starts with 0x01.
contract MockFlareDataConnector {
    bool public verifyResult = true;

    function setVerifyResult(bool _result) external {
        verifyResult = _result;
    }

    function verifyXRPPayment(IXRPPayment.Proof calldata) external view returns (bool) {
        return verifyResult;
    }
}
