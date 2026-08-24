import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from '../components/Navbar';
import HomePage from './pages/HomePage';
import SponsorPage from '../components/SponsorPage';
import Footer from '../components/Footer';
import Register from './pages/register';
import Portal from './pages/Portal';
import Dashboard from './pages/Dashboard';
import AdminScan from './pages/AdminScan';
import AdminDashboard from './pages/AdminDashboard';
import SubmissionCountdown from './pages/SubmissionCountdown';
import AdminJudging from './pages/AdminJudging';
import NotFound from './pages/NotFound';
import StarfieldBackground from '../components/StarfieldBackground';
import { NavbarVisibilityProvider, useNavbarVisibility } from './context/NavbarVisibilityContext';

function AppShell() {
  const location = useLocation();
  const { visible } = useNavbarVisibility();
  const isCountdownRoute = location.pathname === '/submission-countdown';
  const shouldShowNavbar = isCountdownRoute ? visible : true;

  return (

      <div className="min-h-screen bg-black text-blue-100">
        <StarfieldBackground className="opacity-90" count={520} speed={0.35} parallax />
        <div className="relative z-10">
        {shouldShowNavbar && <Navbar />}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sponsor" element={<SponsorPage />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/portal" element={<Portal />} /> */}
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* <Route path="/admin/scan" element={<AdminScan />} /> */}
            {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
            {/* <Route path="/admin/judging" element={<AdminJudging />} /> */}
            {/* <Route path="/submission-countdown" element={<SubmissionCountdown />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        </div>
      </div>

  );
}

function App() {
  return (
    <NavbarVisibilityProvider>
      <AppShell />
    </NavbarVisibilityProvider>
  );
}

export default App;
