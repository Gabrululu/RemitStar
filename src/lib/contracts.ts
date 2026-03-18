import { keccak256, toHex } from 'viem'

export const ADDRESSES = {
  USDC:           '0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B' as `0x${string}`,
  USDT:           '0x2bd8AbEB2F5598f8477560C70c742aFfc22912de' as `0x${string}`,
  ComplianceGate: '0xa89fb8A3f72C77cA15cfb8a1903f6Ef4D48bed82' as `0x${string}`,
  LiquidityPool:  '0xe5038EF6DA68DdF1D0851674F75E152Cc13cE040' as `0x${string}`,
  FeeDistributor: '0x094F9e6a7aE4bb9d8d83dfb14F0cD4BD654e12af' as `0x${string}`,
  RemitCore:      '0x710051f799D05afa3953B7af11A38C214Bc45B3F' as `0x${string}`,
} as const

export const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'faucet',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

export const REMIT_CORE_ABI = [
  {
    name: 'sendRemittance',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'corridorId', type: 'bytes32' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'recipient', type: 'address' },
      { name: 'transferId', type: 'bytes32' },
    ],
    outputs: [{ name: '', type: 'bytes32' }],
  },
  {
    name: 'getQuote',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'corridorId', type: 'bytes32' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'token', type: 'address' },
    ],
    outputs: [
      { name: 'fee', type: 'uint256' },
      { name: 'netAmount', type: 'uint256' },
      { name: 'amountOut', type: 'uint256' },
    ],
  },
  {
    name: 'getCorridor',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'id', type: 'bytes32' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'active', type: 'bool' },
          { name: 'minAmount', type: 'uint256' },
          { name: 'maxAmount', type: 'uint256' },
          { name: 'exchangeRate', type: 'uint256' },
          { name: 'destinationCurrency', type: 'string' },
        ],
      },
    ],
  },
  {
    name: 'getTransfer',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'id', type: 'bytes32' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'sender', type: 'address' },
          { name: 'token', type: 'address' },
          { name: 'corridorId', type: 'bytes32' },
          { name: 'amountIn', type: 'uint256' },
          { name: 'amountOut', type: 'uint256' },
          { name: 'fee', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'status', type: 'uint8' },
        ],
      },
    ],
  },
  {
    name: 'supportedTokens',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'token', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'transferNonce',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

export const LIQUIDITY_POOL_ABI = [
  {
    name: 'deposit',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'assets', type: 'uint256' },
      { name: 'receiver', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'withdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'assets', type: 'uint256' },
      { name: 'receiver', type: 'address' },
      { name: 'owner', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'totalAssets',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'getPoolStats',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'totalAssets_', type: 'uint256' },
      { name: 'totalShares', type: 'uint256' },
      { name: 'feesCollected', type: 'uint256' },
    ],
  },
  {
    name: 'asset',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'previewRedeem',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'shares', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

export const COMPLIANCE_ABI = [
  {
    name: 'canTransact',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'kycApproved',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'blacklisted',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'approveKYC',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [],
  },
] as const

export const CORRIDORS = [
  { id: 'US_PE', label: 'USA → Peru',        flag: '🇵🇪', currency: 'PEN', rate: 3.45     },
  { id: 'US_PH', label: 'USA → Philippines', flag: '🇵🇭', currency: 'PHP', rate: 59.81    },
  { id: 'US_ID', label: 'USA → Indonesia',   flag: '🇮🇩', currency: 'IDR', rate: 16980    },
  { id: 'US_MX', label: 'USA → Mexico',      flag: '🇲🇽', currency: 'MXN', rate: 17.68    },
  { id: 'US_CO', label: 'USA → Colombia',    flag: '🇨🇴', currency: 'COP', rate: 3701     },
] as const

export function corridorId(id: string): `0x${string}` {
  return keccak256(toHex(id))
}
