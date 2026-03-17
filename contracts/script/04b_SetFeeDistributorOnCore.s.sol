// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";

interface IRemitCore {
    function setFeeDistributor(address) external;
}

contract SetFeeDistributorOnCore is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address core = vm.envAddress("REMITFLOW_CORE");
        address fd = vm.envAddress("REMITFLOW_FEE_DISTRIBUTOR");

        vm.startBroadcast(deployerKey);
        IRemitCore(core).setFeeDistributor(fd);
        vm.stopBroadcast();

        console.log("done SetFeeDistributor:", fd);
    }
}
