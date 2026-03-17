// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract ComplianceGate is AccessControl, Pausable {
    bytes32 public constant KYC_OPERATOR_ROLE = keccak256("KYC_OPERATOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    mapping(address => bool) public kycApproved;
    mapping(address => bool) public blacklisted;
    bool public kycRequired;

    event KYCApproved(address indexed user);
    event KYCRevoked(address indexed user);
    event Blacklisted(address indexed user);
    event Unblacklisted(address indexed user);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(KYC_OPERATOR_ROLE, msg.sender);
    }

    function approveKyc(address user) external onlyRole(KYC_OPERATOR_ROLE) {
        kycApproved[user] = true;
        emit KYCApproved(user);
    }

    function revokeKyc(address user) external onlyRole(KYC_OPERATOR_ROLE) {
        kycApproved[user] = false;
        emit KYCRevoked(user);
    }

    function blacklist(address user) external onlyRole(KYC_OPERATOR_ROLE) {
        blacklisted[user] = true;
        emit Blacklisted(user);
    }

    function unblacklist(address user) external onlyRole(KYC_OPERATOR_ROLE) {
        blacklisted[user] = false;
        emit Unblacklisted(user);
    }

    function setKycRequired(bool required) external onlyRole(DEFAULT_ADMIN_ROLE) {
        kycRequired = required;
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function canTransact(address user) public view returns (bool) {
        if (paused()) return false;
        if (blacklisted[user]) return false;
        if (kycRequired) return kycApproved[user];
        return true;
    }
}
