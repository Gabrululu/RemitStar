import { AlertTriangle } from 'lucide-react';
import { useWallet } from '../../lib/hooks/useWallet';

export default function NetworkBanner() {
  const { isConnected, isCorrectNetwork, switchToPolkadot } = useWallet();

  if (!isConnected || isCorrectNetwork) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#FF8800]/10 border-b border-[#FF8800]/30 backdrop-blur-sm px-4 py-2.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-[#FF8800] text-sm">
        <AlertTriangle size={16} className="shrink-0" />
        <span>You're connected to the wrong network. RemitStar runs on Polkadot Hub Testnet.</span>
      </div>
      <button
        onClick={switchToPolkadot}
        className="shrink-0 bg-[#FF8800] hover:bg-[#FF9900] text-black font-bold text-xs px-3 py-1.5 rounded-lg transition-all"
      >
        Switch Network
      </button>
    </div>
  );
}
