import { useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { ADDRESSES, REMIT_CORE_ABI, LIQUIDITY_POOL_ABI } from '../../lib/contracts';
import { formatUSDC } from '../../lib/utils/format';

export default function StatsBar() {
  const { data: nonce, refetch: refetchNonce } = useReadContract({
    address: ADDRESSES.RemitCore,
    abi: REMIT_CORE_ABI,
    functionName: 'transferNonce',
    query: { refetchInterval: 30_000 },
  });

  const { data: totalAssets, refetch: refetchAssets } = useReadContract({
    address: ADDRESSES.LiquidityPool,
    abi: LIQUIDITY_POOL_ABI,
    functionName: 'totalAssets',
    query: { refetchInterval: 30_000 },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      void refetchNonce();
      void refetchAssets();
    }, 30_000);
    return () => clearInterval(interval);
  }, [refetchNonce, refetchAssets]);

  const stats = [
    { label: 'Transfers', value: nonce !== undefined ? nonce.toString() : '…' },
    { label: 'Total TVL', value: totalAssets !== undefined ? `$${formatUSDC(totalAssets as bigint)}` : '…' },
    { label: 'Avg. Settlement', value: '5.8s' },
    { label: 'Avg. Fee', value: '0.30%' },
    { label: 'Supported Corridors', value: '5' },
    { label: 'Network', value: 'Polkadot Hub' },
    { label: 'Uptime', value: '99.98%' },
    { label: 'Countries', value: '5+' },
  ];

  return (
    <div className="border-y border-white/[0.07] bg-[#060606] overflow-hidden">
      <div className="stats-marquee flex py-4">
        {[...stats, ...stats, ...stats].map((stat, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0 px-8">
            <span className="text-[#747878] text-[0.72rem] font-medium whitespace-nowrap">{stat.label}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[#bdf500] text-[0.78rem] font-bold font-mono whitespace-nowrap">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
