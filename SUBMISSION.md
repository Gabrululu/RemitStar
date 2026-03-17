# RemitStar — Hackathon Submission

## Project Name
RemitStar

## Tracks
- [x] Track 1: EVM Smart Contracts — DeFi / Stablecoin-enabled dApp
- [x] OpenZeppelin Sponsor Track

## One-line Description
Instant cross-chain stablecoin remittances for LATAM & APAC on Polkadot Hub
— 0.30% fee, 6-second settlement, fully on-chain.

## Problem
Migrant workers sending money home pay 5–7% in fees and wait 1–3 days
for SWIFT/Western Union transfers. In corridors like USA→Peru or
Singapore→Philippines, this costs billions annually in unnecessary fees.

## Solution
RemitStar uses Polkadot Hub as a neutral settlement layer. Users send
USDC/USDT, the protocol routes through compliant smart contracts, and
recipients receive funds in ~6 seconds at 0.30% fee — entirely on-chain,
non-custodial, and transparent.

## Why Polkadot Hub?
- First EVM-compatible chain in the Polkadot ecosystem
- Native cross-chain capabilities via XCM (roadmap)
- Shared security from Polkadot relay chain
- Low fees and fast finality ideal for payment use cases

## OpenZeppelin Integration
Four contracts use OZ libraries in production-grade patterns:
- ComplianceGate: AccessControl with custom roles
- LiquidityPool: ERC4626 tokenized vault
- FeeDistributor: Ownable + ReentrancyGuard
- RemitCore: Pausable emergency controls

## Technical Highlights
- Full ERC4626 vault for liquidity providers
- Role-based KYC compliance system
- Atomic approve + transfer flow
- On-chain transfer history via events
- Live exchange rate quotes
- 5 active remittance corridors

## Contract Addresses (Polkadot Hub Testnet — chainId 420420417)
- MockUSDC:       0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B
- MockUSDT:       0x2bd8AbEB2F5598f8477560C70c742aFfc22912de
- ComplianceGate: 0xa89fb8A3f72C77cA15cfb8a1903f6Ef4D48bed82
- LiquidityPool:  0xe5038EF6DA68DdF1D0851674F75E152Cc13cE040
- FeeDistributor: 0x094F9e6a7aE4bb9d8d83dfb14F0cD4BD654e12af
- RemitCore:      0x710051f799D05afa3953B7af11A38C214Bc45B3F

## Frontend
https://remitstar.vercel.app

## Repository
https://github.com/Gabrululu/RemitStar
