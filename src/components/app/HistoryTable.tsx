import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { mockTransfers } from '../../data/mockData';

type Filter = 'All' | 'Completed' | 'Pending';

export default function HistoryTable() {
  const [filter, setFilter] = useState<Filter>('All');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = filter === 'All' ? mockTransfers : mockTransfers.filter((t) => t.status === filter);

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
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 px-5 py-3 text-[#8e9191] text-xs font-semibold uppercase tracking-widest border-b border-white/[0.06]">
          <span>Date</span>
          <span>Amount</span>
          <span>Corridor</span>
          <span>Status</span>
          <span>Fee</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#8e9191]">No transfers found</div>
        ) : (
          filtered.map((transfer, i) => (
            <div key={transfer.id}>
              <motion.button
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setExpandedRow(expandedRow === transfer.id ? null : transfer.id)}
                className="w-full grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_auto_auto] gap-3 md:gap-4 items-center px-5 py-4 border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors text-left"
              >
                <div>
                  <div className="text-white text-sm font-medium">{transfer.date.split(' ')[0]}</div>
                  <div className="text-[#8e9191] text-xs font-mono">{transfer.date.split(' ')[1]}</div>
                </div>
                <div>
                  <div className="text-white text-sm font-bold font-mono">{transfer.amount} {transfer.currency}</div>
                  <div className="text-[#bdf500] text-xs font-mono">
                    {transfer.received.toLocaleString()} {transfer.receivedCurrency}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>{transfer.fromFlag}</span>
                  <span className="text-[#8e9191]">→</span>
                  <span>{transfer.toFlag}</span>
                  <span className="text-[#8e9191] hidden md:inline">{transfer.corridor.split('→')[1]?.trim()}</span>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    transfer.status === 'Completed'
                      ? 'bg-[rgba(189,245,0,0.08)] text-[#bdf500] border border-[rgba(189,245,0,0.2)]'
                      : transfer.status === 'Pending'
                      ? 'bg-[#FF8800]/10 text-[#FF8800] border border-[#FF8800]/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {transfer.status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                    {transfer.status}
                  </span>
                </div>
                <div className="text-[#8e9191] text-sm font-mono">${transfer.fee.toFixed(2)}</div>
              </motion.button>

              <AnimatePresence>
                {expandedRow === transfer.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-4 bg-black border-b border-white/[0.05] grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-[#8e9191] text-xs mb-1">Recipient</div>
                        <div className="text-white font-mono">{transfer.recipient}</div>
                      </div>
                      <div>
                        <div className="text-[#8e9191] text-xs mb-1">Settlement</div>
                        <div className="text-[#bdf500] font-mono font-semibold">{transfer.settlementTime}</div>
                      </div>
                      <div>
                        <div className="text-[#8e9191] text-xs mb-1">Tx Hash</div>
                        <div className="flex items-center gap-1 text-[#bdf500] font-mono">
                          {transfer.txHash}
                          <ExternalLink size={12} />
                        </div>
                      </div>
                      <div>
                        <div className="text-[#8e9191] text-xs mb-1">Total fee</div>
                        <div className="text-white font-mono">${transfer.fee.toFixed(4)}</div>
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
