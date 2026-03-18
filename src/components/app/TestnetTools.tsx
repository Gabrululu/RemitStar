import { useState } from 'react';
import { ShieldCheck, Coins, CheckCircle, Loader2 } from 'lucide-react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useWallet } from '../../lib/hooks/useWallet';
import { useTokenBalance } from '../../lib/hooks/useTokenBalance';
import { ADDRESSES, COMPLIANCE_ABI, ERC20_ABI } from '../../lib/contracts';

export default function TestnetTools() {
  const { address, isConnected, isCorrectNetwork } = useWallet();

  const {
    data: kycApproved,
    isLoading: kycLoading,
    refetch: refetchKyc,
  } = useReadContract({
    address: ADDRESSES.ComplianceGate,
    abi: COMPLIANCE_ABI,
    functionName: 'kycApproved',
    args: [address as `0x${string}`],
    query: { enabled: !!address && isCorrectNetwork },
  });

  const { formatted: usdcBalance, refetch: refetchBalance } = useTokenBalance(ADDRESSES.USDC);

  const { writeContract: writeKyc, data: kycTxHash, isPending: kycWritePending, error: kycWriteError } = useWriteContract();
  const { writeContract: writeFaucet, data: faucetTxHash, isPending: faucetWritePending, error: faucetWriteError } = useWriteContract();

  const { isLoading: kycConfirming, isSuccess: kycSuccess } = useWaitForTransactionReceipt({ hash: kycTxHash });
  const { isLoading: faucetConfirming, isSuccess: faucetSuccess } = useWaitForTransactionReceipt({ hash: faucetTxHash });

  const [kycError, setKycError] = useState<string | null>(null);
  const [faucetError, setFaucetError] = useState<string | null>(null);

  if (kycSuccess) {
    refetchKyc();
  }
  if (faucetSuccess) {
    refetchBalance();
  }

  const handleApproveKyc = () => {
    if (!address) return;
    setKycError(null);
    writeKyc(
      {
        address: ADDRESSES.ComplianceGate,
        abi: COMPLIANCE_ABI,
        functionName: 'approveKYC',
        args: [address as `0x${string}`],
      },
      {
        onError: (e) => setKycError(e.message.slice(0, 120)),
      }
    );
  };

  const handleFaucet = () => {
    if (!address) return;
    setFaucetError(null);
    writeFaucet(
      {
        address: ADDRESSES.USDC,
        abi: ERC20_ABI,
        functionName: 'faucet',
        args: [address as `0x${string}`, 10000000000n],
      },
      {
        onError: (e) => setFaucetError(e.message.slice(0, 120)),
      }
    );
  };

  if (!isConnected || !isCorrectNetwork) return null;

  const kycPending = kycWritePending || kycConfirming;
  const faucetPending = faucetWritePending || faucetConfirming;
  const errorKyc = kycError ?? (kycWriteError?.message.slice(0, 120) ?? null);
  const errorFaucet = faucetError ?? (faucetWriteError?.message.slice(0, 120) ?? null);

  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-white font-bold text-xl">Testnet Tools</h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
          Testnet Only
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* KYC Card */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-white font-semibold">KYC Self-Approval</p>
              <p className="text-white/50 text-xs">Approve your own KYC on testnet</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {kycLoading ? (
              <span className="text-white/40">Checking status…</span>
            ) : kycApproved ? (
              <>
                <CheckCircle size={16} className="text-emerald-400" />
                <span className="text-emerald-400 font-medium">KYC Approved</span>
              </>
            ) : (
              <span className="text-white/50">Not yet approved</span>
            )}
          </div>

          {errorKyc && (
            <p className="text-red-400 text-xs break-all">{errorKyc}</p>
          )}

          <button
            onClick={handleApproveKyc}
            disabled={kycApproved === true || kycPending || kycLoading}
            className="mt-auto flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all
              bg-blue-600 hover:bg-blue-500 text-white
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {kycPending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Approving…
              </>
            ) : (
              'Approve My KYC'
            )}
          </button>
        </div>

        {/* Faucet Card */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Coins size={22} />
            </div>
            <div>
              <p className="text-white font-semibold">USDC Faucet</p>
              <p className="text-white/50 text-xs">Mint test USDC to your wallet</p>
            </div>
          </div>

          <div className="text-sm text-white/50">
            Balance:{' '}
            <span className="text-white font-medium">{usdcBalance} USDC</span>
          </div>

          {faucetSuccess && (
            <p className="text-emerald-400 text-xs font-medium">
              10,000 USDC added to your wallet
            </p>
          )}
          {errorFaucet && (
            <p className="text-red-400 text-xs break-all">{errorFaucet}</p>
          )}

          <button
            onClick={handleFaucet}
            disabled={faucetPending}
            className="mt-auto flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all
              bg-emerald-600 hover:bg-emerald-500 text-white
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {faucetPending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Minting…
              </>
            ) : (
              'Get 10,000 USDC'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
