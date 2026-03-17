import { Wallet, LogOut, AlertTriangle } from 'lucide-react';
import { useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { useWallet } from '../../lib/hooks/useWallet';

export default function WalletButton() {
  const { address, isConnected, isCorrectNetwork, connect, disconnect, switchToPolkadot, shortAddress } = useWallet();
  const { data: balance } = useBalance({ address });

  if (!isConnected) {
    return (
      <button
        onClick={() => connect()}
        className="flex items-center gap-2 bg-[#bdf500] hover:bg-[#d8ff7b] text-black font-bold px-4 py-2 rounded-xl transition-all text-sm"
      >
        <Wallet size={16} />
        Connect Wallet
      </button>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <button
        onClick={switchToPolkadot}
        className="flex items-center gap-2 bg-[#FF8800]/10 hover:bg-[#FF8800]/20 border border-[#FF8800]/30 text-[#FF8800] font-bold px-4 py-2 rounded-xl transition-all text-sm"
      >
        <AlertTriangle size={16} />
        Switch Network
      </button>
    );
  }

  const wndBalance = balance ? parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(3) : '…';

  return (
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
      <div className="flex items-center gap-2 bg-[#0a0a0a] border border-white/[0.12] rounded-xl px-3 py-2">
        <span className="text-[#8e9191] text-xs font-mono">{wndBalance} WND</span>
        <span className="w-px h-3 bg-white/[0.1]" />
        <span className="text-white text-sm font-mono font-medium">{shortAddress}</span>
      </div>
      <button
        onClick={() => disconnect()}
        className="text-[#8e9191] hover:text-white transition-colors p-2 rounded-xl hover:bg-white/[0.05]"
        title="Disconnect"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}
