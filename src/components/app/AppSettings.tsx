import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Bell, Globe, Shield, Wallet } from 'lucide-react';

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${value ? 'bg-[#bdf500]' : 'bg-white/[0.1]'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow transition-transform duration-300 ${value ? 'translate-x-5 bg-black' : 'bg-white'}`}
      />
    </button>
  );
}

export default function AppSettings() {
  const [notifications, setNotifications] = useState({
    transfers: true,
    priceAlerts: false,
    liquidity: true,
    marketing: false,
  });
  const [preferredCorridor, setPreferredCorridor] = useState('us-pe');

  return (
    <div className="max-w-2xl mx-auto w-full">
      <h2 className="text-white font-bold text-xl mb-6">Settings</h2>

      <div className="flex flex-col gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-[#bdf500]" />
            <h3 className="text-white font-bold">Identity Verification</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={16} className="text-[#bdf500]" />
                <span className="text-white font-semibold">KYC Verified</span>
              </div>
              <div className="text-[#8e9191] text-sm">Level 1 · Up to $10,000/day</div>
            </div>
            <button className="bg-[rgba(189,245,0,0.08)] border border-[rgba(189,245,0,0.2)] text-[#bdf500] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[rgba(189,245,0,0.14)] transition-colors">
              Upgrade
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={18} className="text-[#bdf500]" />
            <h3 className="text-white font-bold">Preferred Corridor</h3>
          </div>
          <select
            value={preferredCorridor}
            onChange={(e) => setPreferredCorridor(e.target.value)}
            className="w-full bg-black border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(189,245,0,0.35)]"
          >
            <option value="us-pe">🇺🇸 USA → 🇵🇪 Peru</option>
            <option value="us-ph">🇺🇸 USA → 🇵🇭 Philippines</option>
            <option value="us-mx">🇺🇸 USA → 🇲🇽 Mexico</option>
            <option value="sg-id">🇸🇬 Singapore → 🇮🇩 Indonesia</option>
            <option value="ae-in">🇦🇪 UAE → 🇮🇳 India</option>
          </select>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-[#bdf500]" />
            <h3 className="text-white font-bold">Notifications</h3>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { key: 'transfers', label: 'Transfer updates', desc: 'Get notified when your transfers complete' },
              { key: 'priceAlerts', label: 'Exchange rate alerts', desc: 'Alert when rates move more than 1%' },
              { key: 'liquidity', label: 'Liquidity rewards', desc: 'Weekly earnings summary' },
              { key: 'marketing', label: 'Product updates', desc: 'New features and announcements' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <div className="text-white text-sm font-medium">{item.label}</div>
                  <div className="text-[#8e9191] text-xs">{item.desc}</div>
                </div>
                <Toggle
                  value={notifications[item.key as keyof typeof notifications]}
                  onChange={(v) => setNotifications((n) => ({ ...n, [item.key]: v }))}
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={18} className="text-[#bdf500]" />
            <h3 className="text-white font-bold">Connected Wallets</h3>
          </div>
          <div className="flex items-center justify-between p-3 bg-black border border-white/[0.06] rounded-xl mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#bdf500] flex items-center justify-center">
                <span className="text-black text-xs font-black">●</span>
              </div>
              <div>
                <div className="text-white text-sm font-mono font-semibold">0xA4b2...9cD3</div>
                <div className="text-[#8e9191] text-xs">MetaMask · Ethereum</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[#bdf500] text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bdf500]" />
              Connected
            </div>
          </div>
          <button className="w-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-[rgba(189,245,0,0.2)] text-[#8e9191] hover:text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
            + Connect another wallet
          </button>
        </motion.div>
      </div>
    </div>
  );
}
