import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, CheckCircle2, Loader2, Sparkles, Info } from 'lucide-react';
import { chains, tokens, destinationCorridors } from '../../data/mockData';

type Step = 'idle' | 'bridging' | 'routing' | 'settling' | 'complete';

const steps: Step[] = ['bridging', 'routing', 'settling', 'complete'];
const stepLabels: Record<Step, string> = {
  idle: '',
  bridging: 'Bridging to Polkadot Hub...',
  routing: 'Routing via XCM...',
  settling: 'Settling on destination...',
  complete: 'Transfer Complete!',
};

export default function SendForm() {
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState(tokens[0]);
  const [chain, setChain] = useState(chains[0]);
  const [corridor, setCorridor] = useState(destinationCorridors[0]);
  const [recipient, setRecipient] = useState('');
  const [showFeeBreakdown, setShowFeeBreakdown] = useState(false);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [showCorridorDropdown, setShowCorridorDropdown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('idle');

  const numAmount = parseFloat(amount) || 0;
  const protocolFee = numAmount * 0.003;
  const networkFee = 0.002;
  const totalFee = protocolFee + networkFee;
  const received = (numAmount - totalFee) * corridor.rate;

  const handleSend = () => {
    setModalOpen(true);
    setCurrentStep('bridging');
    let i = 0;
    const next = () => {
      i++;
      if (i < steps.length) {
        setTimeout(() => {
          setCurrentStep(steps[i]);
          next();
        }, i === steps.length - 1 ? 1000 : 1500);
      }
    };
    setTimeout(next, 1500);
  };

  const handleClose = () => {
    setModalOpen(false);
    setCurrentStep('idle');
    setAmount('');
    setRecipient('');
  };

  return (
    <>
      <div className="max-w-xl mx-auto w-full">
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl p-6 shadow-[0_0_40px_rgba(189,245,0,0.04)]">
          <h2 className="text-white font-bold text-xl mb-6">New Transfer</h2>

          <div className="bg-black border border-white/[0.08] rounded-2xl p-4 mb-4">
            <div className="text-[#8e9191] text-xs font-semibold uppercase tracking-widest mb-3">You Send</div>
            <div className="flex items-center gap-3 mb-3">
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent text-white text-3xl font-bold font-mono outline-none"
              />
              <div className="relative">
                <button
                  onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                  className="flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] px-3 py-2 rounded-xl text-white font-semibold text-sm transition-colors"
                >
                  {token.name}
                  <ChevronDown size={14} />
                </button>
                {showTokenDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-[#111] border border-white/[0.1] rounded-xl overflow-hidden z-20 min-w-[100px]">
                    {tokens.map((t) => (
                      <button key={t.id} onClick={() => { setToken(t); setShowTokenDropdown(false); }} className="block w-full text-left px-3 py-2.5 text-white text-sm hover:bg-white/[0.05]">
                        {t.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowChainDropdown(!showChainDropdown)}
                className="flex items-center gap-2 text-[#8e9191] text-xs hover:text-white transition-colors"
              >
                <span className="font-mono text-[#bdf500]">{chain.icon}</span>
                From {chain.name}
                <ChevronDown size={12} />
              </button>
              {showChainDropdown && (
                <div className="absolute left-0 top-full mt-1 bg-[#111] border border-white/[0.1] rounded-xl overflow-hidden z-20 min-w-[160px]">
                  {chains.map((c) => (
                    <button key={c.id} onClick={() => { setChain(c); setShowChainDropdown(false); }} className="flex items-center gap-2 w-full px-3 py-2.5 text-white text-sm hover:bg-white/[0.05]">
                      <span className="font-mono text-[#bdf500]">{c.icon}</span>{c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 my-3 px-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(189,245,0,0.2)] to-transparent" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-[rgba(189,245,0,0.08)] border border-[rgba(189,245,0,0.2)] flex items-center justify-center">
                <ArrowRight size={14} className="text-[#bdf500]" />
              </div>
              <span className="text-[#8e9191] text-xs whitespace-nowrap">Polkadot Hub</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[rgba(189,245,0,0.2)] to-transparent" />
          </div>

          <div className="bg-black border border-white/[0.08] rounded-2xl p-4 mb-4">
            <div className="text-[#8e9191] text-xs font-semibold uppercase tracking-widest mb-3">Recipient Receives</div>
            <div className="flex items-center gap-3 mb-3">
              <span className="flex-1 text-[#bdf500] text-3xl font-bold font-mono">
                {received > 0 ? received.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—'}
              </span>
              <span className="text-[#8e9191] font-semibold text-sm">{corridor.currency}</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowCorridorDropdown(!showCorridorDropdown)}
                className="flex items-center gap-2 text-[#8e9191] text-xs hover:text-white transition-colors"
              >
                To {corridor.label}
                <ChevronDown size={12} />
              </button>
              {showCorridorDropdown && (
                <div className="absolute left-0 top-full mt-1 bg-[#111] border border-white/[0.1] rounded-xl overflow-hidden z-20 min-w-[200px]">
                  {destinationCorridors.map((c) => (
                    <button key={c.id} onClick={() => { setCorridor(c); setShowCorridorDropdown(false); }} className="block w-full text-left px-3 py-2.5 text-white text-sm hover:bg-white/[0.05]">{c.label}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-[#8e9191] text-xs font-semibold uppercase tracking-widest mb-2 block">Recipient Address</label>
            <input
              type="text"
              placeholder="Wallet address or ENS"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-black border border-white/[0.08] focus:border-[rgba(189,245,0,0.35)] rounded-xl px-4 py-3 text-white text-sm font-mono outline-none transition-colors placeholder:text-white/20"
            />
          </div>

          <div className="mb-5">
            <button
              onClick={() => setShowFeeBreakdown(!showFeeBreakdown)}
              className="flex items-center gap-2 text-[#8e9191] text-sm hover:text-white transition-colors"
            >
              <Info size={14} />
              Fee breakdown
              <ChevronDown size={14} className={`transition-transform ${showFeeBreakdown ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showFeeBreakdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 bg-black border border-white/[0.06] rounded-xl p-3 flex flex-col gap-2 text-sm">
                    <div className="flex justify-between"><span className="text-[#8e9191]">Protocol fee (0.3%)</span><span className="text-white font-mono">${protocolFee.toFixed(4)}</span></div>
                    <div className="flex justify-between"><span className="text-[#8e9191]">Network fee</span><span className="text-white font-mono">~$0.002</span></div>
                    <div className="flex justify-between border-t border-white/[0.06] pt-2 mt-1"><span className="text-white font-semibold">Total fee</span><span className="text-white font-mono font-bold">${totalFee.toFixed(4)}</span></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleSend}
            disabled={!amount || !recipient || numAmount <= 0}
            className="w-full bg-[#bdf500] hover:bg-[#d8ff7b] disabled:bg-white/[0.07] disabled:text-white/30 text-black font-bold py-4 rounded-2xl transition-all text-base"
          >
            Review Transfer
          </button>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && currentStep === 'complete' && handleClose()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0a0a0a] border border-white/[0.1] rounded-3xl p-8 w-full max-w-md"
            >
              {currentStep === 'complete' ? (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-[rgba(189,245,0,0.1)] border border-[rgba(189,245,0,0.3)] flex items-center justify-center mx-auto mb-5"
                  >
                    <CheckCircle2 size={40} className="text-[#bdf500]" />
                  </motion.div>
                  <h3 className="text-white text-2xl font-extrabold mb-2">Transfer Complete!</h3>
                  <p className="text-[#8e9191] mb-1">
                    <span className="font-mono font-bold text-white">{numAmount} {token.name}</span> sent
                  </p>
                  <p className="text-[#8e9191] mb-6">
                    <span className="font-mono font-bold text-[#bdf500]">{received.toLocaleString('en-US', { maximumFractionDigits: 0 })} {corridor.currency}</span> delivered
                  </p>
                  <div className="flex items-center justify-center gap-2 text-[#8e9191] text-sm mb-6">
                    <Sparkles size={14} className="text-[#bdf500]" />
                    Settled in ~5.8 seconds via Polkadot Hub
                  </div>
                  <button onClick={handleClose} className="w-full bg-[#bdf500] hover:bg-[#d8ff7b] text-black font-bold py-3 rounded-xl transition-all">
                    Done
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-white font-bold text-lg mb-6">Processing Transfer</h3>
                  <div className="flex flex-col gap-4">
                    {['bridging', 'routing', 'settling'].map((s) => {
                      const stepIndex = steps.indexOf(s as Step);
                      const currentIndex = steps.indexOf(currentStep);
                      const isDone = currentIndex > stepIndex;
                      const isActive = currentIndex === stepIndex;
                      return (
                        <div key={s} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                          isActive ? 'border-[rgba(189,245,0,0.3)] bg-[rgba(189,245,0,0.04)]' : isDone ? 'border-[rgba(189,245,0,0.15)] bg-[rgba(189,245,0,0.02)]' : 'border-white/[0.05]'
                        }`}>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                            {isDone ? <CheckCircle2 size={20} className="text-[#bdf500]" /> : isActive ? <Loader2 size={20} className="text-[#bdf500] animate-spin" /> : <div className="w-3 h-3 rounded-full bg-white/[0.1]" />}
                          </div>
                          <span className={`text-sm font-medium ${isActive ? 'text-white' : isDone ? 'text-[#bdf500]' : 'text-[#8e9191]'}`}>
                            {stepLabels[s as Step]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
