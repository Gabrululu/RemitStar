// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";

interface IRemitCore {
    function addCorridor(bytes32,bool,uint256,uint256,uint256,string calldata) external;
}

contract AddCorridorUSPE is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address core = vm.envAddress("REMITFLOW_CORE");

        vm.startBroadcast(deployerKey);
        IRemitCore(core).addCorridor(
            keccak256(abi.encodePacked("US_PE")),
            true,
            10 * 1e6,
            10000 * 1e6,
            3_740_000,
            "PEN"
        );
        vm.stopBroadcast();

        console.log("done Corridor US_PE");
    }
}
