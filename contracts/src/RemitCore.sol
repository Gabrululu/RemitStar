// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IComplianceGate {
    function canTransact(address user) external view returns (bool);
}

interface IFeeDistributor {
    function calculateFee(uint256 amount) external pure returns (uint256);
    function distributeFee(address token, uint256 feeAmount) external;
}

error TokenNotSupported();
error CorridorNotActive();
error NotCompliant();
error AmountOutOfRange();
error TransferIdExists();

contract RemitCore is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum TransferStatus { Pending, Completed, Refunded }

    struct Corridor {
        bool active;
        uint256 minAmount;
        uint256 maxAmount;
        uint256 exchangeRate;
        string destinationCurrency;
    }

    struct Transfer {
        address sender;
        address token;
        bytes32 corridorId;
        uint256 amountIn;
        uint256 amountOut;
        uint256 fee;
        uint256 timestamp;
        TransferStatus status;
    }

    address public complianceGate;
    address public feeDistributor;
    mapping(bytes32 => Corridor) public corridors;
    mapping(bytes32 => Transfer) public transfers;
    mapping(address => bool) public supportedTokens;
    uint256 public transferNonce;

    event RemittanceSent(
        bytes32 indexed transferId,
        address indexed sender,
        address indexed recipient,
        address token,
        uint256 amountIn,
        uint256 amountOut,
        uint256 fee,
        bytes32 corridorId
    );

    constructor(address complianceGate_, address feeDistributor_) Ownable(msg.sender) {
        complianceGate = complianceGate_;
        feeDistributor = feeDistributor_;
    }

    function addCorridor(
        bytes32 id,
        bool active,
        uint256 minAmount,
        uint256 maxAmount,
        uint256 exchangeRate,
        string calldata destinationCurrency
    ) external onlyOwner {
        corridors[id] = Corridor({
            active: active,
            minAmount: minAmount,
            maxAmount: maxAmount,
            exchangeRate: exchangeRate,
            destinationCurrency: destinationCurrency
        });
    }

    function updateCorridor(bytes32 id, bool active, uint256 exchangeRate) external onlyOwner {
        corridors[id].active = active;
        corridors[id].exchangeRate = exchangeRate;
    }

    function addSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = true;
    }

    function removeSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = false;
    }

    function setComplianceGate(address gate) external onlyOwner {
        complianceGate = gate;
    }

    function setFeeDistributor(address distributor) external onlyOwner {
        feeDistributor = distributor;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function sendRemittance(
        address token,
        bytes32 corridorId,
        uint256 amountIn,
        address recipient,
        bytes32 transferId
    ) external nonReentrant whenNotPaused returns (bytes32) {
        if (!supportedTokens[token]) revert TokenNotSupported();
        if (!corridors[corridorId].active) revert CorridorNotActive();
        if (!IComplianceGate(complianceGate).canTransact(msg.sender)) revert NotCompliant();
        if (!IComplianceGate(complianceGate).canTransact(recipient)) revert NotCompliant();

        if (amountIn < corridors[corridorId].minAmount || amountIn > corridors[corridorId].maxAmount) {
            revert AmountOutOfRange();
        }
        if (transfers[transferId].sender != address(0)) revert TransferIdExists();

        uint256 fee = IFeeDistributor(feeDistributor).calculateFee(amountIn);
        uint256 amountOut = ((amountIn - fee) * corridors[corridorId].exchangeRate) / 1e6;

        IERC20(token).safeTransferFrom(msg.sender, address(this), amountIn);
        IERC20(token).approve(feeDistributor, fee);
        IFeeDistributor(feeDistributor).distributeFee(token, fee);

        transfers[transferId] = Transfer({
            sender: msg.sender,
            token: token,
            corridorId: corridorId,
            amountIn: amountIn,
            amountOut: amountOut,
            fee: fee,
            timestamp: block.timestamp,
            status: TransferStatus.Completed
        });
        transferNonce++;

        emit RemittanceSent(transferId, msg.sender, recipient, token, amountIn, amountOut, fee, corridorId);
        return transferId;
    }

    function getTransfer(bytes32 id) external view returns (Transfer memory) {
        return transfers[id];
    }

    function getCorridor(bytes32 id) external view returns (Corridor memory) {
        return corridors[id];
    }

    function getQuote(bytes32 corridorId, uint256 amountIn, address /*token*/)
        external
        view
        returns (uint256 fee, uint256 netAmount, uint256 amountOut)
    {
        Corridor memory c = corridors[corridorId];
        fee = IFeeDistributor(feeDistributor).calculateFee(amountIn);
        netAmount = amountIn - fee;
        amountOut = (netAmount * c.exchangeRate) / 1e6;
    }
}
