import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from '../components/Navbar';
import HomePage from './pages/HomePage';
import SponsorPage from '../components/SponsorPage';
import Footer from '../components/Footer';
import Register from './pages/register';
import Portal from './pages/Portal';
import Dashboard from './pages/Dashboard';
import AdminScan from './pages/AdminScan';

function App() {
  return (

      <div className="min-h-screen bg-blue-50 dark:bg-gray-900 text-blue-800 dark:text-blue-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sponsor" element={<SponsorPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/portal" element={<Portal />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/scan" element={<AdminScan />} />
          </Routes>
        </main>
        <Footer />
      </div>

  );
}

export default App;
