// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDC is ERC20, Ownable {
    uint256 public constant MAX_FAUCET = 10_000 * 10 ** 6;

    constructor() ERC20("Mock USD Coin", "USDC") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** 6);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function faucet(address to, uint256 amount) external {
        require(amount <= MAX_FAUCET, "Max 10k USDC");
        _mint(to, amount);
    }
}
