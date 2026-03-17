import { useState, useEffect, useCallback } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { parseAbiItem } from 'viem'
import { ADDRESSES, CORRIDORS, corridorId } from '../contracts'
import { formatUSDC } from '../utils/format'

interface ParsedTransfer {
  transferId: string
  sender: string
  recipient: string
  token: string
  tokenSymbol: string
  amountIn: string
  amountOut: string
  fee: string
  corridorId: string
  corridorLabel: string
  blockNumber: string
  txHash: string
}

const REMITTANCE_SENT_EVENT = parseAbiItem(
  'event RemittanceSent(bytes32 indexed transferId, address indexed sender, address indexed recipient, address token, uint256 amountIn, uint256 amountOut, uint256 fee, bytes32 corridorId)',
)

function getTokenSymbol(tokenAddress: string): string {
  const lower = tokenAddress.toLowerCase()
  if (lower === ADDRESSES.USDC.toLowerCase()) return 'USDC'
  if (lower === ADDRESSES.USDT.toLowerCase()) return 'USDT'
  return 'Unknown'
}

function getCorridorLabel(corridorHex: string): string {
  for (const c of CORRIDORS) {
    if (corridorId(c.id).toLowerCase() === corridorHex.toLowerCase()) {
      return c.label
    }
  }
  return corridorHex.slice(0, 10) + '...'
}

export function useTransferHistory() {
  const { address } = useAccount()
  const publicClient = usePublicClient()

  const [transfers, setTransfers] = useState<ParsedTransfer[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchLogs = useCallback(async () => {
    if (!address || !publicClient) return

    setIsLoading(true)
    try {
      const logs = await publicClient.getLogs({
        address: ADDRESSES.RemitCore,
        event: REMITTANCE_SENT_EVENT,
        fromBlock: 0n,
        toBlock: 'latest',
        args: { sender: address },
      })

      const parsed: ParsedTransfer[] = logs
        .map((log) => {
          const args = log.args as {
            transferId: `0x${string}`
            sender: `0x${string}`
            recipient: `0x${string}`
            token: `0x${string}`
            amountIn: bigint
            amountOut: bigint
            fee: bigint
            corridorId: `0x${string}`
          }

          const corridorHex = args.corridorId
          const amountOutNum = Number(args.amountOut) / 1e6

          return {
            transferId: args.transferId,
            sender: args.sender,
            recipient: args.recipient,
            token: args.token,
            tokenSymbol: getTokenSymbol(args.token),
            amountIn: formatUSDC(args.amountIn),
            amountOut: amountOutNum.toFixed(0),
            fee: formatUSDC(args.fee),
            corridorId: corridorHex,
            corridorLabel: getCorridorLabel(corridorHex),
            blockNumber: log.blockNumber?.toString() ?? '0',
            txHash: log.transactionHash ?? '',
          }
        })
        .sort((a, b) => Number(BigInt(b.blockNumber) - BigInt(a.blockNumber)))

      setTransfers(parsed)
    } catch (err) {
      // silently ignore — RPC error or no transfers yet
    } finally {
      setIsLoading(false)
    }
  }, [address, publicClient])

  useEffect(() => {
    void fetchLogs()
  }, [fetchLogs])

  return { transfers, isLoading, refetch: fetchLogs }
}
