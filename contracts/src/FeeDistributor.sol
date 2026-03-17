// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IERC20 {
    function transferFrom(address, address, uint256) external returns (bool);
    function transfer(address, uint256) external returns (bool);
}

contract FeeDistributor is Ownable, ReentrancyGuard {
    uint256 public constant FEE_BPS = 30;
    uint256 public constant BPS_DENOMINATOR = 10_000;

    address public treasury;
    address public liquidityPool;
    uint256 public treasuryShare = 5000;
    uint256 public lpShare = 5000;
    uint256 public totalFeesDistributed;

    event FeeDistributed(address indexed token, uint256 total, uint256 treasuryPart, uint256 lpPart);

    constructor(address treasury_, address liquidityPool_) Ownable(msg.sender) {
        treasury = treasury_;
        liquidityPool = liquidityPool_;
    }

    function calculateFee(uint256 amount) public pure returns (uint256) {
        return (amount * FEE_BPS) / BPS_DENOMINATOR;
    }

    function distributeFee(address token, uint256 feeAmount) external nonReentrant {
        require(feeAmount > 0, "feeAmount must be > 0");
        require(IERC20(token).transferFrom(msg.sender, address(this), feeAmount), "transferFrom failed");

        uint256 treasuryPart = (feeAmount * treasuryShare) / BPS_DENOMINATOR;
        uint256 lpPart = feeAmount - treasuryPart;

        require(IERC20(token).transfer(treasury, treasuryPart), "transfer to treasury failed");
        require(IERC20(token).transfer(liquidityPool, lpPart), "transfer to pool failed");

        totalFeesDistributed += feeAmount;
        emit FeeDistributed(token, feeAmount, treasuryPart, lpPart);
    }

    function setShares(uint256 treasury_, uint256 lp_) external onlyOwner {
        require(treasury_ + lp_ == BPS_DENOMINATOR, "Must sum to 10000");
        treasuryShare = treasury_;
        lpShare = lp_;
    }

    function setTreasury(address treasury_) external onlyOwner {
        require(treasury_ != address(0), "Zero address");
        treasury = treasury_;
    }

    function setLiquidityPool(address lp_) external onlyOwner {
        require(lp_ != address(0), "Zero address");
        liquidityPool = lp_;
    }
}
