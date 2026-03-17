import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'

const POLKADOT_CHAIN_ID = 420420417

export function useWallet() {
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  const isCorrectNetwork = chainId === POLKADOT_CHAIN_ID

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''

  function connectWallet(connectorIndex = 0) {
    const connector = connectors[connectorIndex] ?? connectors[0]
    if (connector) connect({ connector })
  }

  function switchToPolkadot() {
    switchChain({ chainId: POLKADOT_CHAIN_ID })
  }

  return {
    address,
    isConnected,
    chainId,
    isCorrectNetwork,
    connect: connectWallet,
    disconnect,
    switchToPolkadot,
    shortAddress,
  }
}
