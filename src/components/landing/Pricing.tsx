import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';

const feeRows = [
  { label: 'Send transfer', fee: '0.3%', note: 'Min. ~$0.01' },
  { label: 'Receive transfer', fee: 'Free', note: '' },
  { label: 'Network fee', fee: '~$0.002', note: 'Polkadot Hub' },
  { label: 'Currency conversion', fee: 'Included', note: 'Chainlink rates' },
  { label: 'Account fee', fee: 'Free', note: 'No monthly fee' },
];

function PricingCard({
  title,
  tag,
  description,
  features,
  cta,
  highlighted,
}: {
  title: string;
  tag: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl border transition-all duration-400 cursor-default flex-1"
      style={{
        background: highlighted ? 'rgba(189,245,0,0.04)' : '#0a0a0a',
        borderColor: hovered || highlighted ? 'rgba(189,245,0,0.3)' : 'rgba(255,255,255,0.08)',
        boxShadow: hovered ? '0 0 40px rgba(189,245,0,0.06)' : 'none',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-400"
        style={{ background: 'linear-gradient(90deg, transparent, #bdf500, transparent)', opacity: highlighted || hovered ? 0.5 : 0 }}
      />

      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="inline-block text-[0.65rem] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full mb-3 text-[#bdf500] bg-[rgba(189,245,0,0.08)] border border-[rgba(189,245,0,0.2)]">
              {tag}
            </span>
            <h3 className="text-white font-extrabold text-xl md:text-2xl tracking-tight">{title}</h3>
          </div>
          {highlighted && (
            <span className="bg-[#bdf500] text-black text-[0.62rem] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full shrink-0">
              Popular
            </span>
          )}
        </div>

        <p className="text-[#8e9191] text-sm leading-relaxed mb-6">{description}</p>

        <div className="mb-6 py-5 border-y border-white/[0.07]">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-white font-black text-4xl md:text-5xl tracking-tight">0.3%</span>
            <span className="text-[#8e9191] text-sm">per transfer</span>
          </div>
          <span className="text-[#747878] text-xs">No monthly fee. No setup fee. No hidden costs.</span>
        </div>

        <div className="flex flex-col gap-3 mb-7">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 bg-[rgba(189,245,0,0.1)] border border-[rgba(189,245,0,0.25)]">
                <Check size={9} style={{ color: '#bdf500' }} />
              </div>
              <span className="text-[#a9acab] text-[0.82rem]">{f}</span>
            </div>
          ))}
        </div>

        <a
          href="/app"
          className="w-full inline-flex items-center justify-center gap-2 font-bold text-sm py-3.5 rounded-full transition-all duration-200"
          style={{
            background: hovered || highlighted ? '#bdf500' : 'rgba(255,255,255,0.05)',
            color: hovered || highlighted ? '#000' : '#8e9191',
            border: `1px solid ${hovered || highlighted ? '#bdf500' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          {cta} <ArrowUpRight size={14} />
        </a>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 px-5 md:px-8 lg:px-12 bg-[#060606]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <p className="text-[#747878] text-[0.7rem] font-semibold uppercase tracking-[0.2em] mb-4">No surprises</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="section-headline text-white">
              Simple,<br />transparent<br /><span className="text-white/25">pricing.</span>
            </h2>
            <p className="text-[#8e9191] text-[0.9rem] leading-relaxed max-w-sm">
              No hidden fees. No monthly charges. No currency markups. One flat rate — lower than any alternative.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 mb-14">
          <PricingCard
            title="Personal transfers"
            tag="For individuals"
            description="Send money to family and friends anywhere in LATAM or APAC. Zero fees to get started."
            features={[
              'USDC & USDT supported',
              'Up to $10,000 per transfer',
              'All 12 corridors available',
              'On-chain transfer history',
              'No KYC below $1,000',
            ]}
            cta="Send money now"
          />
          <PricingCard
            title="Business transfers"
            tag="For businesses"
            description="Pay suppliers, contractors, and partners across borders in seconds. No bank accounts needed."
            features={[
              'USDC & USDT supported',
              'Up to $50,000 per day',
              'All 12 corridors available',
              'Batch transfers support',
              'Priority settlement routing',
            ]}
            cta="Start sending"
            highlighted
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl overflow-hidden"
        >
          <div className="px-6 md:px-8 py-5 border-b border-white/[0.06]">
            <h3 className="text-white font-bold text-base">Full fee schedule</h3>
            <p className="text-[#8e9191] text-[0.78rem] mt-0.5">All fees are inclusive — no hidden costs or currency spreads.</p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {feeRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between px-6 md:px-8 py-4">
                <span className="text-[#a9acab] text-sm">{row.label}</span>
                <div className="flex items-center gap-4">
                  {row.note && <span className="text-[#747878] text-[0.72rem] hidden sm:inline">{row.note}</span>}
                  <span
                    className="font-mono font-bold text-sm"
                    style={{ color: row.fee === 'Free' || row.fee === 'Included' ? '#bdf500' : '#ffffff' }}
                  >
                    {row.fee}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
