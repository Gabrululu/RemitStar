import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppSidebar from '../components/app/AppSidebar';
import AppTopBar from '../components/app/AppTopBar';
import AppMobileNav from '../components/app/AppMobileNav';
import NetworkBanner from '../components/app/NetworkBanner';

const pageTitles: Record<string, string> = {
  '/app/send': 'Send Money',
  '/app/history': 'History',
  '/app/liquidity': 'Liquidity Pool',
  '/app/settings': 'Settings',
  '/app': 'Send Money',
};

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'RemitStar';

  return (
    <div className="min-h-screen bg-black flex">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0">
        <NetworkBanner />
        <AppTopBar pageTitle={title} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
      <AppMobileNav />
    </div>
  );
}
