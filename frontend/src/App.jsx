import React from 'react';
import { motion } from 'framer-motion';
import CustomCursor from '../components/CustomCursor';
import TerminalLayout from '../components/TerminalLayout';
import Hero from '../components/Hero';
import FAQ from '../components/FAQ';
import Timeline from '../components/Timeline';
import Criteria from '../components/Criteria';
import Judges from '../components/Judges';
import Members from '../components/Members';
import { ThemeProvider } from '../context/ThemeContext';


function App() {
  return (


      <TerminalLayout>
        <div className="min-h-screen bg-gray-900">
          <Hero />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FAQ />
            <Timeline />
            <Criteria />
            <Judges />
            <Members />
          </motion.div>
        </div>
      </TerminalLayout>

  );
}

export default App;
