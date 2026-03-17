import { useEffect } from 'react'
import { useAccount, usePublicClient, useReadContracts, useWriteContract } from 'wagmi'
import { maxUint256 } from 'viem'
import { ADDRESSES, ERC20_ABI, LIQUIDITY_POOL_ABI } from '../contracts'

interface PoolStats {
  totalAssets: bigint
  totalShares: bigint
  feesCollected: bigint
}

export function useLiquidityPool() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        address: ADDRESSES.LiquidityPool,
        abi: LIQUIDITY_POOL_ABI,
        functionName: 'getPoolStats',
      },
      {
        address: ADDRESSES.LiquidityPool,
        abi: LIQUIDITY_POOL_ABI,
        functionName: 'balanceOf',
        args: [address ?? '0x0000000000000000000000000000000000000000'],
      },
    ],
    query: {
      enabled: !!address,
      refetchInterval: 30_000,
    },
  })

  useEffect(() => {
    const interval = setInterval(() => { void refetch() }, 30_000)
    return () => clearInterval(interval)
  }, [refetch])

  const rawStats = data?.[0]?.result as [bigint, bigint, bigint] | undefined
  const userShares = (data?.[1]?.result as bigint | undefined) ?? 0n

  const poolStats: PoolStats | undefined = rawStats
    ? {
        totalAssets: rawStats[0],
        totalShares: rawStats[1],
        feesCollected: rawStats[2],
      }
    : undefined

  const userAssetValue =
    poolStats && poolStats.totalShares > 0n
      ? (userShares * poolStats.totalAssets) / poolStats.totalShares
      : 0n

  // Fee yield: LP share of collected fees relative to pool TVL
  const apy: string =
    poolStats && poolStats.totalAssets > 0n
      ? poolStats.feesCollected > 0n
        ? (Number((poolStats.feesCollected * 10000n) / poolStats.totalAssets) / 100).toFixed(2) + '%'
        : '0.00%'
      : '—'

  async function deposit(assets: bigint): Promise<void> {
    if (!address || !publicClient) return

    const approveTx = await writeContractAsync({
      address: ADDRESSES.USDC,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [ADDRESSES.LiquidityPool, maxUint256],
    })
    await publicClient.waitForTransactionReceipt({ hash: approveTx })

    const depositTx = await writeContractAsync({
      address: ADDRESSES.LiquidityPool,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'deposit',
      args: [assets, address],
    })
    await publicClient.waitForTransactionReceipt({ hash: depositTx })
    void refetch()
  }

  async function withdraw(assets: bigint): Promise<void> {
    if (!address || !publicClient) return

    const withdrawTx = await writeContractAsync({
      address: ADDRESSES.LiquidityPool,
      abi: LIQUIDITY_POOL_ABI,
      functionName: 'withdraw',
      args: [assets, address, address],
    })
    await publicClient.waitForTransactionReceipt({ hash: withdrawTx })
    void refetch()
  }

  return { poolStats, userShares, userAssetValue, apy, isLoading, deposit, withdraw }
}
