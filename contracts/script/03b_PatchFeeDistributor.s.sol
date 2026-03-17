// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {FeeDistributor} from "../src/FeeDistributor.sol";
import {RemitCore} from "../src/RemitCore.sol";

contract PatchFeeDistributor is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.envAddress("DEPLOYER_ADDRESS");
        address pool = vm.envAddress("REMITFLOW_POOL");
        address remitCoreAddr = vm.envAddress("REMITFLOW_CORE");

        vm.startBroadcast(deployerKey);

        FeeDistributor feeDistributor = new FeeDistributor(deployer, pool);
        RemitCore(remitCoreAddr).setFeeDistributor(address(feeDistributor));

        vm.stopBroadcast();

        console.log("REMITFLOW_FEE_DISTRIBUTOR=%s", address(feeDistributor));
    }
}
