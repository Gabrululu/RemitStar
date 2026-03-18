import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, CheckCircle2, Loader2, Sparkles, Info, ExternalLink } from 'lucide-react';
import { chains } from '../../data/content';
import { ADDRESSES } from '../../lib/contracts';
import { useWallet } from '../../lib/hooks/useWallet';
import { useSendRemittance } from '../../lib/hooks/useSendRemittance';
import { useTokenBalance } from '../../lib/hooks/useTokenBalance';
import { formatUSDC, parseUSDC } from '../../lib/utils/format';
import { useExchangeRates } from '../../lib/hooks/useExchangeRates';

const TOKEN_OPTIONS = [
  { id: 'usdc', name: 'USDC', address: ADDRESSES.USDC },
  { id: 'usdt', name: 'USDT', address: ADDRESSES.USDT },
];

const CONTRACT_CORRIDORS = [
  { id: 'US_PE', label: 'Peru 🇵🇪',        currency: 'PEN', rate: 3.45,  symbol: 'S/'  },
  { id: 'US_PH', label: 'Philippines 🇵🇭', currency: 'PHP', rate: 59.81, symbol: '₱'   },
  { id: 'US_ID', label: 'Indonesia 🇮🇩',   currency: 'IDR', rate: 16980, symbol: 'Rp'  },
  { id: 'US_MX', label: 'Mexico 🇲🇽',      currency: 'MXN', rate: 17.68, symbol: '$'   },
  { id: 'US_CO', label: 'Colombia 🇨🇴',    currency: 'COP', rate: 3701,  symbol: '$'   },
];

const TX_STEPS = ['approving', 'sending', 'confirming'] as const;
const TX_STEP_LABELS: Record<string, string> = {
  approving:  'Approving USDC...',
  sending:    'Sending remittance...',
  confirming: 'Confirming on chain...',
};

function formatReceivedAmount(amount: bigint, currency: string): string {
  if (currency === 'IDR' || currency === 'VND') {
    return Number(amount).toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  return (Number(amount) / 1e6).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export default function SendForm() {
  const { rates, isLoading: ratesLoading, error: ratesError, lastUpdated } = useExchangeRates();
  const [selectedToken, setSelectedToken] = useState(TOKEN_OPTIONS[0]);
  const [chain, setChain] = useState(chains[0]);
  const [corridor, setCorridor] = useState(CONTRACT_CORRIDORS[0]);
  const [amountIn, setAmountIn] = useState('');
  const [recipient, setRecipient] = useState('');
  const [showFeeBreakdown, setShowFeeBreakdown] = useState(false);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [showCorridorDropdown, setShowCorridorDropdown] = useState(false);
  const [quote, setQuote] = useState<{ fee: bigint; netAmount: bigint; amountOut: bigint } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isConnected, isCorrectNetwork, connect, switchToPolkadot } = useWallet();
  const { formatted: balanceFormatted } = useTokenBalance(selectedToken.address);
  const { getQuote, send, step, txHash, error, isLoading, reset } = useSendRemittance();

  const numAmount = parseFloat(amountIn) || 0;
  const modalOpen = step !== 'idle';

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (numAmount <= 0) { setQuote(null); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const result = await getQuote(corridor.id, parseUSDC(amountIn), selectedToken.address);
        setQuote(result);
      } catch (e) {
        // quote failed — RPC or corridor not active
        setQuote(null);
      }
    }, 600);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [amountIn, corridor.id, selectedToken.address]);

  const handleSend = async () => {
    if (!isConnected) { connect(); return; }
    if (!isCorrectNetwork) { switchToPolkadot(); return; }
    if (!recipient || !quote) return;
    await send({
      token: selectedToken.address,
      corridorId: corridor.id,
      amountIn: parseUSDC(amountIn),
      recipient: recipient as `0x${string}`,
    });
  };

  const handleClose = () => {
    reset();
    setAmountIn('');
    setRecipient('');
    setQuote(null);
  };

  const currentTxIndex = TX_STEPS.indexOf(step as typeof TX_STEPS[number]);
  const isSubmitDisabled = !quote || isLoading || !amountIn || !recipient || numAmount <= 0;

  const submitLabel = (() => {
    if (!isConnected) return 'Connect Wallet';
    if (!isCorrectNetwork) return 'Switch Network';
    if (step === 'approving') return 'Approving USDC...';
    if (step === 'sending') return 'Sending...';
    if (step === 'confirming') return 'Confirming...';
    if (step === 'success') return 'Sent! ✓';
    return 'Review Transfer';
  })();

  const explorerUrl = txHash
    ? `https://blockscout-passet-hub.parity-testnet.parity.io/tx/${txHash}`
    : undefined;

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
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                className="flex-1 bg-transparent text-white text-3xl font-bold font-mono outline-none"
              />
              <div className="relative">
                <button
                  onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                  className="flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] px-3 py-2 rounded-xl text-white font-semibold text-sm transition-colors"
                >
                  {selectedToken.name}
                  <ChevronDown size={14} />
                </button>
                {showTokenDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-[#111] border border-white/[0.1] rounded-xl overflow-hidden z-20 min-w-[100px]">
                    {TOKEN_OPTIONS.map((t) => (
                      <button key={t.id} onClick={() => { setSelectedToken(t); setShowTokenDropdown(false); setQuote(null); }} className="block w-full text-left px-3 py-2.5 text-white text-sm hover:bg-white/[0.05]">
                        {t.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
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
              {isConnected && (
                <span className="text-[#8e9191] text-xs font-mono">Balance: {balanceFormatted} {selectedToken.name}</span>
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
                {quote ? formatReceivedAmount(quote.amountOut, corridor.currency) : '—'}
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
                  {CONTRACT_CORRIDORS.map((c) => (
                    <button key={c.id} onClick={() => { setCorridor(c); setShowCorridorDropdown(false); setQuote(null); }} className="block w-full text-left px-3 py-2.5 text-white text-sm hover:bg-white/[0.05]">{c.label}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-[#8e9191] text-xs font-semibold uppercase tracking-widest mb-2 block">Recipient Address</label>
            <input
              type="text"
              placeholder="Wallet address (0x...)"
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
                    <div className="flex justify-between"><span className="text-[#8e9191]">Protocol fee (0.3%)</span><span className="text-white font-mono">{quote ? formatUSDC(quote.fee) : '—'} USDC</span></div>
                    <div className="flex justify-between"><span className="text-[#8e9191]">Network fee</span><span className="text-white font-mono">~$0.002</span></div>
                    <div className="flex justify-between border-t border-white/[0.06] pt-2 mt-1">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-semibold">Rate</span>
                        {lastUpdated && (
                          <span className="text-[#4a4d4d] text-[0.6rem]">
                            Updated {Math.round((Date.now() - lastUpdated.getTime()) / 60000)}m ago
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-white font-mono font-bold">
                          1 USDC = {(rates?.[corridor.currency] ?? corridor.rate).toFixed(4)} {corridor.currency}
                        </span>
                        {ratesLoading ? (
                          <span className="flex items-center gap-1 text-[0.6rem] text-[#8e9191]"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />Loading...</span>
                        ) : ratesError || rates === null ? (
                          <span className="flex items-center gap-1 text-[0.6rem] text-yellow-400"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />Estimated</span>
                        ) : (
                          <span className="flex items-center gap-1 text-[0.6rem] text-green-400"><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />Live</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step === 'error' && error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error.slice(0, 120)}
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={isSubmitDisabled && isConnected && isCorrectNetwork}
            className="w-full bg-[#bdf500] hover:bg-[#d8ff7b] disabled:bg-white/[0.07] disabled:text-white/30 text-black font-bold py-4 rounded-2xl transition-all text-base"
          >
            {isLoading && <Loader2 size={16} className="inline mr-2 animate-spin" />}
            {submitLabel}
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
            onClick={(e) => e.target === e.currentTarget && step === 'success' && handleClose()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0a0a0a] border border-white/[0.1] rounded-3xl p-8 w-full max-w-md"
            >
              {step === 'success' ? (
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
                    <span className="font-mono font-bold text-white">{amountIn} {selectedToken.name}</span> sent
                  </p>
                  <p className="text-[#8e9191] mb-6">
                    <span className="font-mono font-bold text-[#bdf500]">
                      {quote ? formatReceivedAmount(quote.amountOut, corridor.currency) : '—'} {corridor.currency}
                    </span> delivered
                  </p>
                  <div className="flex items-center justify-center gap-2 text-[#8e9191] text-sm mb-4">
                    <Sparkles size={14} className="text-[#bdf500]" />
                    Settled in ~6 seconds via Polkadot Hub
                  </div>
                  {explorerUrl && (
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 text-[#bdf500] text-sm mb-6 hover:text-[#d8ff7b]"
                    >
                      View transaction <ExternalLink size={12} />
                    </a>
                  )}
                  <button onClick={handleClose} className="w-full bg-[#bdf500] hover:bg-[#d8ff7b] text-black font-bold py-3 rounded-xl transition-all">
                    Done
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-white font-bold text-lg mb-6">Processing Transfer</h3>
                  <div className="flex flex-col gap-4">
                    {TX_STEPS.map((s, stepIndex) => {
                      const isDone = currentTxIndex > stepIndex;
                      const isActive = currentTxIndex === stepIndex;
                      return (
                        <div key={s} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                          isActive ? 'border-[rgba(189,245,0,0.3)] bg-[rgba(189,245,0,0.04)]' : isDone ? 'border-[rgba(189,245,0,0.15)] bg-[rgba(189,245,0,0.02)]' : 'border-white/[0.05]'
                        }`}>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                            {isDone ? <CheckCircle2 size={20} className="text-[#bdf500]" /> : isActive ? <Loader2 size={20} className="text-[#bdf500] animate-spin" /> : <div className="w-3 h-3 rounded-full bg-white/[0.1]" />}
                          </div>
                          <span className={`text-sm font-medium ${isActive ? 'text-white' : isDone ? 'text-[#bdf500]' : 'text-[#8e9191]'}`}>
                            {TX_STEP_LABELS[s]}
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
