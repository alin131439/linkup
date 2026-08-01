import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Home from '@/pages/Home';
import RoomLobby from '@/pages/RoomLobby';
import Warmup from '@/pages/Warmup';
import Icebreak from '@/pages/Icebreak';
import FrequencyMap from '@/pages/FrequencyMap';
import Connections from '@/pages/Connections';
import Profile from '@/pages/Profile';

function AppContent() {
  const location = useLocation();
  const hideNavPaths = ['/room/', '/warmup'];
  const shouldHideNav = hideNavPaths.some((p) => location.pathname.startsWith(p));

  return (
    <>
      {!shouldHideNav && <Navigation />}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:code" element={<RoomLobby />} />
          <Route path="/warmup" element={<Warmup />} />
          <Route path="/icebreak" element={<Icebreak />} />
          <Route path="/frequency-map" element={<FrequencyMap />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
