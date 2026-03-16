import React from 'react';

const stats = [
  { label: 'Total Volume', value: '$2,847,392' },
  { label: 'Transfers Today', value: '1,284' },
  { label: 'Avg. Settlement', value: '5.8s' },
  { label: 'Corridors', value: '12 active' },
  { label: 'Avg. Fee', value: '0.31%' },
  { label: 'Active Users', value: '8,492' },
  { label: 'Uptime', value: '99.98%' },
  { label: 'Countries', value: '20+' },
];

export default function StatsBar() {
  return (
    <div className="border-y border-white/[0.07] bg-[#060606] overflow-hidden">
      <div className="stats-marquee flex py-4">
        {[...stats, ...stats, ...stats].map((stat, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0 px-8">
            <span className="text-[#747878] text-[0.72rem] font-medium whitespace-nowrap">{stat.label}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[#bdf500] text-[0.78rem] font-bold font-mono whitespace-nowrap">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
