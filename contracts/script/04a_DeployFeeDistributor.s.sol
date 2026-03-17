// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {FeeDistributor} from "../src/FeeDistributor.sol";

contract DeployFeeDistributor is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address treasury = vm.envAddress("DEPLOYER_ADDRESS");
        address pool = vm.envAddress("REMITFLOW_POOL");

        vm.startBroadcast(deployerKey);
        FeeDistributor fd = new FeeDistributor(treasury, pool);
        vm.stopBroadcast();

        console.log("REMITFLOW_FEE_DISTRIBUTOR=", address(fd));
    }
}
