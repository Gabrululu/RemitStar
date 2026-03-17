import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Bell, Globe, Shield, Wallet, Loader2 } from 'lucide-react';
import { useReadContracts } from 'wagmi';
import { useWallet } from '../../lib/hooks/useWallet';
import { ADDRESSES, COMPLIANCE_ABI } from '../../lib/contracts';

const STORAGE_KEY = 'remitstar_settings';

interface Settings {
  notifications: {
    transfers: boolean;
    priceAlerts: boolean;
    liquidity: boolean;
    marketing: boolean;
  };
  preferredCorridor: string;
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Settings;
  } catch {
    // ignore parse errors
  }
  return {
    notifications: { transfers: true, priceAlerts: false, liquidity: true, marketing: false },
    preferredCorridor: 'us-pe',
  };
}

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
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const { address, isConnected, shortAddress } = useWallet();

  // Persist settings to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Read KYC status from ComplianceGate
  const { data: complianceData, isLoading: kycLoading } = useReadContracts({
    contracts: [
      {
        address: ADDRESSES.ComplianceGate,
        abi: COMPLIANCE_ABI,
        functionName: 'canTransact',
        args: [address ?? '0x0000000000000000000000000000000000000000'],
      },
      {
        address: ADDRESSES.ComplianceGate,
        abi: COMPLIANCE_ABI,
        functionName: 'kycApproved',
        args: [address ?? '0x0000000000000000000000000000000000000000'],
      },
    ],
    query: { enabled: !!address },
  });

  const canTransact = (complianceData?.[0]?.result as boolean | undefined) ?? false;
  const kycApproved = (complianceData?.[1]?.result as boolean | undefined) ?? false;

  function updateNotification(key: keyof Settings['notifications'], value: boolean) {
    setSettings((s) => ({
      ...s,
      notifications: { ...s.notifications, [key]: value },
    }));
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <h2 className="text-white font-bold text-xl mb-6">Settings</h2>

      <div className="flex flex-col gap-4">
        {/* KYC / Identity */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-[#bdf500]" />
            <h3 className="text-white font-bold">Identity Verification</h3>
          </div>

          {!isConnected ? (
            <p className="text-[#8e9191] text-sm">Connect your wallet to check KYC status.</p>
          ) : kycLoading ? (
            <div className="flex items-center gap-2 text-[#8e9191] text-sm">
              <Loader2 size={14} className="animate-spin" /> Checking on-chain status…
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {kycApproved ? (
                    <CheckCircle2 size={16} className="text-[#bdf500]" />
                  ) : (
                    <XCircle size={16} className="text-red-400" />
                  )}
                  <span className="text-white font-semibold">
                    {kycApproved ? 'KYC Approved' : 'KYC Not Approved'}
                  </span>
                </div>
                <div className="text-[#8e9191] text-sm">
                  {canTransact
                    ? 'You can send remittances · Up to $10,000/tx'
                    : 'Contact support to complete verification'}
                </div>
              </div>
              {!kycApproved && (
                <a
                  href="https://github.com/Gabrululu/RemitStar/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[rgba(189,245,0,0.08)] border border-[rgba(189,245,0,0.2)] text-[#bdf500] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[rgba(189,245,0,0.14)] transition-colors"
                >
                  Request KYC
                </a>
              )}
            </div>
          )}
        </motion.div>

        {/* Preferred Corridor */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={18} className="text-[#bdf500]" />
            <h3 className="text-white font-bold">Preferred Corridor</h3>
          </div>
          <select
            value={settings.preferredCorridor}
            onChange={(e) => setSettings((s) => ({ ...s, preferredCorridor: e.target.value }))}
            className="w-full bg-black border border-white/[0.08] text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-[rgba(189,245,0,0.35)]"
          >
            <option value="us-pe">🇺🇸 USA → 🇵🇪 Peru (PEN)</option>
            <option value="us-ph">🇺🇸 USA → 🇵🇭 Philippines (PHP)</option>
            <option value="us-id">🇺🇸 USA → 🇮🇩 Indonesia (IDR)</option>
            <option value="us-mx">🇺🇸 USA → 🇲🇽 Mexico (MXN)</option>
            <option value="us-co">🇺🇸 USA → 🇨🇴 Colombia (COP)</option>
          </select>
          <p className="text-[#8e9191] text-xs mt-2">Saved automatically. Pre-selects this corridor on the Send page.</p>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-[#bdf500]" />
            <h3 className="text-white font-bold">Notifications</h3>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { key: 'transfers' as const,   label: 'Transfer updates',     desc: 'Get notified when your transfers complete' },
              { key: 'priceAlerts' as const, label: 'Exchange rate alerts', desc: 'Alert when rates move more than 1%' },
              { key: 'liquidity' as const,   label: 'Liquidity rewards',    desc: 'Weekly earnings summary' },
              { key: 'marketing' as const,   label: 'Product updates',      desc: 'New features and announcements' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <div className="text-white text-sm font-medium">{item.label}</div>
                  <div className="text-[#8e9191] text-xs">{item.desc}</div>
                </div>
                <Toggle
                  value={settings.notifications[item.key]}
                  onChange={(v) => updateNotification(item.key, v)}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Connected Wallet */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={18} className="text-[#bdf500]" />
            <h3 className="text-white font-bold">Connected Wallet</h3>
          </div>

          {!isConnected ? (
            <p className="text-[#8e9191] text-sm">No wallet connected.</p>
          ) : (
            <div className="flex items-center justify-between p-3 bg-black border border-white/[0.06] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#bdf500] flex items-center justify-center">
                  <span className="text-black text-xs font-black">●</span>
                </div>
                <div>
                  <div className="text-white text-sm font-mono font-semibold">{shortAddress}</div>
                  <div className="text-[#8e9191] text-xs">Polkadot Hub Testnet</div>
                  {address && (
                    <a
                      href={`https://blockscout-passet-hub.parity-testnet.parity.io/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#bdf500] text-[0.7rem] hover:underline"
                    >
                      View on explorer →
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[#bdf500] text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bdf500]" />
                Connected
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
