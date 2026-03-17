// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDC} from "../src/mocks/MockUSDC.sol";
import {MockUSDT} from "../src/mocks/MockUSDT.sol";

contract DeployTokens is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.envAddress("DEPLOYER_ADDRESS");

        vm.startBroadcast(deployerKey);

        MockUSDC usdc = new MockUSDC();
        MockUSDT usdt = new MockUSDT();

        usdc.faucet(deployer, 100_000 * 10 ** 6);
        usdt.faucet(deployer, 100_000 * 10 ** 6);

        vm.stopBroadcast();

        console.log("REMITFLOW_USDC=%s", address(usdc));
        console.log("REMITFLOW_USDT=%s", address(usdt));
    }
}
