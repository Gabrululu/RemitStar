import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Minus } from 'lucide-react';

const rows = [
  { label: 'Settlement Time', wu: '3–5 days', wise: '1–2 days', rf: '~6 seconds', rfGood: true },
  { label: 'Avg Fee', wu: '5–7%', wise: '0.5–1.5%', rf: '0.3%', rfGood: true },
  { label: 'Transparency', wu: false, wise: 'Partial', rf: true, rfGood: true },
  { label: 'Self-custody', wu: false, wise: false, rf: true, rfGood: true },
  { label: 'On-chain verification', wu: false, wise: false, rf: true, rfGood: true },
  { label: 'Crypto support', wu: false, wise: false, rf: true, rfGood: true },
  { label: 'Requires bank account', wu: true, wise: true, rf: false, rfGood: true },
];

function CompetitorCell({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
        >
          <X size={13} className="text-red-400" />
        </div>
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
        >
          <X size={13} className="text-red-400" />
        </div>
      </div>
    );
  }
  if (value === 'Partial') {
    return (
      <div className="flex justify-center">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)' }}
        >
          <Minus size={13} className="text-yellow-400" />
        </div>
      </div>
    );
  }
  return (
    <span className="font-mono text-[0.78rem] font-semibold text-[#6b6e6e]">
      {value}
    </span>
  );
}

function RemitFlowCell({ value, isGood }: { value: boolean | string; isGood: boolean }) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(189,245,0,0.12)', border: '1px solid rgba(189,245,0,0.35)' }}
        >
          <Check size={13} className="text-[#bdf500]" />
        </motion.div>
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(189,245,0,0.12)', border: '1px solid rgba(189,245,0,0.35)' }}
        >
          <Check size={13} className="text-[#bdf500]" />
        </motion.div>
      </div>
    );
  }
  return (
    <span className="font-mono text-[0.82rem] font-bold text-[#bdf500]">
      {value}
    </span>
  );
}

export default function ComparisonTable() {
  return (
    <section className="py-24 md:py-32 px-5 md:px-8 lg:px-12 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 md:mb-20"
        >
          <div>
            <p className="text-[#747878] text-[0.7rem] font-semibold uppercase tracking-[0.2em] mb-4">The math is simple</p>
            <h2 className="section-headline text-white">
              How we<br />stack<br /><span className="text-white/25">up.</span>
            </h2>
          </div>
          <p className="text-[#8e9191] text-[0.9rem] leading-relaxed max-w-xs">
            Traditional services were built for a world without blockchains. We weren't.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(10,10,10,0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  <th className="text-left px-6 md:px-8 py-5 w-[38%]">
                    <span className="text-[#4a4d4d] text-[0.7rem] font-semibold uppercase tracking-[0.14em]">Feature</span>
                  </th>
                  <th className="text-center px-4 py-5">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                      >
                        <X size={14} className="text-red-400/60" />
                      </div>
                      <span className="text-[#4a4d4d] text-[0.72rem] font-semibold">Western Union</span>
                    </div>
                  </th>
                  <th className="text-center px-4 py-5">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}
                      >
                        <Minus size={14} className="text-yellow-400/60" />
                      </div>
                      <span className="text-[#4a4d4d] text-[0.72rem] font-semibold">Wise</span>
                    </div>
                  </th>
                  <th className="text-center px-4 py-5">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(189,245,0,0.12)', border: '1px solid rgba(189,245,0,0.3)' }}
                      >
                        <Check size={14} className="text-[#bdf500]" />
                      </div>
                      <div className="inline-flex items-center gap-1.5 bg-[rgba(189,245,0,0.08)] border border-[rgba(189,245,0,0.25)] rounded-full px-3 py-1">
                        <span className="text-[#bdf500] text-[0.5rem]">●</span>
                        <span className="text-white text-[0.72rem] font-bold">RemitFlow</span>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {rows.map((row, i) => (
                  <motion.tr
                    key={row.label}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="group hover:bg-white/[0.015] transition-colors duration-200"
                  >
                    <td className="px-6 md:px-8 py-4">
                      <span className="text-[#a9acab] text-sm font-medium">{row.label}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <CompetitorCell value={row.wu} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <CompetitorCell value={row.wise} />
                    </td>
                    <td
                      className="px-4 py-4 text-center"
                      style={{
                        background: 'rgba(189,245,0,0.025)',
                        borderLeft: '1px solid rgba(189,245,0,0.1)',
                        borderRight: '1px solid rgba(189,245,0,0.1)',
                      }}
                    >
                      <RemitFlowCell value={row.rf} isGood={row.rfGood} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="px-6 md:px-8 py-4 flex items-center gap-3 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.04)', background: 'rgba(189,245,0,0.02)' }}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(189,245,0,0.1)', border: '1px solid rgba(189,245,0,0.3)' }}>
                  <Check size={10} className="text-[#bdf500]" />
                </div>
                <span className="text-[#8e9191] text-[0.68rem]">Best in class</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)' }}>
                  <Minus size={10} className="text-yellow-400" />
                </div>
                <span className="text-[#8e9191] text-[0.68rem]">Partial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <X size={10} className="text-red-400" />
                </div>
                <span className="text-[#8e9191] text-[0.68rem]">Not available</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
