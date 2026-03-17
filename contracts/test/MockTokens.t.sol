// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {MockUSDC} from "../src/mocks/MockUSDC.sol";

contract MockTokensTest is Test {
    MockUSDC usdc;
    address deployer = address(this);

    function setUp() public {
        usdc = new MockUSDC();
    }

    function test_initial_supply() public view {
        assertEq(usdc.balanceOf(deployer), 1_000_000 * 10 ** 6);
    }

    function test_faucet_works() public {
        address alice = makeAddr("alice");
        usdc.faucet(alice, 5_000 * 10 ** 6);
        assertEq(usdc.balanceOf(alice), 5_000 * 10 ** 6);
    }

    function test_faucet_max_exceeded() public {
        address alice = makeAddr("alice");
        vm.expectRevert("Max 10k USDC");
        usdc.faucet(alice, 10_001 * 10 ** 6);
    }

    function test_decimals() public view {
        assertEq(usdc.decimals(), 6);
    }

    function test_faucet_anyone_can_call() public {
        address random = makeAddr("random");
        vm.prank(random);
        usdc.faucet(random, 1_000 * 10 ** 6);
        assertEq(usdc.balanceOf(random), 1_000 * 10 ** 6);
    }
}
