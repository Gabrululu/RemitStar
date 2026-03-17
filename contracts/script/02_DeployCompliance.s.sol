// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {ComplianceGate} from "../src/ComplianceGate.sol";
import {LiquidityPool} from "../src/LiquidityPool.sol";

contract DeployCompliance is Script {
    address constant MOCK_USDC = 0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B;

    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.envAddress("DEPLOYER_ADDRESS");

        vm.startBroadcast(deployerKey);

        ComplianceGate compliance = new ComplianceGate();
        LiquidityPool pool = new LiquidityPool(MOCK_USDC);

        pool.setComplianceGate(address(compliance));
        compliance.approveKyc(deployer);

        vm.stopBroadcast();

        console.log("REMITFLOW_COMPLIANCE=%s", address(compliance));
        console.log("REMITFLOW_POOL=%s", address(pool));
    }
}
