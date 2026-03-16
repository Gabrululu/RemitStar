import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Connect your wallet',
    description: 'Any EVM-compatible wallet works — MetaMask, Coinbase, Rabby. Connect from Ethereum, Base, Arbitrum, or Polygon. No Polkadot wallet needed.',
    detail: 'Supports 4 source chains',
  },
  {
    number: '02',
    title: 'Enter amount & recipient',
    description: 'Choose how much USDC or USDT to send and enter the recipient\'s wallet address. The fee breakdown and exchange rate update instantly as you type.',
    detail: 'Real-time rate preview',
  },
  {
    number: '03',
    title: 'Funds arrive in seconds',
    description: 'Your transfer routes through Polkadot Hub via XCM. The recipient receives stablecoins in their local currency equivalent in approximately 6 seconds.',
    detail: 'Average settlement: 5.8s',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 px-5 md:px-8 lg:px-12 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20"
        >
          <div>
            <p className="text-[#747878] text-[0.7rem] font-semibold uppercase tracking-[0.2em] mb-4">Simple by design</p>
            <h2 className="section-headline text-white">3 steps.<br />No banks.<br /><span className="text-white/25">No waiting.</span></h2>
          </div>
          <a
            href="/app"
            className="inline-flex items-center gap-2 bg-[#bdf500] hover:bg-[#d8ff7b] text-black font-bold text-[0.8rem] px-6 py-3 rounded-full transition-all duration-200 self-start md:self-auto shrink-0"
          >
            Try it now <ArrowUpRight size={14} />
          </a>
        </motion.div>

        <div className="flex flex-col gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col md:flex-row md:items-center gap-5 md:gap-10 py-8 border-b border-white/[0.07] cursor-default hover:bg-white/[0.02] px-4 -mx-4 rounded-xl transition-colors duration-300"
            >
              <div className="flex items-center gap-5 md:gap-8 md:w-1/3">
                <span className="text-[2.5rem] md:text-[3.5rem] font-black text-white/[0.04] leading-none font-mono tabular-nums shrink-0 w-20 md:w-28 text-center">
                  {step.number}
                </span>
                <h3 className="text-white font-extrabold text-xl md:text-2xl tracking-tight leading-tight">{step.title}</h3>
              </div>

              <p className="text-[#8e9191] text-[0.88rem] leading-relaxed md:flex-1 md:max-w-lg">{step.description}</p>

              <div className="md:w-48 shrink-0 flex md:justify-end">
                <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full text-[#bdf500] bg-[rgba(189,245,0,0.07)] border border-[rgba(189,245,0,0.18)]">
                  <span className="w-1 h-1 rounded-full animate-pulse bg-[#bdf500]" />
                  {step.detail}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
