import React from 'react';
import { motion } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';

import Navbar from '../components/Navbar';
import HomePage from './pages/HomePage';
import SponsorPage from '../components/SponsorPage';
import Footer from '../components/Footer';

function App() {
  return (

      <div className="min-h-screen bg-blue-50 dark:bg-gray-900 text-blue-800 dark:text-blue-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sponsor" element={<SponsorPage />} />
          </Routes>
        </main>
        <Footer />
      </div>

  );
}

export default App;
