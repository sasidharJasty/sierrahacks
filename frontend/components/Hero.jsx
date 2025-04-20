import React from "react";
import { motion } from "framer-motion";


const Hero = () => {

  
  // Scroll to section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="home" className="relative min-h-screen bg-blue-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden">

      
      {/* Terminal dot matrix background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="terminal-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(30, 64, 175, 0.5)" className="dark:fill-[rgba(56,189,248,0.5)]" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#terminal-dots)" />
        </svg>
      </div>
      
      {/* Subtle mountain silhouette */}
      <div className="absolute inset-x-0 bottom-0 z-0  h-64">
        <svg
          viewBox="0 0 1200 300"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0,300 L0,180 L150,250 L300,150 L450,200 L600,120 L750,220 L900,140 L1050,190 L1200,150 L1200,300 Z"
            fill="currentColor"
            className="text-blue-700 opacity-10 dark:opacity-100 dark:text-[#111828]"
          />
        </svg>
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-blue-50 to-blue-100/50 dark:to-[#111828] dark:via-gray-900 dark:from-blue-900/30 z-0"></div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Logo icon */}
          <div className="mx-auto w-16 h-16 bg-blue-500/20 dark:bg-blue-500/10 border-blue-500/30 dark:border-blue-500/20 shadow-blue-500/10 dark:shadow-blue-500/5 backdrop-blur-sm rounded-lg flex items-center justify-center border shadow-lg">
            <svg className="w-10 h-10 text-blue-600 dark:text-blue-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L3 8.5L12 14L21 8.5L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 15.5L12 21L21 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12L12 17.5L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* Subtle command prompt */}
         
          
          {/* Event name */}
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-300 dark:to-blue-100">
            SierraHacks 2025
          </h1>
          
          {/* Date and location */}
          <h2 className="text-xl md:text-2xl text-blue-700 dark:text-blue-200 font-light">
            May 17-19, 2025 • Sierra Nevada Mountains
          </h2>
          
          {/* Brief description */}
          <p className="text-lg md:text-xl text-blue-800/90 dark:text-blue-100/80 max-w-2xl mx-auto">
            A weekend of innovation and code in the mountains<span className="text-blue-600 dark:text-blue-500 animate-pulse ml-1">_</span>
          </p>
          
          {/* Key stats */}
          <div className="flex justify-center gap-10 lg:gap-16">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-300 font-mono">500+</div>
              <div className="text-blue-600/80 dark:text-blue-200/80 text-sm">Hackers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-300 font-mono">48</div>
              <div className="text-blue-600/80 dark:text-blue-200/80 text-sm">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-300 font-mono">$10K</div>
              <div className="text-blue-600/80 dark:text-blue-200/80 text-sm">Prizes</div>
            </div>
          </div>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <motion.button
              onClick={() => scrollToSection("register")}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600/90 dark:hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold transition-colors group flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-blue-900/20"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Register Now</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
            
            <motion.button
              onClick={() => scrollToSection("about")}
              className="bg-transparent hover:bg-blue-500/10 text-blue-700 dark:text-blue-200 px-8 py-3 rounded-md font-semibold transition-colors border border-blue-500/30 dark:border-blue-400/20"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Minimal scroll indicator */}
      <motion.div
        className="absolute bottom-30 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={() => scrollToSection("about")}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg className="w-6 h-6 text-blue-600/70 dark:text-blue-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </div>
  );
};

export default Hero;