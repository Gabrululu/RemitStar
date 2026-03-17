// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {MockUSDC} from "../src/mocks/MockUSDC.sol";
import {LiquidityPool} from "../src/LiquidityPool.sol";
import {FeeDistributor} from "../src/FeeDistributor.sol";

contract FeeDistributorTest is Test {
    MockUSDC usdc;
    LiquidityPool pool;
    FeeDistributor feeDistributor;

    address treasury = makeAddr("treasury");

    function setUp() public {
        usdc = new MockUSDC();
        pool = new LiquidityPool(address(usdc));
        feeDistributor = new FeeDistributor(treasury, address(pool));

        deal(address(usdc), address(this), 1_000 * 1e6);
        usdc.approve(address(feeDistributor), type(uint256).max);
    }

    function test_calculate_fee() public view {
        uint256 fee = feeDistributor.calculateFee(100 * 1e6);
        assertEq(fee, 300_000);
    }

    function test_distribute_fee_splits_correctly() public {
        uint256 feeAmount = 300_000;
        uint256 expectedTreasury = feeAmount * 5000 / 10_000;
        uint256 expectedLp = feeAmount - expectedTreasury;

        feeDistributor.distributeFee(address(usdc), feeAmount);

        assertEq(usdc.balanceOf(treasury), expectedTreasury);
        assertEq(usdc.balanceOf(address(pool)), expectedLp);
    }

    function test_set_shares_must_sum_to_10000() public {
        vm.expectRevert(bytes("Must sum to 10000"));
        feeDistributor.setShares(6000, 3000);
    }

    function test_only_owner_can_set_shares() public {
        address bob = makeAddr("bob");
        vm.prank(bob);
        vm.expectRevert();
        feeDistributor.setShares(5000, 5000);
    }
}
