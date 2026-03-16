import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, TrendingUp, Info, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { poolStats } from '../../data/mockData';

export default function LiquidityPool() {
  const [tab, setTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');

  return (
    <div className="max-w-4xl mx-auto w-full">
      <h2 className="text-white font-bold text-xl mb-6">Liquidity Pool</h2>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total TVL', value: poolStats.tvl, icon: <Droplets size={18} /> },
          { label: 'Pool APY', value: poolStats.apy, icon: <TrendingUp size={18} /> },
          { label: 'Volume 24h', value: poolStats.volume24h, icon: <TrendingUp size={18} /> },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-3 text-[#bdf500]">
              {stat.icon}
              <span className="text-[#8e9191] text-sm">{stat.label}</span>
            </div>
            <div className="text-white font-black text-2xl font-mono">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-bold">Your Position</h3>
            <div className="flex items-center gap-1.5 bg-[rgba(189,245,0,0.08)] border border-[rgba(189,245,0,0.2)] text-[#bdf500] text-xs font-semibold px-3 py-1 rounded-full">
              <Info size={12} />
              ERC4626 Vault
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-black rounded-xl p-4 border border-white/[0.06]">
              <div className="text-[#8e9191] text-xs mb-1">Deposited</div>
              <div className="text-white text-2xl font-black font-mono">
                {poolStats.yourDeposit} <span className="text-[#8e9191] text-sm font-normal">USDC</span>
              </div>
            </div>
            <div className="bg-black rounded-xl p-4 border border-white/[0.06]">
              <div className="text-[#8e9191] text-xs mb-1">Earned fees</div>
              <div className="text-[#bdf500] text-2xl font-black font-mono">
                {poolStats.earned} <span className="text-[#8e9191] text-sm font-normal">USDC</span>
              </div>
            </div>
            <div className="bg-black rounded-xl p-4 border border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-[#8e9191] text-xs mb-0.5">Share of pool</div>
                <div className="text-white font-bold font-mono">0.00%</div>
              </div>
              <div>
                <div className="text-[#8e9191] text-xs mb-0.5">Current APY</div>
                <div className="text-[#bdf500] font-bold font-mono">{poolStats.apy}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setTab('deposit')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                tab === 'deposit'
                  ? 'bg-[#bdf500] text-black'
                  : 'bg-white/[0.05] text-[#8e9191] hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <ArrowDownToLine size={16} />
              Deposit
            </button>
            <button
              onClick={() => setTab('withdraw')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                tab === 'withdraw'
                  ? 'bg-[#bdf500] text-black'
                  : 'bg-white/[0.05] text-[#8e9191] hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <ArrowUpFromLine size={16} />
              Withdraw
            </button>
          </div>

          <div className="mb-4">
            <label className="text-[#8e9191] text-xs font-semibold uppercase tracking-widest mb-2 block">
              Amount (USDC)
            </label>
            <div className="bg-black border border-white/[0.08] focus-within:border-[rgba(189,245,0,0.35)] rounded-xl px-4 py-3 flex items-center gap-3 transition-colors">
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent text-white text-2xl font-bold font-mono outline-none"
              />
              <button className="text-[#bdf500] text-xs font-bold hover:text-[#d8ff7b]">MAX</button>
            </div>
          </div>

          <div className="bg-black rounded-xl p-3 border border-white/[0.06] mb-4 text-sm space-y-2">
            <div className="flex justify-between text-[#8e9191]">
              <span>Pool share after</span>
              <span className="text-white">0.00%</span>
            </div>
            <div className="flex justify-between text-[#8e9191]">
              <span>Estimated APY</span>
              <span className="text-[#bdf500] font-semibold">{poolStats.apy}</span>
            </div>
          </div>

          <button
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full bg-[#bdf500] hover:bg-[#d8ff7b] disabled:bg-white/[0.07] disabled:text-white/30 text-black font-bold py-3.5 rounded-xl transition-all capitalize"
          >
            {tab === 'deposit' ? 'Deposit USDC' : 'Withdraw USDC'}
          </button>
        </div>
      </div>
    </div>
  );
}
