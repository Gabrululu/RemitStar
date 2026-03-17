// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";

interface IRemitCore {
    function addSupportedToken(address) external;
}

contract AddUSDT is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address core = vm.envAddress("REMITFLOW_CORE");
        address usdt = vm.envAddress("REMITFLOW_USDT");

        vm.startBroadcast(deployerKey);
        IRemitCore(core).addSupportedToken(usdt);
        vm.stopBroadcast();

        console.log("done AddUSDT");
    }
}
