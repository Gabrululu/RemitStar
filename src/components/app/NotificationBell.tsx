import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCircle2 } from 'lucide-react';
import { usePublicClient, useAccount } from 'wagmi';
import { parseAbiItem } from 'viem';
import { ADDRESSES } from '../../lib/contracts';
import { formatUSDC } from '../../lib/utils/format';

interface Notification {
  id: string;
  title: string;
  body: string;
  txHash: string;
  timestamp: number;
  read: boolean;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();
  const publicClient = usePublicClient();

  // Fetch recent RemittanceSent events for connected wallet
  useEffect(() => {
    if (!address || !publicClient) return;

    let cancelled = false;

    async function fetchEvents() {
      if (!publicClient || !address) return;
      try {
        const logs = await publicClient.getLogs({
          address: ADDRESSES.RemitCore,
          event: parseAbiItem(
            'event RemittanceSent(address indexed sender, address indexed recipient, bytes32 indexed corridorId, address token, uint256 amountIn, uint256 fee, uint256 amountOut, bytes32 transferId)'
          ),
          args: { sender: address },
          fromBlock: 'earliest',
          toBlock: 'latest',
        });

        if (cancelled) return;

        const parsed: Notification[] = logs.slice(-10).reverse().map((log) => {
          const { amountIn, fee, transferId } = log.args as {
            amountIn: bigint;
            fee: bigint;
            transferId: `0x${string}`;
          };
          const id = transferId ?? log.transactionHash ?? String(Math.random());
          return {
            id,
            title: 'Transfer confirmed',
            body: `Sent $${formatUSDC(amountIn)} · Fee $${formatUSDC(fee)}`,
            txHash: log.transactionHash ?? '',
            timestamp: Date.now(),
            read: false,
          };
        });

        setNotifications(parsed);
      } catch {
        // silently ignore — no transfers yet or RPC error
      }
    }

    void fetchEvents();
    const interval = setInterval(() => { void fetchEvents(); }, 30_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [address, publicClient]);

  // Close panel on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const unread = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleOpen() {
    setOpen((v) => !v);
    if (!open) markAllRead();
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={handleOpen}
        className="relative text-[#8e9191] hover:text-white transition-colors p-2 rounded-xl hover:bg-white/[0.05]"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#bdf500] rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-[#0a0a0a] border border-white/[0.1] rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <span className="text-white font-semibold text-sm">Notifications</span>
            <button onClick={() => setOpen(false)} className="text-[#8e9191] hover:text-white transition-colors">
              <X size={15} />
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-[#8e9191] text-sm">
              No transfers yet. Send your first remittance!
            </div>
          ) : (
            <ul className="max-h-72 overflow-y-auto divide-y divide-white/[0.05]">
              {notifications.map((n) => (
                <li key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors">
                  <CheckCircle2 size={15} className="text-[#bdf500] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold">{n.title}</p>
                    <p className="text-[#8e9191] text-xs mt-0.5">{n.body}</p>
                    {n.txHash && (
                      <a
                        href={`https://blockscout-passet-hub.parity-testnet.parity.io/tx/${n.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#bdf500] text-[0.7rem] hover:underline mt-1 inline-block"
                      >
                        View on explorer →
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
