import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Send, Clock, Shield, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


function PhoneMockup() {
  const txItems = [
    { flag: '🇺🇸', to: '🇵🇪', label: 'Lima, Peru', amount: '+S/ 742', time: 'just now' },
    { flag: '🇸🇬', to: '🇵🇭', label: 'Manila', amount: '+₱ 5,540', time: '12s ago' },
    { flag: '🇪🇸', to: '🇲🇽', label: 'Mexico City', amount: '+MX$ 1,802', time: '38s ago' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-[260px] md:w-[290px] shrink-0"
      style={{
        filter: 'drop-shadow(0 40px 80px rgba(189,245,0,0.18)) drop-shadow(0 10px 30px rgba(0,0,0,0.8))',
      }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <div
          className="relative rounded-[2.8rem] overflow-hidden border-2"
          style={{
            background: '#090909',
            borderColor: 'rgba(255,255,255,0.12)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-b-2xl z-10" />

          <div className="px-5 pt-10 pb-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[#4a4d4d] text-[0.6rem] font-semibold uppercase tracking-widest mb-0.5">RemitStar</p>
                <p className="text-white text-[0.78rem] font-bold">Good morning, Ana</p>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(189,245,0,0.12)', border: '1px solid rgba(189,245,0,0.25)' }}
              >
                <span className="text-[#bdf500] text-[0.6rem]">●</span>
              </div>
            </div>

            <div
              className="rounded-2xl p-4 mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(189,245,0,0.12) 0%, rgba(189,245,0,0.04) 100%)',
                border: '1px solid rgba(189,245,0,0.2)',
              }}
            >
              <p className="text-[#8e9191] text-[0.6rem] uppercase tracking-wider mb-1">Balance</p>
              <p className="text-white text-[1.6rem] font-black font-mono leading-none">$2,400.00</p>
              <p className="text-[#bdf500] text-[0.62rem] font-medium mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bdf500] animate-pulse" />
                USDC · Polkadot Hub
              </p>
            </div>

            <div className="flex gap-2 mb-5">
              {[
                { icon: Send, label: 'Send' },
                { icon: Clock, label: 'History' },
                { icon: Shield, label: 'Security' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <Icon size={14} className="text-[#8e9191]" />
                  </div>
                  <span className="text-[#4a4d4d] text-[0.58rem] font-medium">{label}</span>
                </div>
              ))}
            </div>

            <p className="text-[#4a4d4d] text-[0.62rem] font-semibold uppercase tracking-wider mb-2.5">Live transfers</p>
            <div className="space-y-2">
              {txItems.map((tx, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.12 }}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{tx.flag}</span>
                    <ArrowUpRight size={9} className="text-[#bdf500]" />
                    <span className="text-sm">{tx.to}</span>
                    <div>
                      <p className="text-white text-[0.62rem] font-semibold leading-none">{tx.label}</p>
                      <p className="text-[#4a4d4d] text-[0.55rem] mt-0.5">{tx.time}</p>
                    </div>
                  </div>
                  <span className="text-[#bdf500] text-[0.65rem] font-bold font-mono">{tx.amount}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #090909, transparent)' }}
          />
          <div className="h-1.5 w-24 rounded-full bg-white/20 mx-auto mb-3" />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -6, 0], x: [0, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -top-4 -right-8 rounded-xl px-3.5 py-2.5 flex items-center gap-2"
        style={{
          background: 'rgba(10,10,10,0.95)',
          border: '1px solid rgba(189,245,0,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#bdf500] animate-pulse" />
        <span className="text-white text-[0.68rem] font-bold">Sent in 5.8s</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0], x: [0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-2 -left-10 rounded-xl px-3.5 py-2.5"
        style={{
          background: 'rgba(10,10,10,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <p className="text-[#4a4d4d] text-[0.55rem] uppercase tracking-wider mb-0.5">Fee</p>
        <p className="text-white text-[0.78rem] font-bold font-mono">$0.60 <span className="text-[#bdf500]">(0.3%)</span></p>
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/3 -right-4 w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(189,245,0,0.08)',
          border: '1px solid rgba(189,245,0,0.2)',
        }}
      >
        <Wifi size={12} className="text-[#bdf500]" />
      </motion.div>
    </motion.div>
  );
}

function HeroCard({
  title,
  subtitle,
  description,
  cta,
  items,
  delay = 0,
}: {
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  accent: string;
  items: string[];
  delay?: number;
}) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate('/app')}
      className="relative overflow-hidden rounded-[1.2rem] flex-1 cursor-pointer border transition-all duration-500"
      style={{
        background: hovered ? '#111111' : '#0a0a0a',
        borderColor: hovered ? 'rgba(189,245,0,0.35)' : 'rgba(255,255,255,0.08)',
        boxShadow: hovered ? '0 0 40px rgba(189,245,0,0.08)' : 'none',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
        style={{ background: 'linear-gradient(90deg, transparent, #bdf500, transparent)', opacity: hovered ? 0.5 : 0 }}
      />

      <div className="p-6 md:p-8 flex flex-col h-full min-h-[20rem]">
        <div className="flex items-start justify-between mb-5">
          <span
            className="inline-block text-[0.65rem] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full"
            style={{ color: '#bdf500', background: 'rgba(189,245,0,0.08)', border: '1px solid rgba(189,245,0,0.2)' }}
          >
            {subtitle}
          </span>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 ml-3 transition-all duration-300"
            style={{
              background: hovered ? '#bdf500' : 'rgba(189,245,0,0.1)',
              border: '1px solid rgba(189,245,0,0.25)',
              transform: hovered ? 'rotate(-45deg) scale(1.05)' : 'rotate(0deg) scale(1)',
            }}
          >
            <ArrowUpRight size={15} style={{ color: hovered ? '#000' : '#bdf500' }} />
          </div>
        </div>

        <h3 className="text-white font-extrabold text-[1.5rem] md:text-[1.75rem] leading-[1.1] tracking-tight mb-3">
          {title}
        </h3>
        <p className="text-[#8e9191] text-[0.85rem] leading-relaxed flex-1 max-w-[28ch]">{description}</p>

        <div className="mt-6 pt-5 border-t border-white/[0.06]">
          <div className="flex flex-wrap gap-2 mb-4">
            {items.map((item) => (
              <span
                key={item}
                className="text-[0.68rem] font-medium px-2.5 py-1 rounded-lg"
                style={{ color: '#8e9191', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {item}
              </span>
            ))}
          </div>
          <span
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-300"
            style={{ color: hovered ? '#bdf500' : '#747878' }}
          >
            {cta} <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden pt-14 md:pt-16 bg-black">
      <div className="flex-1 flex flex-col justify-between px-5 md:px-8 lg:px-12 pb-10">
        <div className="mt-[6vh] md:mt-[8vh] mb-10 flex flex-col lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 mb-7 md:mb-9"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#bdf500] animate-pulse" />
              <span className="text-[#8e9191] text-[0.7rem] font-semibold uppercase tracking-[0.2em]">
                Built on Polkadot Hub
              </span>
            </motion.div>

            {['Send money', 'home.'].map((line, i) => (
              <div key={line} className="overflow-hidden">
                <motion.h1
                  className="hero-headline text-white"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.08 + i * 0.1, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.h1>
              </div>
            ))}
            <div className="overflow-hidden">
              <motion.h1
                className="hero-headline"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.28, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="in-seconds-gradient">In seconds.</span>
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                className="hero-headline text-white/20"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.38, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                Not days.
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="text-[#8e9191] text-[0.9rem] md:text-[0.95rem] leading-relaxed max-w-lg mt-6 mb-8"
            >
              Powered by Polkadot Hub — stablecoin remittances settling in{' '}
              <span className="text-white font-semibold">6 seconds</span> at{' '}
              <span className="text-white font-semibold">0.3%</span> for LATAM &amp; APAC corridors.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <a
                href="/app"
                className="group inline-flex items-center justify-center gap-2 bg-[#bdf500] hover:bg-[#d8ff7b] text-black font-bold text-[0.85rem] px-7 py-3.5 rounded-full transition-all duration-200 w-fit"
              >
                Send Money Now
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <button
                onClick={() => scrollTo('how-it-works')}
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/[0.06] border border-white/[0.12] text-white font-semibold text-[0.85rem] px-7 py-3.5 rounded-full transition-all duration-200 w-fit"
              >
                How it works
              </button>
            </motion.div>
          </div>

          <div className="hidden lg:flex items-center justify-center pt-8 lg:pt-0 relative">
            <div
              className="absolute inset-0 rounded-full opacity-30 blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(189,245,0,0.25) 0%, transparent 70%)' }}
            />
            <PhoneMockup />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <HeroCard
            title="For LATAM senders"
            subtitle="Americas corridor"
            description="Send from USA, Spain, or UAE to Peru, Mexico, Colombia — funds arrive in under 10 seconds."
            cta="Send to LATAM"
            accent="#bdf500"
            items={['🇺🇸 USA → 🇵🇪 Peru', '🇺🇸 USA → 🇲🇽 Mexico', '🇪🇸 Spain → 🇨🇴 Colombia']}
            delay={0.9}
          />
          <HeroCard
            title="For APAC senders"
            subtitle="Asia-Pacific corridor"
            description="Send from Singapore, Japan, or Australia to Philippines, Indonesia, Vietnam — instantly."
            cta="Send to APAC"
            accent="#bdf500"
            items={['🇸🇬 Singapore → 🇮🇩 Indonesia', '🇯🇵 Japan → 🇻🇳 Vietnam', '🇦🇺 AUS → 🇵🇭 Philippines']}
            delay={1.0}
          />
        </motion.div>
      </div>

    </section>
  );
}
