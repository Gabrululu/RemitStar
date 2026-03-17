import { formatUnits } from 'viem'

export function formatUSDC(amount: bigint): string {
  const whole = amount / 1_000_000n
  const frac = amount % 1_000_000n
  const fracStr = frac.toString().padStart(6, '0').slice(0, 2)
  return `${whole.toString()}.${fracStr}`
}

export function parseUSDC(amount: string): bigint {
  if (!amount || amount.trim() === '') return 0n
  const [whole = '0', frac = ''] = amount.split('.')
  const fracPadded = frac.slice(0, 6).padEnd(6, '0')
  return BigInt(whole) * 1_000_000n + BigInt(fracPadded)
}

export function formatDestAmount(amount: bigint, currency: string): string {
  if (currency === 'IDR' || currency === 'VND') {
    const formatted = formatUnits(amount, 0)
    const withCommas = Number(formatted).toLocaleString('en-US', { maximumFractionDigits: 0 })
    return `${withCommas} ${currency}`
  }
  const value = (Number(amount) / 1e6).toFixed(2)
  return `${value} ${currency}`
}

export function shortenAddress(address: string): string {
  if (!address || address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatTxHash(hash: string): string {
  if (!hash || hash.length < 16) return hash
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`
}
