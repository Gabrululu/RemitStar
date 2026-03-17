// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";

interface IRemitCore {
    function addSupportedToken(address) external;
}

contract AddUSDC is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address core = vm.envAddress("REMITFLOW_CORE");
        address usdc = vm.envAddress("REMITFLOW_USDC");

        vm.startBroadcast(deployerKey);
        IRemitCore(core).addSupportedToken(usdc);
        vm.stopBroadcast();

        console.log("done AddUSDC");
    }
}
