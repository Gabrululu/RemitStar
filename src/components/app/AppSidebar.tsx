import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Send, History, Droplets, Settings, ArrowLeft, ChevronLeft } from 'lucide-react';

const navItems = [
  { label: 'Send', icon: <Send size={18} />, to: '/app/send' },
  { label: 'History', icon: <History size={18} />, to: '/app/history' },
  { label: 'Liquidity', icon: <Droplets size={18} />, to: '/app/liquidity' },
  { label: 'Settings', icon: <Settings size={18} />, to: '/app/settings' },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const navigate = useNavigate();

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#060606] border-r border-white/[0.08] transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-56'
      } min-h-screen`}
    >
      <div className={`flex items-center p-4 border-b border-white/[0.08] ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
            <span className="text-[#bdf500] text-xl font-bold">●</span>
            <span className="text-white font-extrabold text-base tracking-tight">RemitFlow</span>
          </button>
        )}
        {collapsed && (
          <span className="text-[#bdf500] text-xl font-bold">●</span>
        )}
        <button
          onClick={onToggle}
          className="text-[#8e9191] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.05]"
        >
          <ChevronLeft size={16} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[rgba(189,245,0,0.1)] text-[#bdf500] border border-[rgba(189,245,0,0.2)]'
                  : 'text-[#8e9191] hover:text-white hover:bg-white/[0.05]'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={`p-3 border-t border-white/[0.08] ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 text-[#8e9191] hover:text-white transition-colors text-sm py-2 px-3 rounded-xl hover:bg-white/[0.05] ${collapsed ? 'justify-center' : ''}`}
        >
          <ArrowLeft size={16} />
          {!collapsed && <span>Back to site</span>}
        </button>
      </div>
    </aside>
  );
}
