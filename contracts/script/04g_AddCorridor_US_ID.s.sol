// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";

interface IRemitCore {
    function addCorridor(bytes32,bool,uint256,uint256,uint256,string calldata) external;
}

contract AddCorridorUSID is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address core = vm.envAddress("REMITFLOW_CORE");

        vm.startBroadcast(deployerKey);
        IRemitCore(core).addCorridor(
            keccak256(abi.encodePacked("US_ID")),
            true,
            10 * 1e6,
            10000 * 1e6,
            16_240_000,
            "IDR"
        );
        vm.stopBroadcast();

        console.log("done Corridor US_ID");
    }
}
