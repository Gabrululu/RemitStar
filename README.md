# RemitStar

> Cross-chain stablecoin remittances for LATAM & APAC — powered by Polkadot Hub

## What is RemitStar?

RemitStar is a decentralized remittance protocol that enables instant,
low-cost international money transfers using stablecoins on Polkadot Hub.
Send USDC or USDT from any EVM chain to recipients in Peru, Philippines,
Indonesia, Mexico, or Colombia — settled in ~6 seconds at 0.30% fee.

Traditional services charge 5–7% and take 1–3 days. RemitStar changes that.

## Live Demo

- Frontend: https://remit-star.vercel.app
- Network: Polkadot Hub Testnet (chainId: 420420417)
- Explorer: https://blockscout-passet-hub.parity-testnet.parity.io

## Deployed Contracts (Polkadot Hub Testnet)

| Contract | Address |
|---|---|
| MockUSDC | 0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B |
| MockUSDT | 0x2bd8AbEB2F5598f8477560C70c742aFfc22912de |
| ComplianceGate | 0xa89fb8A3f72C77cA15cfb8a1903f6Ef4D48bed82 |
| LiquidityPool | 0xe5038EF6DA68DdF1D0851674F75E152Cc13cE040 |
| FeeDistributor | 0x094F9e6a7aE4bb9d8d83dfb14F0cD4BD654e12af |
| RemitCore | 0x710051f799D05afa3953B7af11A38C214Bc45B3F |

## Architecture

```
User (any EVM chain)
│
▼
RemitCore.sol          ← Main entry point, route + compliance check
├── ComplianceGate.sol   ← OZ AccessControl, KYC/blacklist
├── FeeDistributor.sol   ← OZ Ownable, splits 0.30% fee
└── LiquidityPool.sol    ← OZ ERC4626 vault, LP deposits
```

## Supported Corridors

| Route | Currency | Rate | Updated |
|---|---|---|---|
| USA → Peru | PEN | 1 USDC = 3.45 PEN | Mar 18, 2026 |
| USA → Philippines | PHP | 1 USDC = 59.81 PHP | Mar 18, 2026 |
| USA → Indonesia | IDR | 1 USDC = 16,980 IDR | Mar 18, 2026 |
| USA → Mexico | MXN | 1 USDC = 17.68 MXN | Mar 18, 2026 |
| USA → Colombia | COP | 1 USDC = 3,701 COP | Mar 18, 2026 |

## Smart Contract Stack

- **Solidity** 0.8.24
- **Foundry** — build, test, deploy
- **OpenZeppelin** — AccessControl, ERC4626, Ownable, Pausable, ReentrancyGuard
- **Network** — Polkadot Hub Testnet (chainId 420420417)

## Frontend Stack

- React + TypeScript + Vite
- wagmi v2 + viem
- TailwindCSS
- WalletConnect v3

## OpenZeppelin Usage (Sponsor Track)

RemitStar uses OpenZeppelin in non-trivial ways across all contracts:

- `AccessControl` in ComplianceGate — role-based KYC/blacklist system
  with `KYC_OPERATOR_ROLE` and `PAUSER_ROLE`
- `ERC4626` in LiquidityPool — tokenized vault where LPs earn from
  protocol fees; shares represent proportional pool ownership
- `Ownable` + `ReentrancyGuard` in FeeDistributor — secure fee splitting
  with reentrancy protection on token transfers
- `Pausable` in RemitCore + LiquidityPool — emergency circuit breaker

## How It Works

1. User connects wallet (MetaMask or WalletConnect)
2. Selects amount, stablecoin (USDC/USDT), and destination corridor
3. RemitStar calculates live quote: fee + destination amount
4. User approves token spending + calls `sendRemittance()`
5. RemitCore validates compliance, deducts 0.30% fee, logs transfer
6. FeeDistributor splits fee: 50% to treasury, 50% to liquidity pool
7. Transfer recorded on-chain, visible in history

## Running Locally

```bash
# Contracts
cd contracts
cp .env.example .env  # add your PRIVATE_KEY
forge build
forge test

# Frontend
cd ..
cp .env.example .env  # add VITE_WC_PROJECT_ID
npm install
npm run dev
```

## Test the Faucet

Get test USDC/USDT directly from the contracts:

```bash
cast send 0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B \
  "faucet(address,uint256)" \
  YOUR_ADDRESS 1000000000 \
  --rpc-url https://testnet-passet-hub-eth-rpc.polkadot.io \
  --private-key YOUR_KEY
```

