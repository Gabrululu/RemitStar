import { useState, useEffect, useCallback } from 'react';

const CACHE_KEY = 'remitstar_rates';
const CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutes

const FALLBACK_RATES: Record<string, number> = {
  PEN: 3.74,
  PHP: 56.2,
  IDR: 16240,
  MXN: 17.2,
  COP: 4100,
};

const CURRENCIES = Object.keys(FALLBACK_RATES);

interface RateCache {
  rates: Record<string, number>;
  timestamp: number;
}

function loadCache(): RateCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RateCache;
    if (Date.now() - parsed.timestamp < CACHE_TTL_MS) return parsed;
    return null;
  } catch {
    return null;
  }
}

function saveCache(rates: Record<string, number>): void {
  try {
    const entry: RateCache = { rates, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage unavailable — skip caching
  }
}

function pickCurrencies(allRates: Record<string, number>): Record<string, number> {
  const result: Record<string, number> = {};
  for (const c of CURRENCIES) {
    if (typeof allRates[c] === 'number') result[c] = allRates[c];
  }
  return result;
}

export function useExchangeRates() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = useCallback(async () => {
    const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY as string | undefined;

    // Use cache if fresh
    const cached = loadCache();
    if (cached) {
      setRates(cached.rates);
      setLastUpdated(new Date(cached.timestamp));
      setIsLoading(false);
      setError(null);
      return;
    }

    if (!apiKey) {
      setRates(FALLBACK_RATES);
      setLastUpdated(new Date());
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as {
        result: string;
        conversion_rates: Record<string, number>;
      };
      if (json.result !== 'success') throw new Error('API error');

      const picked = pickCurrencies(json.conversion_rates);
      saveCache(picked);
      setRates(picked);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      // Fall back to stale cache if available, else hardcoded fallback
      const stale = (() => {
        try {
          const raw = localStorage.getItem(CACHE_KEY);
          if (!raw) return null;
          return (JSON.parse(raw) as RateCache).rates;
        } catch {
          return null;
        }
      })();
      setRates(stale ?? FALLBACK_RATES);
      setLastUpdated(stale ? new Date() : null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRates();
    const interval = setInterval(() => {
      // Clear cache so refetch always hits API on interval
      try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
      void fetchRates();
    }, CACHE_TTL_MS);
    return () => clearInterval(interval);
  }, [fetchRates]);

  return { rates, isLoading, error, lastUpdated, refetch: fetchRates };
}
