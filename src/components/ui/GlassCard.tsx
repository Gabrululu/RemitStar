import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export default function GlassCard({ children, className = '', hover = false, gradient = false }: GlassCardProps) {
  return (
    <div
      className={`
        relative rounded-2xl bg-[#13132A] border border-white/10
        ${gradient ? 'before:absolute before:inset-0 before:rounded-2xl before:p-px before:bg-gradient-to-br before:from-[#E6007A]/40 before:to-[#00B2FF]/20 before:-z-10' : ''}
        ${hover ? 'transition-all duration-300 hover:-translate-y-1 hover:border-[#E6007A]/40 hover:shadow-[0_0_30px_rgba(230,0,122,0.15)]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
