import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ExternalLink, Menu, X, Copy, Check, BookOpen, Code2, Network, Globe as Globe2, HelpCircle, Zap, Shield, ArrowRight } from 'lucide-react';

const sections = [
  { id: 'overview', label: 'Overview', icon: <BookOpen size={15} /> },
  { id: 'contracts', label: 'Smart Contracts', icon: <Code2 size={15} /> },
  { id: 'xcm', label: 'How XCM Works', icon: <Network size={15} /> },
  { id: 'corridors', label: 'Supported Corridors', icon: <Globe2 size={15} /> },
  { id: 'faq', label: 'FAQ', icon: <HelpCircle size={15} /> },
];

const EXPLORER = 'https://blockscout-passet-hub.parity-testnet.parity.io';

const contractAddresses = [
  { name: 'RemitCore',       address: '0x710051f799D05afa3953B7af11A38C214Bc45B3F', network: 'Polkadot Hub' },
  { name: 'LiquidityPool',   address: '0xe5038EF6DA68DdF1D0851674F75E152Cc13cE040', network: 'Polkadot Hub' },
  { name: 'FeeDistributor',  address: '0x094F9e6a7aE4bb9d8d83dfb14F0cD4BD654e12af', network: 'Polkadot Hub' },
  { name: 'ComplianceGate',  address: '0xa89fb8A3f72C77cA15cfb8a1903f6Ef4D48bed82', network: 'Polkadot Hub' },
  { name: 'MockUSDC',        address: '0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B', network: 'Polkadot Hub' },
  { name: 'MockUSDT',        address: '0x2bd8AbEB2F5598f8477560C70c742aFfc22912de', network: 'Polkadot Hub' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-[#8e9191] hover:text-[#bdf500] text-xs border border-white/[0.08] hover:border-[rgba(189,245,0,0.25)] px-3 py-1.5 rounded-lg transition-colors"
    >
      {copied ? <Check size={12} className="text-[#bdf500]" /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function CodeBlock({ code, lang = '' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative bg-black border border-white/[0.08] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
        <span className="text-[#8e9191] text-xs font-mono">{lang || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[#8e9191] hover:text-[#bdf500] text-xs transition-colors"
        >
          {copied ? <Check size={12} className="text-[#bdf500]" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="text-[#bdf500] font-mono text-sm leading-loose overflow-x-auto p-4">{code}</pre>
    </div>
  );
}

const architectureCode = `[User Wallet] (Ethereum/Base/Arbitrum/Polygon)
       │
       ▼
[USDC/USDT Input]
       │
       ▼
[RemitStarCore Contract]
       │
       ├─── Fee deduction (0.3%)
       │
       ▼
[XCM Router] ──────────────► [Polkadot Hub]
                                    │
                              [Settlement Layer]
                                    │
                              [Recipient Chain]
                                    │
                              [Recipient Wallet]`;

const interfaceCode = `interface IRemitStarCore {
  function send(
    address token,
    uint256 amount,
    bytes32 destinationChain,
    address recipient
  ) external returns (bytes32 transferId);

  function estimateFee(
    uint256 amount
  ) external view returns (uint256 fee);

  function getRate(
    bytes32 corridor
  ) external view returns (uint256 rate);
}`;

const docsContent: Record<string, React.ReactNode> = {
  overview: (
    <div>
      <div className="flex items-center gap-2 text-[#bdf500] text-sm font-semibold mb-3 uppercase tracking-widest">
        <BookOpen size={14} />
        Getting Started
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">Overview</h1>
      <p className="text-[#8e9191] text-lg mb-8 leading-relaxed">
        RemitStar is a cross-chain stablecoin remittance protocol built on Polkadot Hub. It enables fast, cheap, and transparent international money transfers using USDC and USDT stablecoins.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Settlement Time', value: '~6 seconds', icon: <Zap size={16} />, desc: 'Finalized on-chain' },
          { label: 'Protocol Fee', value: '0.3%', icon: <Shield size={16} />, desc: 'vs. 5-7% traditional' },
          { label: 'Active Corridors', value: '12', icon: <Globe2 size={16} />, desc: 'LATAM + APAC' },
        ].map((s) => (
          <div key={s.label} className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-5 group hover:border-[rgba(189,245,0,0.2)] transition-colors">
            <div className="flex items-center gap-2 text-[#bdf500] mb-3">
              {s.icon}
              <span className="text-[#8e9191] text-xs">{s.label}</span>
            </div>
            <div className="font-mono font-black text-2xl text-white mb-1">{s.value}</div>
            <div className="text-[#8e9191] text-xs">{s.desc}</div>
          </div>
        ))}
      </div>

      <h2 className="text-white font-bold text-xl mb-4">Architecture Overview</h2>
      <CodeBlock code={architectureCode} lang="architecture" />

      <div className="mt-8 bg-[rgba(189,245,0,0.04)] border border-[rgba(189,245,0,0.15)] rounded-2xl p-5">
        <div className="flex items-center gap-2 text-[#bdf500] font-semibold mb-2">
          <Zap size={15} />
          Quick Note
        </div>
        <p className="text-[#8e9191] text-sm leading-relaxed">
          RemitStar is currently in public testnet. All transactions are simulated with test USDC. Mainnet launch is planned for Q3 2026 pending security audit completion.
        </p>
      </div>
    </div>
  ),
  contracts: (
    <div>
      <div className="flex items-center gap-2 text-[#bdf500] text-sm font-semibold mb-3 uppercase tracking-widest">
        <Code2 size={14} />
        Reference
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-4">Smart Contracts</h1>
      <p className="text-[#8e9191] text-lg mb-8">All contracts are deployed on Polkadot Hub and follow OpenZeppelin standards. Source code is open source and auditable.</p>

      <div className="flex flex-col gap-3 mb-8">
        {contractAddresses.map((c) => (
          <div key={c.name} className="bg-[#0a0a0a] border border-white/[0.08] hover:border-[rgba(189,245,0,0.2)] rounded-xl p-4 transition-colors group">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#bdf500]" />
                  <div className="text-white font-bold">{c.name}</div>
                  <span className="text-[#8e9191] text-xs bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded-full">{c.network}</span>
                </div>
                <div className="font-mono text-[#bdf500]/70 text-xs break-all mt-2 pl-4">{c.address}</div>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton text={c.address} />
                <a
                  href={`${EXPLORER}/address/${c.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#8e9191] hover:text-white text-xs border border-white/[0.08] hover:border-white/[0.15] px-3 py-1.5 rounded-lg transition-colors"
                >
                  <ExternalLink size={12} />
                  Explorer
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-white font-bold text-xl mb-4">Key Interfaces</h2>
      <CodeBlock code={interfaceCode} lang="solidity" />
    </div>
  ),
  xcm: (
    <div>
      <div className="flex items-center gap-2 text-[#bdf500] text-sm font-semibold mb-3 uppercase tracking-widest">
        <Network size={14} />
        Protocol
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-4">How XCM Works</h1>
      <p className="text-[#8e9191] text-lg mb-8 leading-relaxed">Cross-Chain Message Passing (XCM) is Polkadot's native interoperability protocol. Unlike bridges, XCM is a first-class feature with shared security.</p>

      <div className="space-y-3 mb-8">
        {[
          {
            step: '01',
            title: 'Message Initiation',
            desc: 'When a user submits a transfer, RemitStarCore constructs an XCM message containing the transfer intent, amount, and destination.',
          },
          {
            step: '02',
            title: 'Relay Chain Routing',
            desc: 'The XCM message is submitted to Polkadot Hub, which validates and routes it through the relay chain with full security guarantees.',
          },
          {
            step: '03',
            title: 'Asset Teleportation',
            desc: "USDC/USDT is teleported (not bridged) via XCM's teleport asset instruction, maintaining the same security level as the relay chain.",
          },
          {
            step: '04',
            title: 'Destination Settlement',
            desc: 'The destination parachain receives the XCM message and executes the token delivery to the recipient wallet in the same block.',
          },
        ].map((item, i) => (
          <div key={item.step} className="flex gap-5 bg-[#0a0a0a] border border-white/[0.08] hover:border-[rgba(189,245,0,0.2)] rounded-2xl p-5 transition-colors group">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[rgba(189,245,0,0.08)] border border-[rgba(189,245,0,0.2)] flex items-center justify-center shrink-0">
                <span className="text-[#bdf500] font-black text-xs font-mono">{item.step}</span>
              </div>
              {i < 3 && <div className="w-px flex-1 bg-[rgba(189,245,0,0.1)]" />}
            </div>
            <div className="pt-2 pb-4">
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-[#8e9191] text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <ArrowRight size={15} className="text-[#bdf500]" />
          XCM vs. Traditional Bridges
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Security model', xcm: 'Shared relay chain security', bridge: 'Separate validator set' },
            { label: 'Finality', xcm: '~6 seconds', bridge: '15–60 minutes' },
            { label: 'Trust assumption', xcm: 'None (protocol-level)', bridge: 'Multisig / committee' },
            { label: 'Failure mode', xcm: 'Auto-revert in same block', bridge: 'Funds may be locked' },
          ].map((row) => (
            <div key={row.label} className="col-span-2 grid grid-cols-3 gap-3 text-sm">
              <div className="text-[#8e9191] flex items-center">{row.label}</div>
              <div className="text-[#bdf500] bg-[rgba(189,245,0,0.05)] border border-[rgba(189,245,0,0.1)] rounded-lg px-3 py-2 text-xs">{row.xcm}</div>
              <div className="text-[#8e9191] bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-xs line-through opacity-60">{row.bridge}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  corridors: (
    <div>
      <div className="flex items-center gap-2 text-[#bdf500] text-sm font-semibold mb-3 uppercase tracking-widest">
        <Globe2 size={14} />
        Supported Markets
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-4">Supported Corridors</h1>
      <p className="text-[#8e9191] text-lg mb-8">12 active corridors across LATAM and APAC. All rates are sourced from Chainlink price feeds.</p>

      <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1.5fr_0.7fr_1fr_0.7fr_0.8fr] gap-3 px-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
          {['Corridor', 'Currency', 'Rate (1 USDC)', 'Fee', 'Status'].map((h) => (
            <div key={h} className="text-[#8e9191] text-xs font-semibold uppercase tracking-widest">{h}</div>
          ))}
        </div>
        {[
          { corridor: '🇺🇸 USA → 🇵🇪 Peru', currency: 'PEN', rate: '3.45', fee: '0.30%' },
          { corridor: '🇺🇸 USA → 🇵🇭 Philippines', currency: 'PHP', rate: '59.81', fee: '0.30%' },
          { corridor: '🇸🇬 Singapore → 🇮🇩 Indonesia', currency: 'IDR', rate: '13,220', fee: '0.31%' },
          { corridor: '🇺🇸 USA → 🇲🇽 Mexico', currency: 'MXN', rate: '17.68', fee: '0.30%' },
          { corridor: '🇯🇵 Japan → 🇻🇳 Vietnam', currency: 'VND', rate: '165.85', fee: '0.31%' },
          { corridor: '🇪🇸 Spain → 🇨🇴 Colombia', currency: 'COP', rate: '4,034', fee: '0.30%' },
          { corridor: '🇦🇪 UAE → 🇮🇳 India', currency: 'INR', rate: '25.17', fee: '0.29%' },
          { corridor: '🇦🇺 Australia → 🇵🇭 Philippines', currency: 'PHP', rate: '42.16', fee: '0.30%' },
        ].map((row) => (
          <div key={row.corridor} className="grid grid-cols-[1.5fr_0.7fr_1fr_0.7fr_0.8fr] gap-3 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors items-center">
            <div className="text-white text-sm">{row.corridor}</div>
            <div className="text-[#8e9191] font-mono text-sm">{row.currency}</div>
            <div className="text-white font-mono text-sm">{row.rate}</div>
            <div className="text-[#bdf500] font-mono text-sm font-semibold">{row.fee}</div>
            <div>
              <span className="inline-flex items-center gap-1.5 text-[#bdf500] text-xs font-semibold bg-[rgba(189,245,0,0.08)] border border-[rgba(189,245,0,0.2)] px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bdf500] animate-pulse" />
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[#8e9191] text-xs mt-4 text-center">Rates update every 60 seconds via Chainlink. 4 additional corridors launching Q2 2026.</p>
    </div>
  ),
  faq: (
    <div>
      <div className="flex items-center gap-2 text-[#bdf500] text-sm font-semibold mb-3 uppercase tracking-widest">
        <HelpCircle size={14} />
        Support
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-4">FAQ</h1>
      <p className="text-[#8e9191] text-lg mb-8">Common questions about RemitStar.</p>
      <div className="space-y-3">
        {[
          {
            q: 'Is RemitStar live on mainnet?',
            a: 'RemitStar is currently in testnet. Mainnet launch is planned for Q3 2026 after security audit completion.',
          },
          {
            q: 'How do exchange rates stay accurate?',
            a: 'We use Chainlink price feeds for on-chain rate verification combined with off-chain liquidity provider quotes. Rates are locked for 60 seconds when a transfer is initiated.',
          },
          {
            q: 'What happens if a transfer fails?',
            a: "Failed transfers are automatically reverted within the same transaction via XCM's error handling. Funds are returned to the sender's wallet with no loss, usually within the same block.",
          },
          {
            q: 'Can I integrate RemitStar into my app?',
            a: 'Yes! RemitStar exposes a simple IRemitStarCore interface. See the Smart Contracts section for interface details. Developer documentation and SDK are in progress.',
          },
        ].map((item, i) => (
          <details key={i} className="group bg-[#0a0a0a] border border-white/[0.08] hover:border-[rgba(189,245,0,0.2)] rounded-xl overflow-hidden transition-colors">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
              <span className="text-white font-semibold text-sm pr-4">{item.q}</span>
              <ChevronRight size={16} className="text-[#8e9191] group-open:rotate-90 transition-transform shrink-0" />
            </summary>
            <div className="px-5 pb-5 text-[#8e9191] text-sm leading-relaxed border-t border-white/[0.06] pt-4">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  ),
};

export default function DocsPage() {
  const [active, setActive] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <div className="border-b border-white/[0.08] bg-[#060606]/80 backdrop-blur-sm px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-[#bdf500] text-xl font-bold">●</span>
          <span className="text-white font-extrabold text-base">RemitStar</span>
          <ChevronRight size={14} className="text-[#8e9191]" />
          <span className="text-[#8e9191] text-sm">Docs</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/app"
            className="bg-[#bdf500] hover:bg-[#d8ff7b] text-black font-bold px-4 py-2 rounded-xl text-sm transition-all"
          >
            Launch App
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#8e9191] hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className="flex max-w-6xl mx-auto">
        <aside className={`${mobileMenuOpen ? 'block absolute z-20 w-64 bg-[#060606] shadow-2xl' : 'hidden'} md:block md:relative md:w-60 shrink-0 border-r border-white/[0.08] min-h-[calc(100vh-65px)] p-4`}>
          <div className="text-[#8e9191] text-xs font-semibold uppercase tracking-widest mb-4 px-3">Documentation</div>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => { setActive(s.id); setMobileMenuOpen(false); }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                active === s.id
                  ? 'bg-[rgba(189,245,0,0.08)] text-[#bdf500] border border-[rgba(189,245,0,0.2)]'
                  : 'text-[#8e9191] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span className={active === s.id ? 'text-[#bdf500]' : 'text-[#8e9191]'}>{s.icon}</span>
              {s.label}
            </button>
          ))}

          <div className="mt-6 pt-6 border-t border-white/[0.06] px-3">
            <div className="text-[#8e9191] text-xs mb-3">Need help?</div>
            <a
              href="https://github.com/Gabrululu/RemitStar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#8e9191] hover:text-[#bdf500] text-xs transition-colors"
            >
              <ExternalLink size={11} /> GitHub
            </a>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 max-w-3xl">
          {docsContent[active]}
        </main>
      </div>
    </div>
  );
}
