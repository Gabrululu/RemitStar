import { motion } from 'framer-motion';

const bigWords = [
  { text: 'Instant.', ghost: 'Instant.' },
  { text: 'Cheap.', ghost: 'Cheap.' },
  { text: 'Secure.', ghost: 'Secure.' },
];

const badges = [
  { label: 'OpenZeppelin contracts', desc: 'Industry-standard security' },
  { label: 'Non-custodial', desc: 'You hold your keys always' },
  { label: 'Polkadot shared security', desc: 'Relay-chain validated' },
  { label: 'Open source', desc: 'Publicly auditable on GitHub' },
];

export default function TrustSecurity() {
  return (
    <section className="py-24 md:py-32 bg-black overflow-hidden">
      <div className="px-5 md:px-8 lg:px-12 max-w-7xl mx-auto mb-16 md:mb-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#747878] text-[0.7rem] font-semibold uppercase tracking-[0.2em] mb-4"
        >
          Security first
        </motion.p>
      </div>

      <div className="px-5 md:px-8 lg:px-12 max-w-7xl mx-auto">
        {bigWords.map((word, i) => (
          <motion.div
            key={word.text}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden border-b border-white/[0.07] flex items-center"
          >
            <div className="flex items-baseline gap-[0.5em] py-3 md:py-4">
              <span className="big-display-text text-white leading-none tracking-tight">
                {word.text}
              </span>
              <span
                className="big-display-text leading-none tracking-tight select-none"
                style={{ color: '#bdf500', opacity: 0.1 }}
                aria-hidden
              >
                {word.ghost}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="px-5 md:px-8 lg:px-12 max-w-7xl mx-auto mt-16 md:mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 md:p-5 hover:bg-white/[0.05] hover:border-[rgba(189,245,0,0.2)] transition-colors duration-300"
            >
              <div className="w-6 h-6 rounded-full bg-[rgba(189,245,0,0.08)] border border-[rgba(189,245,0,0.2)] flex items-center justify-center mb-3">
                <span className="text-[#bdf500] text-[0.45rem]">●</span>
              </div>
              <div className="text-white font-bold text-sm leading-tight mb-1">{badge.label}</div>
              <div className="text-[#8e9191] text-[0.72rem] leading-relaxed">{badge.desc}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 py-6 border-t border-white/[0.06]"
        >
          <div className="flex items-center gap-2.5 text-[#8e9191] text-[0.78rem]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bdf500]" />
            All contracts are open source and auditable
          </div>
          <span className="text-white/[0.15] hidden sm:inline">·</span>
          <div className="flex items-center gap-2.5 text-[#8e9191] text-[0.78rem]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bdf500]" />
            Non-custodial. Verifiable on-chain.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
