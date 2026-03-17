// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {FeeDistributor} from "../src/FeeDistributor.sol";
import {RemitCore} from "../src/RemitCore.sol";

contract DeployCore is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.envAddress("DEPLOYER_ADDRESS");
        address usdc = vm.envAddress("REMITFLOW_USDC");
        address usdt = vm.envAddress("REMITFLOW_USDT");
        address compliance = vm.envAddress("REMITFLOW_COMPLIANCE");
        address pool = vm.envAddress("REMITFLOW_POOL");

        vm.startBroadcast(deployerKey);

        FeeDistributor feeDistributor = new FeeDistributor(deployer, pool);
        RemitCore remitCore = new RemitCore(compliance, address(feeDistributor));

        remitCore.addSupportedToken(usdc);
        remitCore.addSupportedToken(usdt);

        remitCore.addCorridor(keccak256(abi.encodePacked("US_PE")), true, 10 * 1e6, 10_000 * 1e6, 3_740_000, "PEN");
        remitCore.addCorridor(keccak256(abi.encodePacked("US_PH")), true, 10 * 1e6, 10_000 * 1e6, 56_200_000, "PHP");
        remitCore.addCorridor(keccak256(abi.encodePacked("US_ID")), true, 10 * 1e6, 10_000 * 1e6, 16_240_000, "IDR");
        remitCore.addCorridor(keccak256(abi.encodePacked("US_MX")), true, 10 * 1e6, 10_000 * 1e6, 17_200_000, "MXN");
        remitCore.addCorridor(keccak256(abi.encodePacked("US_VN")), true, 10 * 1e6, 10_000 * 1e6, 25_100_000, "VND");
        remitCore.addCorridor(keccak256(abi.encodePacked("US_CO")), true, 10 * 1e6, 10_000 * 1e6, 4_100_000, "COP");

        vm.stopBroadcast();

        console.log("REMITFLOW_FEE_DISTRIBUTOR=%s", address(feeDistributor));
        console.log("REMITFLOW_CORE=%s", address(remitCore));
    }
}
