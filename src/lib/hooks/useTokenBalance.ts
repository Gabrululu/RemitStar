import { useReadContracts } from 'wagmi'
import { useAccount } from 'wagmi'
import { ERC20_ABI } from '../contracts'

export function useTokenBalance(tokenAddress: `0x${string}`) {
  const { address } = useAccount()

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address ?? '0x0000000000000000000000000000000000000000'],
      },
      {
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'symbol',
      },
    ],
    query: {
      enabled: !!address,
      refetchInterval: 10_000,
    },
  })

  const balance = (data?.[0]?.result as bigint | undefined) ?? 0n
  const symbol = (data?.[1]?.result as string | undefined) ?? ''

  const whole = balance / 1_000_000n
  const frac = balance % 1_000_000n
  const fracStr = frac.toString().padStart(6, '0').slice(0, 2)
  const formatted = `${whole.toString()}.${fracStr}`

  return { balance, formatted, symbol, isLoading, refetch }
}
