// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Test double for FlareContractRegistry.
contract MockFlareContractRegistry {
    address public fdc;
    address public ftsoV2;

    constructor(address _fdc, address _ftsoV2) {
        fdc = _fdc;
        ftsoV2 = _ftsoV2;
    }

    function getContractAddressByName(string calldata _name) external view returns (address) {
        bytes32 n = keccak256(bytes(_name));
        if (n == keccak256(bytes("FdcVerification")) || n == keccak256(bytes("FlareDataConnector")))
        return fdc;
        if (n == keccak256(bytes("FtsoV2"))) return ftsoV2;
        return address(0);
    }
}
