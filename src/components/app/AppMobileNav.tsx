import { NavLink } from 'react-router-dom';
import { Send, History, Droplets, Settings } from 'lucide-react';

const navItems = [
  { label: 'Send', icon: <Send size={20} />, to: '/app/send' },
  { label: 'History', icon: <History size={20} />, to: '/app/history' },
  { label: 'Liquidity', icon: <Droplets size={20} />, to: '/app/liquidity' },
  { label: 'Settings', icon: <Settings size={20} />, to: '/app/settings' },
];

export default function AppMobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#060606]/95 backdrop-blur-xl border-t border-white/[0.08] z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive ? 'text-[#bdf500]' : 'text-[#8e9191] hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
