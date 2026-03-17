import NotificationBell from './NotificationBell';
import WalletButton from './WalletButton';

interface AppTopBarProps {
  pageTitle: string;
}

export default function AppTopBar({ pageTitle }: AppTopBarProps) {
  return (
    <header className="h-16 bg-[#060606]/80 backdrop-blur-sm border-b border-white/[0.08] flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-white font-bold text-lg">{pageTitle}</h1>
        <div className="flex items-center gap-1.5 bg-[rgba(189,245,0,0.08)] border border-[rgba(189,245,0,0.2)] rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#bdf500] animate-pulse" />
          <span className="text-[#bdf500] text-xs font-semibold">Polkadot Hub</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationBell />

        <WalletButton />
      </div>
    </header>
  );
}
