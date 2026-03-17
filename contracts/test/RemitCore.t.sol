// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {MockUSDC} from "../src/mocks/MockUSDC.sol";
import {ComplianceGate} from "../src/ComplianceGate.sol";
import {LiquidityPool} from "../src/LiquidityPool.sol";
import {FeeDistributor} from "../src/FeeDistributor.sol";
import {RemitCore, TokenNotSupported, CorridorNotActive, NotCompliant, AmountOutOfRange} from "../src/RemitCore.sol";

contract RemitCoreTest is Test {
    MockUSDC usdc;
    ComplianceGate compliance;
    LiquidityPool pool;
    FeeDistributor feeDistributor;
    RemitCore remitCore;

    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    address treasury = makeAddr("treasury");

    bytes32 constant CORRIDOR_US_PE = keccak256(abi.encodePacked("US_PE"));

    function setUp() public {
        usdc = new MockUSDC();
        compliance = new ComplianceGate();
        pool = new LiquidityPool(address(usdc));
        pool.setComplianceGate(address(compliance));

        feeDistributor = new FeeDistributor(treasury, address(pool));
        pool.transferOwnership(address(feeDistributor));

        remitCore = new RemitCore(address(compliance), address(feeDistributor));

        compliance.approveKyc(alice);
        compliance.approveKyc(bob);

        remitCore.addSupportedToken(address(usdc));
        remitCore.addCorridor(CORRIDOR_US_PE, true, 10 * 1e6, 10_000 * 1e6, 3_740_000, "PEN");

        deal(address(usdc), alice, 10_000 * 1e6);
        vm.prank(alice);
        usdc.approve(address(remitCore), type(uint256).max);
    }

    function test_send_remittance_success() public {
        uint256 amountIn = 100 * 1e6;
        bytes32 transferId = keccak256("transfer-1");

        vm.prank(alice);
        remitCore.sendRemittance(address(usdc), CORRIDOR_US_PE, amountIn, bob, transferId);

        RemitCore.Transfer memory t = remitCore.getTransfer(transferId);

        uint256 expectedFee = amountIn * 30 / 10_000;
        uint256 expectedAmountOut = (amountIn - expectedFee) * 3_740_000 / 1e6;

        assertEq(t.amountIn, amountIn);
        assertEq(uint8(t.status), uint8(RemitCore.TransferStatus.Completed));
        assertEq(t.fee, expectedFee);
        assertEq(t.amountOut, expectedAmountOut);
    }

    function test_get_quote_matches_send() public {
        uint256 amountIn = 100 * 1e6;
        bytes32 transferId = keccak256("transfer-2");

        (uint256 quoteFee, , uint256 quoteAmountOut) = remitCore.getQuote(CORRIDOR_US_PE, amountIn, address(usdc));

        vm.prank(alice);
        remitCore.sendRemittance(address(usdc), CORRIDOR_US_PE, amountIn, bob, transferId);

        RemitCore.Transfer memory t = remitCore.getTransfer(transferId);

        assertEq(t.fee, quoteFee);
        assertEq(t.amountOut, quoteAmountOut);
    }

    function test_unsupported_token_reverts() public {
        address fakeToken = makeAddr("fakeToken");
        bytes32 transferId = keccak256("transfer-3");

        vm.prank(alice);
        vm.expectRevert(TokenNotSupported.selector);
        remitCore.sendRemittance(fakeToken, CORRIDOR_US_PE, 100 * 1e6, bob, transferId);
    }

    function test_inactive_corridor_reverts() public {
        bytes32 inactiveCorridor = keccak256(abi.encodePacked("US_XX"));
        bytes32 transferId = keccak256("transfer-4");

        vm.prank(alice);
        vm.expectRevert(CorridorNotActive.selector);
        remitCore.sendRemittance(address(usdc), inactiveCorridor, 100 * 1e6, bob, transferId);
    }

    function test_blacklisted_sender_reverts() public {
        compliance.blacklist(alice);
        bytes32 transferId = keccak256("transfer-5");

        vm.prank(alice);
        vm.expectRevert(NotCompliant.selector);
        remitCore.sendRemittance(address(usdc), CORRIDOR_US_PE, 100 * 1e6, bob, transferId);
    }

    function test_amount_below_min_reverts() public {
        bytes32 transferId = keccak256("transfer-6");

        vm.prank(alice);
        vm.expectRevert(AmountOutOfRange.selector);
        remitCore.sendRemittance(address(usdc), CORRIDOR_US_PE, 5 * 1e6, bob, transferId);
    }

    function test_amount_above_max_reverts() public {
        bytes32 transferId = keccak256("transfer-7");

        vm.prank(alice);
        vm.expectRevert(AmountOutOfRange.selector);
        remitCore.sendRemittance(address(usdc), CORRIDOR_US_PE, 10_001 * 1e6, bob, transferId);
    }

    function test_transfer_nonce_increments() public {
        assertEq(remitCore.transferNonce(), 0);

        vm.prank(alice);
        remitCore.sendRemittance(address(usdc), CORRIDOR_US_PE, 100 * 1e6, bob, keccak256("transfer-8"));

        assertEq(remitCore.transferNonce(), 1);
    }
}
