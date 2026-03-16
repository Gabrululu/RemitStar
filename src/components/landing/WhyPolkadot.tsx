import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Link2, Shield, Globe, TrendingDown, ArrowUpRight } from 'lucide-react';

const features = [
  {
    icon: <Zap size={20} />,
    title: '6-second finality',
    label: 'Instant settlement',
    description: 'Polkadot Hub\'s shared security model delivers deterministic finality in ~6 seconds. No probabilistic confirmation waiting — funds are irrevocably settled in the same block.',
    stat: '5.8s avg',
  },
  {
    icon: <Link2 size={20} />,
    title: 'Native cross-chain via XCM',
    label: 'Built in, not bolted on',
    description: 'Cross-Chain Message Passing (XCM) is a first-class feature of Polkadot, not a bridge. Assets move between chains with the same security as the base layer itself.',
    stat: '12+ chains',
  },
  {
    icon: <Shield size={20} />,
    title: 'OpenZeppelin security',
    label: 'Audited contracts',
    description: 'All smart contracts follow OpenZeppelin standards — the same framework protecting $35T+ in DeFi value. ERC4626 vaults, upgradeable proxies, battle-tested patterns throughout.',
    stat: '$35T+ protected',
  },
  {
    icon: <TrendingDown size={20} />,
    title: 'Industry-lowest fees',
    label: '0.3% protocol fee',
    description: 'Traditional remittances charge 5–7% plus hidden currency markups. RemitFlow charges a flat 0.3% protocol fee with transparent on-chain exchange rates. No surprises.',
    stat: '0.3% flat',
  },
  {
    icon: <Globe size={20} />,
    title: 'Non-custodial & open source',
    label: 'Your keys, your funds',
    description: 'We never hold your funds. All protocol code is publicly verifiable on GitHub. Trust the math, not us — every transaction is auditable on-chain by anyone.',
    stat: 'Self-custody',
  },
];

export default function WhyPolkadot() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="why-polkadot" className="py-24 md:py-32 bg-[#060606]">
      <div className="px-5 md:px-8 lg:px-12 max-w-7xl mx-auto mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="text-[#747878] text-[0.7rem] font-semibold uppercase tracking-[0.2em] mb-4">Built different</p>
            <h2 className="section-headline text-white">
              Why build on<br />
              <span className="in-seconds-gradient">Polkadot Hub?</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2 self-start md:self-auto">
            <span className="text-[#bdf500] text-sm">●</span>
            <span className="text-[#8e9191] text-[0.72rem] font-medium">Built on Polkadot Hub</span>
          </div>
        </motion.div>
      </div>

      <div className="border-t border-white/[0.07]">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="relative border-b border-white/[0.07] cursor-default overflow-hidden transition-colors duration-300"
            style={{ background: hovered === i ? 'rgba(189,245,0,0.03)' : 'transparent' }}
          >
            <div className="px-5 md:px-8 lg:px-12 py-5 md:py-6 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
                <div className="flex items-center gap-4 md:w-[42%] shrink-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                      color: hovered === i ? '#bdf500' : '#747878',
                      background: hovered === i ? 'rgba(189,245,0,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${hovered === i ? 'rgba(189,245,0,0.25)' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3
                      className="font-extrabold text-lg md:text-xl tracking-tight leading-tight transition-colors duration-300"
                      style={{ color: hovered === i ? '#ffffff' : '#c4c7c7' }}
                    >
                      {feature.title}
                    </h3>
                    <span className="text-[#747878] text-[0.72rem] font-medium">{feature.label}</span>
                  </div>
                </div>

                <p
                  className="text-[0.85rem] leading-relaxed md:flex-1 transition-all duration-500"
                  style={{
                    color: hovered === i ? '#a9acab' : '#4a4d4d',
                    transform: hovered === i ? 'translateY(0)' : 'translateY(3px)',
                  }}
                >
                  {feature.description}
                </p>

                <div className="md:w-36 shrink-0 flex md:justify-end">
                  <span
                    className="text-[0.72rem] font-bold font-mono px-3 py-1.5 rounded-lg transition-all duration-300"
                    style={{
                      color: hovered === i ? '#bdf500' : '#747878',
                      background: hovered === i ? 'rgba(189,245,0,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${hovered === i ? 'rgba(189,245,0,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    {feature.stat}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-500"
              style={{
                background: '#bdf500',
                opacity: hovered === i ? 0.6 : 0,
                transform: hovered === i ? 'scaleY(1)' : 'scaleY(0)',
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="px-5 md:px-8 lg:px-12 max-w-7xl mx-auto mt-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[rgba(189,245,0,0.04)] border border-[rgba(189,245,0,0.15)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-[rgba(189,245,0,0.08)] border border-[rgba(189,245,0,0.2)] flex items-center justify-center text-[#bdf500] text-2xl shrink-0">●</div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-white font-bold text-lg mb-1">Cross-chain on Polkadot Hub EVM</div>
            <div className="text-[#8e9191] text-sm">RemitFlow runs natively on Polkadot Hub EVM — demonstrating real-world cross-chain remittance use cases with XCM and on-chain finality.</div>
          </div>
          <a
            href="/docs"
            className="inline-flex items-center gap-2 bg-[#bdf500] hover:bg-[#d8ff7b] text-black font-bold text-[0.8rem] px-5 py-2.5 rounded-full transition-all duration-200 shrink-0"
          >
            Read docs <ArrowUpRight size={13} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
