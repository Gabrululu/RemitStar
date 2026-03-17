import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import AppLayout from './pages/AppLayout';
import SendPage from './pages/SendPage';
import HistoryPage from './pages/HistoryPage';
import LiquidityPage from './pages/LiquidityPage';
import SettingsPage from './pages/SettingsPage';
import DocsPage from './pages/DocsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/send" replace />} />
          <Route path="send" element={<SendPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="liquidity" element={<LiquidityPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/docs" element={<DocsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
