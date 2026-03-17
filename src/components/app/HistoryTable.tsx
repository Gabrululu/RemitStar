import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { useTransferHistory } from '../../lib/hooks/useTransferHistory';
import { useWallet } from '../../lib/hooks/useWallet';
import { CORRIDORS, corridorId as calcCorridorId } from '../../lib/contracts';
import { useExchangeRates } from '../../lib/hooks/useExchangeRates';
import { formatTxHash } from '../../lib/utils/format';

type Filter = 'All' | 'Completed' | 'Pending';

const EXPLORER_BASE = 'https://blockscout-passet-hub.parity-testnet.parity.io/tx/';

function findCorridorFlag(corridorHex: string): string {
  for (const c of CORRIDORS) {
    if (calcCorridorId(c.id).toLowerCase() === corridorHex.toLowerCase()) {
      return c.flag;
    }
  }
  return '🌐';
}

export default function HistoryTable() {
  const [filter, setFilter] = useState<Filter>('All');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { isConnected } = useWallet();
  const { transfers, isLoading, refetch } = useTransferHistory();
  const { rates, isLoading: ratesLoading } = useExchangeRates();

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-white font-bold text-xl mb-6">Transfer History</h2>
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl py-16 text-center text-[#8e9191]">
          Connect your wallet to see your transfers
        </div>
      </div>
    );
  }

  const filtered = filter === 'All' ? transfers : transfers.filter(() => filter === 'Completed');

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-xl">Transfer History</h2>
        <div className="flex gap-2">
          {(['All', 'Completed', 'Pending'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-[#bdf500] text-black font-bold'
                  : 'bg-white/[0.05] text-[#8e9191] hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={() => void refetch()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-white/[0.05] text-[#8e9191] hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_auto_auto] gap-4 px-5 py-3 text-[#8e9191] text-xs font-semibold uppercase tracking-widest border-b border-white/[0.06]">
          <span>Block</span>
          <span>Amount</span>
          <span>Corridor</span>
          <span>Current Value</span>
          <span>Status</span>
          <span>Fee</span>
        </div>

        {isLoading && filtered.length === 0 ? (
          <div className="flex flex-col gap-0">
            {[0, 1, 2].map((i) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1fr_auto_auto] gap-4 px-5 py-4 border-b border-white/[0.05]">
                <div className="h-4 bg-white/[0.06] rounded animate-pulse" />
                <div className="h-4 bg-white/[0.06] rounded animate-pulse" />
                <div className="h-4 bg-white/[0.06] rounded animate-pulse hidden md:block" />
                <div className="h-4 bg-white/[0.06] rounded animate-pulse hidden md:block" />
                <div className="h-4 w-16 bg-white/[0.06] rounded animate-pulse hidden md:block" />
                <div className="h-4 w-12 bg-white/[0.06] rounded animate-pulse hidden md:block" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[#8e9191]">No transfers found</div>
        ) : (
          filtered.map((transfer, i) => (
            <div key={transfer.transferId}>
              <motion.button
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setExpandedRow(expandedRow === transfer.transferId ? null : transfer.transferId)}
                className="w-full grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1fr_auto_auto] gap-3 md:gap-4 items-center px-5 py-4 border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors text-left"
              >
                <div>
                  <div className="text-white text-sm font-medium">Block #{transfer.blockNumber}</div>
                  <div className="text-[#8e9191] text-xs font-mono">{formatTxHash(transfer.txHash)}</div>
                </div>
                <div>
                  <div className="text-white text-sm font-bold font-mono">{transfer.amountIn} {transfer.tokenSymbol}</div>
                  <div className="text-[#bdf500] text-xs font-mono">{transfer.amountOut} {(() => {
                    const c = CORRIDORS.find(cor => calcCorridorId(cor.id).toLowerCase() === transfer.corridorId.toLowerCase());
                    return c?.currency ?? '';
                  })()}</div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>🇺🇸</span>
                  <span className="text-[#8e9191]">→</span>
                  <span>{findCorridorFlag(transfer.corridorId)}</span>
                  <span className="text-[#8e9191] hidden md:inline">{transfer.corridorLabel.split('→')[1]?.trim()}</span>
                </div>
                <div className="hidden md:block">
                  {(() => {
                    const c = CORRIDORS.find(cor => calcCorridorId(cor.id).toLowerCase() === transfer.corridorId.toLowerCase());
                    const liveRate = c ? (rates?.[c.currency] ?? c.rate) : null;
                    const amtNum = parseFloat(transfer.amountIn);
                    if (!c || ratesLoading || liveRate === null || isNaN(amtNum)) {
                      return <span className="text-[#8e9191] text-sm font-mono">—</span>;
                    }
                    return (
                      <div>
                        <div className="text-white text-sm font-mono">{(amtNum * liveRate).toFixed(2)} {c.currency}</div>
                        <div className="text-[#4a4d4d] text-xs">at today's rate</div>
                      </div>
                    );
                  })()}
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[rgba(189,245,0,0.08)] text-[#bdf500] border border-[rgba(189,245,0,0.2)]">
                    Completed
                  </span>
                </div>
                <div className="text-[#8e9191] text-sm font-mono">{transfer.fee} USDC</div>
              </motion.button>

              <AnimatePresence>
                {expandedRow === transfer.transferId && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-4 bg-black border-b border-white/[0.05] grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-[#8e9191] text-xs mb-1">Recipient</div>
                        <div className="text-white font-mono text-xs">{transfer.recipient.slice(0, 10)}...{transfer.recipient.slice(-6)}</div>
                      </div>
                      <div>
                        <div className="text-[#8e9191] text-xs mb-1">Settlement</div>
                        <div className="text-[#bdf500] font-mono font-semibold">~6s</div>
                      </div>
                      <div>
                        <div className="text-[#8e9191] text-xs mb-1">Tx Hash</div>
                        <a
                          href={`${EXPLORER_BASE}${transfer.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[#bdf500] font-mono hover:text-[#d8ff7b]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {formatTxHash(transfer.txHash)}
                          <ExternalLink size={12} />
                        </a>
                      </div>
                      <div>
                        <div className="text-[#8e9191] text-xs mb-1">Total fee</div>
                        <div className="text-white font-mono">{transfer.fee} USDC</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
