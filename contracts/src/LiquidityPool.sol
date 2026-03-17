// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IComplianceGate {
    function canTransact(address user) external view returns (bool);
}

error NotCompliant();

contract LiquidityPool is ERC4626, Ownable, Pausable {
    using SafeERC20 for IERC20;

    address public complianceGate;
    uint256 public totalFeesCollected;
    mapping(address => uint256) public userDeposits;

    event Deposited(address indexed sender, address indexed receiver, uint256 assets);
    event Withdrawn(address indexed sender, address indexed receiver, uint256 assets);
    event FeesCollected(uint256 amount);

    constructor(address asset_)
        ERC4626(IERC20(asset_))
        ERC20("RemitStar LP", "rfLP")
        Ownable(msg.sender)
    {}

    function setComplianceGate(address gate) external onlyOwner {
        complianceGate = gate;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function deposit(uint256 assets, address receiver) public override whenNotPaused returns (uint256) {
        if (complianceGate != address(0)) {
            if (!IComplianceGate(complianceGate).canTransact(msg.sender)) revert NotCompliant();
        }
        userDeposits[receiver] += assets;
        uint256 shares = super.deposit(assets, receiver);
        emit Deposited(msg.sender, receiver, assets);
        return shares;
    }

    function withdraw(uint256 assets, address receiver, address owner_) public override whenNotPaused returns (uint256) {
        if (complianceGate != address(0)) {
            if (!IComplianceGate(complianceGate).canTransact(msg.sender)) revert NotCompliant();
        }
        uint256 shares = super.withdraw(assets, receiver, owner_);
        emit Withdrawn(msg.sender, receiver, assets);
        return shares;
    }

    function collectFees(uint256 amount) external onlyOwner {
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), amount);
        totalFeesCollected += amount;
        emit FeesCollected(amount);
    }

    function getPoolStats() external view returns (uint256 totalAssets_, uint256 totalShares, uint256 feesCollected) {
        return (totalAssets(), totalSupply(), totalFeesCollected);
    }
}
