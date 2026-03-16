export interface Corridor {
  id: string;
  from: string;
  fromFlag: string;
  fromCode: string;
  to: string;
  toFlag: string;
  toCode: string;
  currency: string;
  currencySymbol: string;
  rate: number;
  volume: string;
  fee: string;
  popular: boolean;
  label: string;
}

export interface Transfer {
  id: string;
  date: string;
  amount: number;
  currency: string;
  received: number;
  receivedCurrency: string;
  corridor: string;
  fromFlag: string;
  toFlag: string;
  status: 'Completed' | 'Pending' | 'Failed';
  fee: number;
  txHash: string;
  recipient: string;
  settlementTime: string;
}

export interface PoolStats {
  tvl: string;
  apy: string;
  volume24h: string;
  yourDeposit: string;
  earned: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ChainOption {
  id: string;
  name: string;
  icon: string;
}

export interface TokenOption {
  id: string;
  name: string;
  icon: string;
}
