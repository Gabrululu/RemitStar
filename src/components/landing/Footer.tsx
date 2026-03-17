import { Link } from 'react-router-dom';
import { Github, Twitter, MessageCircle } from 'lucide-react';

const GITHUB = 'https://github.com/Gabrululu/RemitStar';

const links: Record<string, { label: string; href: string; external?: boolean }[]> = {
  Product: [
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Corridors',    href: '/#corridors' },
    { label: 'Calculator',   href: '/#calculator' },
    { label: 'Pricing',      href: '/#pricing' },
  ],
  Developers: [
    { label: 'Documentation',   href: '/docs' },
    { label: 'Smart Contracts', href: '/docs' },
    { label: 'GitHub',          href: GITHUB, external: true },
    { label: 'Architecture',    href: '/docs' },
  ],
  Community: [
    { label: 'Discord',    href: 'https://polkadot-discord.w3f.tools/', external: true },
    { label: 'X',    href: 'https://x.com/gabrululu', external: true },
    { label: 'Blog',       href: `${GITHUB}#readme`, external: true },
    { label: 'Changelog',  href: `${GITHUB}/releases`, external: true },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#060606]">
      <div className="px-5 md:px-8 lg:px-12 max-w-7xl mx-auto py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-[#bdf500] text-lg font-black">●</span>
              <span className="text-white font-extrabold text-[0.9rem] tracking-tight">RemitStar</span>
            </Link>
            <p className="text-[#8e9191] text-[0.8rem] leading-relaxed mb-5 max-w-[20ch]">
              Send money home. In seconds. Not days.
            </p>
            <div className="flex items-center gap-3">
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8e9191] hover:text-white hover:border-[rgba(189,245,0,0.3)] transition-all duration-200">
                <Github size={14} />
              </a>
              <a href="https://x.com/gabrululu" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8e9191] hover:text-white hover:border-[rgba(189,245,0,0.3)] transition-all duration-200">
                <Twitter size={14} />
              </a>
              <a href="https://polkadot-discord.w3f.tools/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8e9191] hover:text-white hover:border-[rgba(189,245,0,0.3)] transition-all duration-200">
                <MessageCircle size={14} />
              </a>
            </div>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <div className="text-[#bdf500] font-semibold text-[0.78rem] uppercase tracking-[0.12em] mb-4">{category}</div>
              <div className="flex flex-col gap-2.5">
                {items.map(({ label, href, external }) =>
                  external ? (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8e9191] hover:text-white transition-colors duration-200 text-[0.8rem]"
                    >
                      {label}
                    </a>
                  ) : href.startsWith('/#') ? (
                    <a
                      key={label}
                      href={href}
                      className="text-[#8e9191] hover:text-white transition-colors duration-200 text-[0.8rem]"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      key={label}
                      to={href}
                      className="text-[#8e9191] hover:text-white transition-colors duration-200 text-[0.8rem]"
                    >
                      {label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
          <div className="text-[#4a4d4d] text-[0.75rem]">
            © 2026 RemitStar. Non-custodial. Open source.
          </div>
          <div className="flex items-center gap-2 bg-[rgba(189,245,0,0.06)] border border-[rgba(189,245,0,0.18)] rounded-full px-3.5 py-1.5">
            <span className="text-[#bdf500] text-[0.6rem]">●</span>
            <span className="text-[#8e9191] text-[0.7rem] font-medium">Built on Polkadot Hub</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
