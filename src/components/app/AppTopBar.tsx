import React, { useState } from 'react';
import { Wallet, ChevronDown, Bell } from 'lucide-react';

interface AppTopBarProps {
  pageTitle: string;
}

export default function AppTopBar({ pageTitle }: AppTopBarProps) {
  const [connected, setConnected] = useState(false);

  const mockAddress = '0xA4b2...9cD3';

  return (
    <header className="h-16 bg-[#060606]/80 backdrop-blur-sm border-b border-white/[0.08] flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-white font-bold text-lg">{pageTitle}</h1>
        <div className="flex items-center gap-1.5 bg-[rgba(189,245,0,0.08)] border border-[rgba(189,245,0,0.2)] rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#bdf500] animate-pulse" />
          <span className="text-[#bdf500] text-xs font-semibold">Polkadot Hub</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative text-[#8e9191] hover:text-white transition-colors p-2 rounded-xl hover:bg-white/[0.05]">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#bdf500] rounded-full" />
        </button>

        {connected ? (
          <button className="flex items-center gap-2 bg-[#0a0a0a] border border-white/[0.12] hover:border-[rgba(189,245,0,0.3)] rounded-xl px-3 py-2 transition-colors">
            <div className="w-6 h-6 rounded-full bg-[#bdf500]" />
            <span className="text-white text-sm font-mono font-medium">{mockAddress}</span>
            <ChevronDown size={14} className="text-[#8e9191]" />
          </button>
        ) : (
          <button
            onClick={() => setConnected(true)}
            className="flex items-center gap-2 bg-[#bdf500] hover:bg-[#d8ff7b] text-black font-bold px-4 py-2 rounded-xl transition-all text-sm"
          >
            <Wallet size={16} />
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
