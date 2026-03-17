import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, ChevronDown, Clock, ArrowUpRight, Zap } from 'lucide-react';
import { usePublicClient } from 'wagmi';
import { chains } from '../../data/content';
import { ADDRESSES, REMIT_CORE_ABI, corridorId as calcCorridorId } from '../../lib/contracts';
import { parseUSDC } from '../../lib/utils/format';
import { useExchangeRates } from '../../lib/hooks/useExchangeRates';

function RateBadge({ rates, isLoading, error }: { rates: Record<string, number> | null; isLoading: boolean; error: string | null }) {
  if (isLoading) return <span className="flex items-center gap-1 text-[0.6rem] text-[#8e9191]"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />Loading...</span>;
  if (error || rates === null) return <span className="flex items-center gap-1 text-[0.6rem] text-yellow-400"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />Estimated</span>;
  return <span className="flex items-center gap-1 text-[0.6rem] text-green-400"><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />Live</span>;
}

const CALC_CORRIDORS = [
  { id: 'US_PE', label: 'Peru 🇵🇪',        currency: 'PEN', rate: 3.74,  symbol: 'S/'  },
  { id: 'US_PH', label: 'Philippines 🇵🇭', currency: 'PHP', rate: 56.2,  symbol: '₱'   },
  { id: 'US_ID', label: 'Indonesia 🇮🇩',   currency: 'IDR', rate: 16240, symbol: 'Rp'  },
  { id: 'US_MX', label: 'Mexico 🇲🇽',      currency: 'MXN', rate: 17.2,  symbol: '$'   },
  { id: 'US_CO', label: 'Colombia 🇨🇴',    currency: 'COP', rate: 4100,  symbol: '$'   },
];

function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [displayed, setDisplayed] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    prevRef.current = value;
    if (start === end) return;
    const duration = 500;
    const startTime = performance.now();
    const frame = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(frame);
      else setDisplayed(end);
    };
    requestAnimationFrame(frame);
  }, [value]);

  return (
    <span>
      {prefix}{displayed > 0 ? displayed.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: decimals }) : '—'}{suffix}
    </span>
  );
}

export default function Calculator() {
  const { rates, isLoading: ratesLoading, error: ratesError, lastUpdated } = useExchangeRates();
  const [amount, setAmount] = useState('200');
  const [selectedChain, setSelectedChain] = useState(chains[0]);
  const [selectedCorridor, setSelectedCorridor] = useState(CALC_CORRIDORS[0]);
  const [showChainDrop, setShowChainDrop] = useState(false);
  const [showCorridorDrop, setShowCorridorDrop] = useState(false);
  const [showSavings, setShowSavings] = useState(false);
  const [quote, setQuote] = useState<{ fee: bigint; netAmount: bigint; amountOut: bigint } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const publicClient = usePublicClient();

  const numAmount = parseFloat(amount) || 0;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (numAmount <= 0 || !publicClient) { setQuote(null); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const result = await publicClient.readContract({
          address: ADDRESSES.RemitCore,
          abi: REMIT_CORE_ABI,
          functionName: 'getQuote',
          args: [calcCorridorId(selectedCorridor.id), parseUSDC(amount), ADDRESSES.USDC],
        }) as [bigint, bigint, bigint];
        setQuote({ fee: result[0], netAmount: result[1], amountOut: result[2] });
      } catch (e) {
        // quote failed — no wallet or RPC unavailable
        setQuote(null);
      }
    }, 800);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [amount, selectedCorridor.id, publicClient]);

  const liveRate = rates?.[selectedCorridor.currency] ?? selectedCorridor.rate;

  const feeNum = quote ? Number(quote.fee) / 1e6 : numAmount * 0.003;
  const westernUnionFee = numAmount * 0.065;
  const savings = westernUnionFee - feeNum;

  const receivedNum = quote
    ? (selectedCorridor.currency === 'IDR' || selectedCorridor.currency === 'VND')
      ? Number(quote.amountOut)
      : Number(quote.amountOut) / 1e6
    : (numAmount - feeNum) * liveRate;

  return (
    <section id="calculator" className="py-24 md:py-32 px-5 md:px-8 lg:px-12 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16"
        >
          <div>
            <p className="text-[#747878] text-[0.7rem] font-semibold uppercase tracking-[0.2em] mb-4">Live calculator</p>
            <h2 className="section-headline text-white">
              See what<br />you save.
            </h2>
          </div>
          <p className="text-[#8e9191] text-[0.9rem] leading-relaxed max-w-xs">
            Enter an amount. Choose your destination. Watch how much more you keep.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl p-6 md:p-8 overflow-hidden"
          style={{
            background: 'rgba(12,12,12,0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 80px rgba(0,0,0,0.6)',
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(189,245,0,0.35) 50%, transparent 90%)' }}
          />
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(189,245,0,0.07) 0%, transparent 70%)' }}
          />

          <div className="relative grid md:grid-cols-[1fr_auto_1fr] gap-5 items-stretch mb-5">
            <div
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <p className="text-[#747878] text-[0.7rem] font-semibold uppercase tracking-[0.15em] mb-4">You Send</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[#747878] text-lg">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 bg-transparent text-white text-[2.5rem] md:text-[3rem] font-black font-mono outline-none leading-none tracking-tight"
                  placeholder="0"
                  min="0"
                />
                <span className="text-[#747878] text-sm font-medium">USDC</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowChainDrop(!showChainDrop)}
                  className="flex items-center gap-2 hover:bg-white/[0.07] px-3 py-2 rounded-xl text-sm font-medium text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span className="font-mono text-[#bdf500] text-xs">{selectedChain.icon}</span>
                  From {selectedChain.name}
                  <ChevronDown size={13} className="text-[#747878]" />
                </button>
                {showChainDrop && (
                  <div
                    className="absolute top-full left-0 mt-1.5 rounded-xl overflow-hidden z-20 min-w-[160px]"
                    style={{
                      background: 'rgba(14,14,14,0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                    }}
                  >
                    {chains.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedChain(c); setShowChainDrop(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2.5 text-white text-sm hover:bg-white/[0.05] text-left"
                      >
                        <span className="font-mono text-[#bdf500]">{c.icon}</span>{c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center justify-center gap-2 py-2">
              <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(189,245,0,0.08)', border: '1px solid rgba(189,245,0,0.2)' }}
              >
                <ArrowLeftRight size={16} className="text-[#bdf500]" />
              </motion.div>
              <span className="text-[#747878] text-[0.65rem] font-medium whitespace-nowrap">via Polkadot Hub</span>
            </div>

            <div
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <p className="text-[#747878] text-[0.7rem] font-semibold uppercase tracking-[0.15em] mb-4">They Receive</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[#747878] text-lg">{selectedCorridor.symbol}</span>
                <span className="flex-1 text-[#bdf500] text-[2.5rem] md:text-[3rem] font-black font-mono leading-none tracking-tight">
                  <AnimatedNumber value={receivedNum > 0 ? receivedNum : 0} decimals={0} />
                </span>
                <span className="text-[#747878] text-sm font-medium">{selectedCorridor.currency}</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowCorridorDrop(!showCorridorDrop)}
                  className="flex items-center gap-2 hover:bg-white/[0.07] px-3 py-2 rounded-xl text-sm font-medium text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  To {selectedCorridor.label}
                  <ChevronDown size={13} className="text-[#747878]" />
                </button>
                {showCorridorDrop && (
                  <div
                    className="absolute top-full left-0 mt-1.5 rounded-xl overflow-hidden z-20 min-w-[200px]"
                    style={{
                      background: 'rgba(14,14,14,0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                    }}
                  >
                    {CALC_CORRIDORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedCorridor(c); setShowCorridorDrop(false); setQuote(null); }}
                        className="block w-full text-left px-3 py-2.5 text-white text-sm hover:bg-white/[0.05]"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Protocol fee', value: feeNum, prefix: '$', decimals: 3, sub: '0.3%', green: false },
              { label: 'Network fee', valueStr: '~$0.002', sub: 'Polkadot Hub', green: false },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-3"
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center gap-1.5 text-[#747878] text-[0.65rem] mb-1.5">
                  <Clock size={10} />
                  {item.label}
                </div>
                <div className="font-mono font-bold text-sm text-white">
                  {item.value !== undefined ? (
                    <AnimatedNumber value={item.value} prefix={item.prefix} decimals={item.decimals} />
                  ) : (
                    item.valueStr
                  )}
                </div>
                <div className="text-[#4a4d4d] text-[0.62rem] mt-0.5">{item.sub}</div>
              </div>
            ))}

            {/* Exchange rate cell — shows live/estimated badge + lastUpdated */}
            <div
              className="rounded-xl p-3"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-[#747878] text-[0.65rem]">
                  <Clock size={10} />
                  Exchange rate
                </div>
                <RateBadge rates={rates} isLoading={ratesLoading} error={ratesError} />
              </div>
              <div className="font-mono font-bold text-sm text-white">{liveRate.toFixed(4)}</div>
              <div className="text-[#4a4d4d] text-[0.62rem] mt-0.5">
                {`1 USDC → ${selectedCorridor.currency}`}
                {lastUpdated && (
                  <span className="ml-1">
                    · {Math.round((Date.now() - lastUpdated.getTime()) / 60000)}m ago
                  </span>
                )}
              </div>
            </div>

            <div
              className="rounded-xl p-3"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(189,245,0,0.15)' }}
            >
              <div className="flex items-center gap-1.5 text-[#747878] text-[0.65rem] mb-1.5">
                <Zap size={10} className="text-[#bdf500]" />
                Arrival time
              </div>
              <div className="font-mono font-bold text-sm text-[#bdf500]">~6 seconds</div>
              <div className="text-[#4a4d4d] text-[0.62rem] mt-0.5">avg 5.8s</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowSavings(!showSavings)}
              className="flex items-center justify-center gap-2 hover:bg-white/[0.07] border border-white/[0.08] text-[#8e9191] hover:text-white text-sm font-medium px-5 py-3 rounded-full transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              {showSavings ? 'Hide comparison' : 'Compare to Western Union'}
            </button>
            <a
              href="/app"
              className="flex-1 flex items-center justify-center gap-2 bg-[#bdf500] hover:bg-[#d8ff7b] text-black font-bold text-sm py-3 rounded-full transition-all duration-200"
            >
              Send Now <ArrowUpRight size={14} />
            </a>
          </div>

          <AnimatePresence>
            {showSavings && savings > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div
                  className="rounded-xl p-4 flex items-start gap-3"
                  style={{
                    background: 'rgba(189,245,0,0.05)',
                    border: '1px solid rgba(189,245,0,0.2)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span className="text-xl shrink-0 mt-0.5">💰</span>
                  <div>
                    <div className="text-[#bdf500] font-bold text-sm mb-0.5">
                      You save {((numAmount * liveRate * 0.997) - (numAmount * liveRate * 0.935)).toFixed(2)} {selectedCorridor.currency} vs Western Union
                    </div>
                    <div className="text-[#8e9191] text-xs">
                      WU delivers {(numAmount * liveRate * 0.935).toFixed(2)} {selectedCorridor.currency} (6.5% fee) — RemitStar delivers {(numAmount * liveRate * 0.997).toFixed(2)} {selectedCorridor.currency} (0.3% fee). That's {((savings / westernUnionFee) * 100).toFixed(0)}% less in fees.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
