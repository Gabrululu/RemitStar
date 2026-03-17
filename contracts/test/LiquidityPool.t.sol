// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {MockUSDC} from "../src/mocks/MockUSDC.sol";
import {ComplianceGate} from "../src/ComplianceGate.sol";
import {LiquidityPool} from "../src/LiquidityPool.sol";
import {NotCompliant} from "../src/LiquidityPool.sol";

contract LiquidityPoolTest is Test {
    MockUSDC usdc;
    ComplianceGate gate;
    LiquidityPool pool;

    address alice = makeAddr("alice");

    function setUp() public {
        usdc = new MockUSDC();
        gate = new ComplianceGate();
        pool = new LiquidityPool(address(usdc));

        pool.setComplianceGate(address(gate));
        gate.approveKyc(alice);

        deal(address(usdc), alice, 10_000 * 10 ** 6);
    }

    function test_deposit_mints_shares() public {
        uint256 amount = 1_000 * 10 ** 6;

        vm.startPrank(alice);
        usdc.approve(address(pool), amount);
        uint256 shares = pool.deposit(amount, alice);
        vm.stopPrank();

        assertGt(shares, 0);
        assertEq(pool.balanceOf(alice), shares);
    }

    function test_withdraw_burns_shares() public {
        uint256 amount = 1_000 * 10 ** 6;

        vm.startPrank(alice);
        usdc.approve(address(pool), amount);
        pool.deposit(amount, alice);

        uint256 sharesBefore = pool.balanceOf(alice);
        assertGt(sharesBefore, 0);

        pool.withdraw(amount, alice, alice);
        vm.stopPrank();

        assertEq(pool.balanceOf(alice), 0);
        assertEq(usdc.balanceOf(alice), 10_000 * 10 ** 6);
    }

    function test_deposit_blocked_when_paused() public {
        pool.pause();

        vm.startPrank(alice);
        usdc.approve(address(pool), 1_000 * 10 ** 6);
        vm.expectRevert();
        pool.deposit(1_000 * 10 ** 6, alice);
        vm.stopPrank();
    }

    function test_unwhitelisted_user_blocked_when_kyc_required() public {
        address bob = makeAddr("bob");
        deal(address(usdc), bob, 1_000 * 10 ** 6);

        gate.setKycRequired(true);

        vm.startPrank(bob);
        usdc.approve(address(pool), 1_000 * 10 ** 6);
        vm.expectRevert(NotCompliant.selector);
        pool.deposit(1_000 * 10 ** 6, bob);
        vm.stopPrank();
    }

    function test_get_pool_stats_returns_correct_values() public {
        uint256 amount = 1_000 * 10 ** 6;

        vm.startPrank(alice);
        usdc.approve(address(pool), amount);
        pool.deposit(amount, alice);
        vm.stopPrank();

        (uint256 totalAssets_, uint256 totalShares, uint256 feesCollected) = pool.getPoolStats();

        assertEq(totalAssets_, amount);
        assertEq(totalShares, pool.totalSupply());
        assertEq(feesCollected, 0);
    }
}
