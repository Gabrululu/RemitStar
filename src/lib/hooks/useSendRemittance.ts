import { useState } from 'react'
import { useAccount, usePublicClient, useWriteContract } from 'wagmi'
import { keccak256, encodePacked, maxUint256 } from 'viem'
import { ADDRESSES, ERC20_ABI, REMIT_CORE_ABI, corridorId } from '../contracts'

type Step = 'idle' | 'approving' | 'sending' | 'confirming' | 'success' | 'error'

interface QuoteResult {
  fee: bigint
  netAmount: bigint
  amountOut: bigint
}

interface SendParams {
  token: `0x${string}`
  corridorId: string
  amountIn: bigint
  recipient: `0x${string}`
}

export function useSendRemittance() {
  const [step, setStep] = useState<Step>('idle')
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const [transferId, setTransferId] = useState<`0x${string}` | undefined>()
  const [error, setError] = useState<string | undefined>()

  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  const isLoading = step === 'approving' || step === 'sending' || step === 'confirming'

  async function getQuote(
    corridorIdStr: string,
    amountIn: bigint,
    token: `0x${string}`,
  ): Promise<QuoteResult> {
    if (!publicClient) throw new Error('No public client')
    const result = await publicClient.readContract({
      address: ADDRESSES.RemitCore,
      abi: REMIT_CORE_ABI,
      functionName: 'getQuote',
      args: [corridorId(corridorIdStr), amountIn, token],
    })
    const [fee, netAmount, amountOut] = result as [bigint, bigint, bigint]
    return { fee, netAmount, amountOut }
  }

  async function send(params: SendParams): Promise<void> {
    if (!address || !publicClient) {
      setError('Wallet not connected')
      setStep('error')
      return
    }

    try {
      setError(undefined)
      setStep('approving')

      const allowance = await publicClient.readContract({
        address: params.token,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address, ADDRESSES.RemitCore],
      }) as bigint

      if (allowance < params.amountIn) {
        const approveTx = await writeContractAsync({
          address: params.token,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [ADDRESSES.RemitCore, maxUint256],
        })
        await publicClient.waitForTransactionReceipt({ hash: approveTx })
      }

      setStep('sending')

      const generatedTransferId = keccak256(
        encodePacked(
          ['address', 'uint256', 'uint256'],
          [address, params.amountIn, BigInt(Date.now())],
        ),
      )

      const corridorBytes32 = corridorId(params.corridorId)

      const sendTx = await writeContractAsync({
        address: ADDRESSES.RemitCore,
        abi: REMIT_CORE_ABI,
        functionName: 'sendRemittance',
        args: [
          params.token,
          corridorBytes32,
          params.amountIn,
          params.recipient,
          generatedTransferId,
        ],
      })

      setStep('confirming')
      setTxHash(sendTx)

      await publicClient.waitForTransactionReceipt({ hash: sendTx })

      setTransferId(generatedTransferId)
      setStep('success')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
      setStep('error')
    }
  }

  function reset() {
    setStep('idle')
    setTxHash(undefined)
    setTransferId(undefined)
    setError(undefined)
  }

  return { step, txHash, transferId, error, isLoading, getQuote, send, reset }
}
