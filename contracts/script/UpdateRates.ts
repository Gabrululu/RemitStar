/**
 * UpdateRates.ts
 *
 * Fetches live USD exchange rates from the ExchangeRate-API (free tier)
 * and calls RemitCore.updateCorridor() for each corridor if the rate
 * has moved more than THRESHOLD_PCT from the on-chain value.
 *
 * Usage:
 *   npx tsx contracts/script/UpdateRates.ts
 *
 * Env vars required (in contracts/.env):
 *   PRIVATE_KEY   — owner wallet private key (0x...)
 *   RPC_URL       — https://testnet-passet-hub-eth-rpc.polkadot.io
 *   EXCHANGE_API_KEY — free key from https://app.exchangerate-api.com
 *
 * Schedule with cron (every 10 minutes):
 *   cron: "0,10,20,30,40,50 * * * *" cd /path/to/RemitStar && npx tsx contracts/script/UpdateRates.ts >> logs/rates.log 2>&1
 */

import { createPublicClient, createWalletClient, http, defineChain, parseAbi, keccak256, toHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

// Auto-load contracts/.env regardless of cwd
dotenvConfig({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

// ─── Config ──────────────────────────────────────────────────────────────────

const REMIT_CORE = '0x710051f799D05afa3953B7af11A38C214Bc45B3F' as const;
const THRESHOLD_PCT = 0.5; // only update if rate moved > 0.5%

// Corridors: corridorId (matches keccak256 of the string used in Solidity) → target currency
const CORRIDORS: { id: string; currency: string }[] = [
  { id: 'US_PE', currency: 'PEN' },
  { id: 'US_PH', currency: 'PHP' },
  { id: 'US_ID', currency: 'IDR' },
  { id: 'US_MX', currency: 'MXN' },
  { id: 'US_CO', currency: 'COP' },
];

const ABI = parseAbi([
  'function corridors(bytes32) view returns (bool active, address token, uint256 minAmount, uint256 maxAmount, uint256 exchangeRate, string destinationCurrency)',
  'function updateCorridor(bytes32 id, bool active, uint256 exchangeRate) external',
]);

const polkadotHubTestnet = defineChain({
  id: 420420417,
  name: 'Polkadot Hub Testnet',
  nativeCurrency: { name: 'Westend', symbol: 'WND', decimals: 18 },
  rpcUrls: { default: { http: [process.env.RPC_URL ?? 'https://testnet-passet-hub-eth-rpc.polkadot.io'] } },
});

// ─── Fetch live rates ─────────────────────────────────────────────────────────

async function fetchRates(currencies: string[]): Promise<Record<string, number>> {
  const apiKey = process.env.EXCHANGE_API_KEY;
  if (!apiKey) throw new Error('EXCHANGE_API_KEY not set in .env');

  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ExchangeRate API error: ${res.status}`);

  const data = await res.json() as { conversion_rates: Record<string, number> };
  const rates: Record<string, number> = {};
  for (const currency of currencies) {
    const rate = data.conversion_rates[currency];
    if (!rate) throw new Error(`Rate not found for ${currency}`);
    rates[currency] = rate;
  }
  return rates;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
  if (!privateKey) throw new Error('PRIVATE_KEY not set in .env');

  const account = privateKeyToAccount(privateKey);
  const transport = http(process.env.RPC_URL);

  const publicClient = createPublicClient({ chain: polkadotHubTestnet, transport });
  const walletClient = createWalletClient({ account, chain: polkadotHubTestnet, transport });

  // Fetch live rates from API
  const currencies = CORRIDORS.map((c) => c.currency);
  console.log(`[${new Date().toISOString()}] Fetching rates for: ${currencies.join(', ')}`);
  const liveRates = await fetchRates(currencies);

  for (const corridor of CORRIDORS) {
    const corridorId = keccak256(toHex(corridor.id)) as `0x${string}`;

    // Read current on-chain rate
    const onchain = await publicClient.readContract({
      address: REMIT_CORE,
      abi: ABI,
      functionName: 'corridors',
      args: [corridorId],
    }) as [boolean, string, bigint, bigint, bigint, string];

    const onchainRateScaled = onchain[4]; // exchangeRate (rate * 1e6)
    const onchainRate = Number(onchainRateScaled) / 1e6;
    const liveRate = liveRates[corridor.currency];

    const deviation = Math.abs((liveRate - onchainRate) / onchainRate) * 100;

    console.log(
      `  ${corridor.id}: on-chain=${onchainRate.toFixed(4)} | live=${liveRate.toFixed(4)} | deviation=${deviation.toFixed(2)}%`
    );

    if (deviation < THRESHOLD_PCT) {
      console.log(`    → Skipped (below ${THRESHOLD_PCT}% threshold)`);
      continue;
    }

    // Rate has moved enough — update on-chain
    const newRateScaled = BigInt(Math.round(liveRate * 1e6));
    console.log(`    → Updating: ${onchainRate} → ${liveRate} (${newRateScaled})`);

    const hash = await walletClient.writeContract({
      address: REMIT_CORE,
      abi: ABI,
      functionName: 'updateCorridor',
      args: [corridorId, true, newRateScaled],
    });

    await publicClient.waitForTransactionReceipt({ hash });
    console.log(`    ✓ Updated. tx: ${hash}`);
  }

  console.log(`[${new Date().toISOString()}] Done.\n`);
}

main().catch((err) => {
  console.error('UpdateRates failed:', err);
  process.exit(1);
});
