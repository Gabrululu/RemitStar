// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {ComplianceGate} from "../src/ComplianceGate.sol";

contract ComplianceGateTest is Test {
    ComplianceGate gate;
    address alice = makeAddr("alice");

    function setUp() public {
        gate = new ComplianceGate();
    }

    function test_deployer_has_all_roles() public view {
        assertTrue(gate.hasRole(gate.DEFAULT_ADMIN_ROLE(), address(this)));
        assertTrue(gate.hasRole(gate.PAUSER_ROLE(), address(this)));
        assertTrue(gate.hasRole(gate.KYC_OPERATOR_ROLE(), address(this)));
    }

    function test_approve_and_revoke_kyc() public {
        gate.approveKyc(alice);
        assertTrue(gate.kycApproved(alice));

        gate.revokeKyc(alice);
        assertFalse(gate.kycApproved(alice));
    }

    function test_blacklist_blocks_canTransact() public {
        gate.blacklist(alice);
        assertFalse(gate.canTransact(alice));

        gate.unblacklist(alice);
        assertTrue(gate.canTransact(alice));
    }

    function test_kyc_required_blocks_non_approved() public {
        gate.setKycRequired(true);
        assertFalse(gate.canTransact(alice));

        gate.approveKyc(alice);
        assertTrue(gate.canTransact(alice));
    }

    function test_kyc_not_required_allows_all() public view {
        assertFalse(gate.kycRequired());
        assertTrue(gate.canTransact(alice));
    }

    function test_pause_blocks_canTransact() public {
        gate.pause();
        assertFalse(gate.canTransact(alice));

        gate.unpause();
        assertTrue(gate.canTransact(alice));
    }

    function test_non_operator_cannot_approve() public {
        vm.prank(alice);
        vm.expectRevert();
        gate.approveKyc(alice);
    }
}
