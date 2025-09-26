import React, { useEffect } from "react";
import { motion } from "framer-motion";
import logo from "../public/logo.png";
import cs from "../public/codestack.jpg";

const Hero = () => {
  // Sync Tailwind dark mode with site/system/user preference
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (isDark) => {
      root.classList.toggle("dark", !!isDark);
    };

    // 1) If user explicitly chose a theme, use it; else follow system.
    const stored = localStorage.getItem("theme"); // 'dark' | 'light' | null
    if (stored === "dark" || stored === "light") {
      apply(stored === "dark");
    } else {
      apply(media.matches);
    }

    // 2) React to OS changes if no explicit user choice
    const onMediaChange = (e) => {
      if (!localStorage.getItem("theme")) apply(e.matches);
    };
    media.addEventListener("change", onMediaChange);

    // 3) React to cross-tab updates of localStorage('theme')
    const onStorage = (e) => {
      if (e.key === "theme") {
        const v = e.newValue;
        if (v === "dark" || v === "light") apply(v === "dark");
        else apply(media.matches);
      }
    };
    window.addEventListener("storage", onStorage);

    // 4) Optional: expose a helper so other UI can set theme
    window.setSiteTheme = (mode) => {
      // mode: 'dark' | 'light' | 'system'
      if (mode === "dark" || "light") {
        localStorage.setItem("theme", mode);
        apply(mode === "dark");
      } else {
        localStorage.removeItem("theme");
        apply(media.matches);
      }
    };

    return () => {
      media.removeEventListener("change", onMediaChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="home" className="relative min-h-screen bg-blue-50 dark:bg-blue-700 flex items-center justify-center overflow-hidden">
      {/* Enhanced dot matrix background with subtle animation */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="terminal-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(30, 64, 175, 0.5)" className="dark:fill-[rgba(56,189,248,0.5)]" />
            </pattern>
            <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(30, 64, 175, 0.2)" className="dark:stop-color-[rgba(56,189,248,0.2)]" />
              <stop offset="50%" stopColor="rgba(30, 64, 175, 0.1)" className="dark:stop-color-[rgba(56,189,248,0.1)]" />
              <stop offset="100%" stopColor="rgba(30, 64, 175, 0.2)" className="dark:stop-color-[rgba(56,189,248,0.2)]" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#terminal-dots)" />
          <rect width="100%" height="100%" fill="url(#grid-gradient)" opacity="0.3" />
        </svg>
      </div>


      {/* Original circuit lines (light theme only) */}
      <div className="absolute inset-0 overflow-hidden dark:hidden">
        {/* Circuit-like lines */}
        <svg className="absolute opacity-[0.07] w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,500 Q250,350 500,500 T1000,500" 
                stroke="currentColor" 
                strokeWidth="1" 
                fill="none" 
                className="text-blue-700" />
          <path d="M0,300 Q250,450 500,300 T1000,300" 
                stroke="currentColor" 
                strokeWidth="1" 
                fill="none" 
                className="text-blue-700" />
          <path d="M0,700 Q250,550 500,700 T1000,700" 
                stroke="currentColor" 
                strokeWidth="1" 
                fill="none" 
                className="text-blue-700" />
          
          {/* Vertical connectors */}
          <line x1="250" y1="200" x2="250" y2="800" 
                stroke="currentColor" 
                strokeWidth="1"
                strokeDasharray="5,5"
                className="text-blue-600" />
          <line x1="500" y1="200" x2="500" y2="800" 
                stroke="currentColor" 
                strokeWidth="1"
                strokeDasharray="5,5"
                className="text-blue-600" />
          <line x1="750" y1="200" x2="750" y2="800" 
                stroke="currentColor" 
                strokeWidth="1"
                strokeDasharray="5,5"
                className="text-blue-600" />

          {/* Circuit nodes */}
          <circle cx="250" cy="300" r="4" fill="currentColor" className="text-blue-500" />
          <circle cx="500" cy="500" r="4" fill="currentColor" className="text-blue-500" />
          <circle cx="750" cy="700" r="4" fill="currentColor" className="text-blue-500" />
          <circle cx="250" cy="700" r="4" fill="currentColor" className="text-blue-500" />
          <circle cx="750" cy="300" r="4" fill="currentColor" className="text-blue-500" />
        </svg>
      </div>

      {/* Animated green circuit lines (dark theme only) */}
      <div className="block absolute inset-0 overflow-hidden">
        <svg className="absolute w-full h-full opacity-90" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="circuit-gradient-1" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
              <stop offset="0%" stopColor="#00ff6a" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <linearGradient id="circuit-gradient-2" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#00ff6a" />
            </linearGradient>
            
            <mask id="left-circuit-mask-1">
              <motion.path 
                d="M-50,250 L150,250 L150,350 L300,350 L300,450"
                stroke="white" 
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0, pathOffset: 1 }}
                animate={{ pathLength: 1, pathOffset: 0 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              />
            </mask>
            <mask id="left-circuit-mask-2">
              <motion.path 
                d="M-50,450 L50,450 L50,650 L200,650 L200,550 L250,550"
                stroke="white" 
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0, pathOffset: 1 }}
                animate={{ pathLength: 1, pathOffset: 0 }}
                transition={{ duration: 2.3, ease: "easeInOut", delay: 0.8 }}
              />
            </mask>
            <mask id="left-circuit-mask-3">
              <motion.path 
                d="M-50,650 L100,650 L100,800 L250,800 L250,700"
                stroke="white" 
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0, pathOffset: 1 }}
                animate={{ pathLength: 1, pathOffset: 0 }}
                transition={{ duration: 1.8, ease: "easeInOut", delay: 1.2 }}
              />
            </mask>
            
            <mask id="right-circuit-mask-1">
              <motion.path 
                d="M1050,200 L900,200 L900,300 L750,300 L750,150 L650,150"
                stroke="white" 
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0, pathOffset: 1 }}
                animate={{ pathLength: 1, pathOffset: 0 }}
                transition={{ duration: 2.2, ease: "easeInOut", delay: 0.7 }}
              />
            </mask>
            <mask id="right-circuit-mask-2">
              <motion.path 
                d="M1050,500 L850,500 L850,600 L700,600 L700,450"
                stroke="white" 
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0, pathOffset: 1 }}
                animate={{ pathLength: 1, pathOffset: 0 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 1.0 }}
              />
            </mask>
            <mask id="right-circuit-mask-3">
              <motion.path 
                d="M1050,750 L950,750 L950,650 L800,650 L800,800 L700,800"
                stroke="white" 
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0, pathOffset: 1 }}
                animate={{ pathLength: 1, pathOffset: 0 }}
                transition={{ duration: 2.1, ease: "easeInOut", delay: 1.3 }}
              />
            </mask>

            <mask id="vertical-mask-1">
              <motion.path 
                d="M300,450 L300,750"
                stroke="white"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeIn", delay: 2.5 }}
              />
            </mask>
            <mask id="vertical-mask-2">
              <motion.path 
                d="M700,450 L700,800"
                stroke="white"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeIn", delay: 3.0 }}
              />
            </mask>

            <mask id="diagonal-mask-1">
              <motion.path 
                d="M150,250 L250,150"
                stroke="white"
                strokeWidth="3"
                initial={{ pathLength: 0, pathOffset: 1 }}
                animate={{ pathLength: 1, pathOffset: 0 }}
                transition={{ duration: 1.2, ease: "easeIn", delay: 2.8 }}
              />
            </mask>
            <mask id="diagonal-mask-2">
              <motion.path 
                d="M850,500 L950,400"
                stroke="white"
                strokeWidth="3"
                initial={{ pathLength: 0, pathOffset: 1 }}
                animate={{ pathLength: 1, pathOffset: 0 }}
                transition={{ duration: 1.2, ease: "easeIn", delay: 3.1 }}
              />
            </mask>
          </defs>
          
          <path d="M-50,250 L150,250 L150,350 L300,350 L300,450"
                stroke="rgba(16, 185, 129, 0.1)" 
                strokeWidth="3" 
                fill="none" />
          <path d="M-50,450 L50,450 L50,650 L200,650 L200,550 L250,550"
                stroke="rgba(16, 185, 129, 0.1)" 
                strokeWidth="3" 
                fill="none" />
          <path d="M-50,650 L100,650 L100,800 L250,800 L250,700"
                stroke="rgba(16, 185, 129, 0.1)" 
                strokeWidth="3" 
                fill="none" />
          
          <path d="M1050,200 L900,200 L900,300 L750,300 L750,150 L650,150"
                stroke="rgba(16, 185, 129, 0.1)" 
                strokeWidth="3" 
                fill="none" />
          <path d="M1050,500 L850,500 L850,600 L700,600 L700,450"
                stroke="rgba(16, 185, 129, 0.1)" 
                strokeWidth="3" 
                fill="none" />
          <path d="M1050,750 L950,750 L950,650 L800,650 L800,800 L700,800"
                stroke="rgba(16, 185, 129, 0.1)" 
                strokeWidth="3" 
                fill="none" />
              
          <path d="M300,450 L300,750"
                stroke="rgba(16, 185, 129, 0.1)" 
                strokeWidth="3"
                fill="none" />
          <path d="M700,450 L700,800"
                stroke="rgba(16, 185, 129, 0.1)" 
                strokeWidth="3"
                fill="none" />

          <path d="M150,250 L250,150"
                stroke="rgba(16, 185, 129, 0.1)" 
                strokeWidth="3" 
                fill="none" />
          <path d="M850,500 L950,400"
                stroke="rgba(16, 185, 129, 0.1)" 
                strokeWidth="3" 
                fill="none" />
          
          <path d="M-50,250 L150,250 L150,350 L300,350 L300,450"
                stroke="url(#circuit-gradient-1)" 
                strokeWidth="3" 
                fill="none"
                mask="url(#left-circuit-mask-1)" />
          <path d="M-50,450 L50,450 L50,650 L200,650 L200,550 L250,550"
                stroke="url(#circuit-gradient-2)" 
                strokeWidth="3" 
                fill="none"
                mask="url(#left-circuit-mask-2)" />
          <path d="M-50,650 L100,650 L100,800 L250,800 L250,700"
                stroke="url(#circuit-gradient-1)" 
                strokeWidth="3" 
                fill="none"
                mask="url(#left-circuit-mask-3)" />
          
          <path d="M1050,200 L900,200 L900,300 L750,300 L750,150 L650,150"
                stroke="url(#circuit-gradient-2)" 
                strokeWidth="3" 
                fill="none"
                mask="url(#right-circuit-mask-1)" />
          <path d="M1050,500 L850,500 L850,600 L700,600 L700,450"
                stroke="url(#circuit-gradient-1)" 
                strokeWidth="3" 
                fill="none"
                mask="url(#right-circuit-mask-2)" />
          <path d="M1050,750 L950,750 L950,650 L800,650 L800,800 L700,800"
                stroke="url(#circuit-gradient-2)" 
                strokeWidth="3" 
                fill="none"
                mask="url(#right-circuit-mask-3)" />
              
          <path d="M300,450 L300,750"
                stroke="url(#circuit-gradient-1)" 
                strokeWidth="3"
                mask="url(#vertical-mask-1)" />
          <path d="M700,450 L700,800"
                stroke="url(#circuit-gradient-2)" 
                strokeWidth="3"
                mask="url(#vertical-mask-2)" />
          
          <path d="M150,250 L250,150"
                stroke="url(#circuit-gradient-2)" 
                strokeWidth="3" 
                fill="none"
                mask="url(#diagonal-mask-1)" />
          <path d="M850,500 L950,400"
                stroke="url(#circuit-gradient-1)" 
                strokeWidth="3" 
                fill="none"
                mask="url(#diagonal-mask-2)" />
          
          <motion.circle 
            cx="150" cy="250" r="0" 
            fill="#4ade80" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          />
          <motion.circle 
            cx="150" cy="350" r="0" 
            fill="#4ade80" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 2.7, duration: 0.5 }}
          />
          <motion.circle 
            cx="300" cy="350" r="0" 
            fill="#4ade80" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 2.9, duration: 0.5 }}
          />
          <motion.circle 
            cx="300" cy="450" r="0" 
            fill="#4ade80" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.1, duration: 0.5 }}
          />
          
          <motion.circle 
            cx="50" cy="450" r="0" 
            fill="#00ff6a" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.1, duration: 0.5 }}
          />
          <motion.circle 
            cx="50" cy="650" r="0" 
            fill="#00ff6a" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.3, duration: 0.5 }}
          />
          <motion.circle 
            cx="200" cy="650" r="0" 
            fill="#00ff6a" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.5, duration: 0.5 }}
          />
          <motion.circle 
            cx="200" cy="550" r="0" 
            fill="#00ff6a" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.7, duration: 0.5 }}
          />
          
          <motion.circle 
            cx="100" cy="650" r="0" 
            fill="#4ade80" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.0, duration: 0.5 }}
          />
          <motion.circle 
            cx="100" cy="800" r="0" 
            fill="#4ade80" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.2, duration: 0.5 }}
          />
          <motion.circle 
            cx="250" cy="800" r="0" 
            fill="#4ade80" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.4, duration: 0.5 }}
          />
          
          <motion.circle 
            cx="900" cy="200" r="0" 
            fill="#00ff6a" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 2.9, duration: 0.5 }}
          />
          <motion.circle 
            cx="900" cy="300" r="0" 
            fill="#00ff6a" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.1, duration: 0.5 }}
          />
          <motion.circle 
            cx="750" cy="300" r="0" 
            fill="#00ff6a" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.3, duration: 0.5 }}
          />
          <motion.circle 
            cx="750" cy="150" r="0" 
            fill="#00ff6a" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.5, duration: 0.5 }}
          />
          
          <motion.circle 
            cx="850" cy="500" r="0" 
            fill="#4ade80" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.0, duration: 0.5 }}
          />
          <motion.circle 
            cx="850" cy="600" r="0" 
            fill="#4ade80" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.2, duration: 0.5 }}
          />
          <motion.circle 
            cx="700" cy="600" r="0" 
            fill="#4ade80" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.4, duration: 0.5 }}
          />
          <motion.circle 
            cx="700" cy="450" r="0" 
            fill="#4ade80" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.6, duration: 0.5 }}
          />
          
          <motion.circle 
            cx="950" cy="750" r="0" 
            fill="#00ff6a" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.4, duration: 0.5 }}
          />
          <motion.circle 
            cx="950" cy="650" r="0" 
            fill="#00ff6a" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.6, duration: 0.5 }}
          />
          <motion.circle 
            cx="800" cy="650" r="0" 
            fill="#00ff6a" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.8, duration: 0.5 }}
          />
          <motion.circle 
            cx="800" cy="800" r="0" 
            fill="#00ff6a" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 4.0, duration: 0.5 }}
          />
          
          <motion.circle 
            cx="250" cy="150" r="0" 
            fill="#00ff6a" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 4.0, duration: 0.5 }}
          />
          <motion.circle 
            cx="300" cy="750" r="0" 
            fill="#4ade80" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 4.0, duration: 0.5 }}
          />
          <motion.circle 
            cx="700" cy="800" r="0" 
            fill="#00ff6a" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 4.5, duration: 0.5 }}
          />
          <motion.circle 
            cx="950" cy="400" r="0" 
            fill="#4ade80" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 4.3, duration: 0.5 }}
          />
          <motion.circle 
            cx="650" cy="150" r="0" 
            fill="#00ff6a" 
            initial={{ r: 0 }}
            animate={{ r: 7 }}
            transition={{ delay: 3.7, duration: 0.5 }}
          />
          
          {[
            {cx: 150, cy: 250},
            {cx: 900, cy: 200},
            {cx: 50, cy: 650},
            {cx: 850, cy: 500},
            {cx: 100, cy: 800},
            {cx: 950, cy: 650},
            {cx: 300, cy: 450},
            {cx: 700, cy: 600}
          ].map((node, i) => (
            <motion.circle 
              key={`pulse-${i}`}
              cx={node.cx} 
              cy={node.cy} 
              r="7"
              fill="#00ff6a"
              initial={{ opacity: 0, scale: 1 }}
              animate={{ 
                opacity: [0, 0.9, 0],
                scale: [1, 2.5, 1]
              }}
              transition={{
                delay: 4.5 + (i * 0.4),
                duration: 2,
                repeat: Infinity,
                repeatDelay: 2 + Math.random() * 8
              }}
            />
          ))}
          
          <motion.rect
            x="150" cy="350"
            width="70"
            height="30"
            rx="2"
            fill="#064e3b"
            stroke="#00ff6a"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5.0, duration: 0.8 }}
          />
          
          <motion.rect
            x="800" cy="650"
            width="55"
            height="55"
            rx="2"
            fill="#064e3b"
            stroke="#00ff6a"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5.2, duration: 0.8 }}
          />
          
          <motion.circle
            cx="850"
            cy="500"
            r="18"
            fill="#064e3b"
            stroke="#00ff6a"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5.4, duration: 0.8 }}
          />
        </svg>
      </div>

      {/* Floating tech particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-blue-400/20 dark:bg-green-400/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Enhanced mountain silhouette with subtle animation */}
      <div className="absolute inset-x-0 bottom-0 z-0 h-64">
        <motion.svg
          viewBox="0 0 1200 300"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-full"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <path
            d="M0,300 L0,180 L150,250 L300,150 L450,200 L600,120 L750,220 L900,140 L1050,190 L1200,150 L1200,300 Z"
            fill="currentColor"
            className="text-blue-700 opacity-10 dark:opacity-100 dark:text-[#111828]"
          />
          <path
            d="M0,300 L0,200 L150,270 L300,170 L450,220 L600,140 L750,240 L900,160 L1050,210 L1200,170 L1200,300 Z"
            fill="currentColor"
            className="text-blue-600 opacity-5 dark:opacity-70 dark:text-[#182338]"
          />
        </motion.svg>
      </div>

      {/* Enhanced gradient overlay with more depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-blue-50/95 to-blue-100/50 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-[#111828] z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent_70%)]"></div>
      </div>

      {/* Partnership section - improved mobile responsiveness */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-4 sm:bottom-10 right-4 sm:right-20 flex flex-col items-end max-w-[180px] sm:max-w-none"
      >
        <div className="text-[10px] xs:text-xs sm:text-sm text-yellow-400 font-light tracking-wide mb-1 sm:mb-2 text-right">
          IN PARTNERSHIP WITH
        </div>
        <div className="flex flex-row items-end space-x-2">
        <motion.a
          href="https://www.codestack.org" 
          target="_blank"
          rel="noopener noreferrer"

          className="flex items-center justify-end bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 border border-blue-200/50 dark:border-blue-700/30 shadow-lg"
          whileHover={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)" }}
        >
          <span className="text-sm sm:text-base md:text-lg font-semibold text-blue-800 dark:text-blue-200 mr-1.5 sm:mr-2">
            CODESTACK
          </span>
          <img src={cs} alt="CodeStack Logo" className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg" />
        </motion.a>

        <motion.a
          href="https://hcb.hackclub.com/donations/start/codecatalyst" 
          target="_blank"
          rel="noopener noreferrer"

          className="flex items-center justify-end bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 border border-blue-200/50 dark:border-blue-700/30 shadow-lg ml-2"
          whileHover={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)" }}
        >
          <span className="text-sm sm:text-base md:text-lg font-semibold text-blue-800 dark:text-blue-200 mr-1.5 sm:mr-2">
            CODECATALYST
          </span>
          {/*<img src={cs} alt="CodeStack Logo" className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg" />*/}
        </motion.a>
        </div>
        
        <svg className="w-16 sm:w-24 h-2 mt-0.5 sm:mt-1 opacity-30" viewBox="0 0 100 4" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="2" x2="100" y2="2" stroke="currentColor" strokeWidth="2" strokeDasharray="1 3" className="text-blue-700 dark:text-blue-300" />
        </svg>
      </motion.div>

   

      {/* Main container */}
      <div className="container mx-auto px-4 -mt-20 relative z-10 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Logo icon */}
          <div className="mx-auto w-16 h-16 bg-blue-500/20 dark:bg-blue-500/10 border-blue-500/30 dark:border-blue-500/20 shadow-blue-500/10 dark:shadow-blue-500/5 backdrop-blur-sm rounded-lg flex items-center justify-center border shadow-lg mt-25">
            <img src={logo}  alt="SierraHacks logo" />
          </div>

          {/* Event name */}
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-300 dark:to-blue-100">
            Sierra<span className="text-blue-500">Hacks</span> 2025
          </h1>

          {/* Date and location */}
          <h2 className="text-xl md:text-2xl text-blue-700 dark:text-white font-light">
            Nov 15, 2025 • Sierra High School
          </h2>

          {/* Brief description */}
          <p className="text-lg md:text-xl text-blue-800/90 dark:text-blue-100/80 max-w-2xl mx-auto">
            A 12-hour coding marathon where innovation meets collaboration!
            <span className="text-blue-600 dark:text-blue-500 animate-pulse ml-1">_</span>
          </p>

          {/* Key stats */}
          <div className="flex justify-center gap-10 lg:gap-16">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-500 font-mono">175+</div>
              <div className="text-blue-600/80 dark:text-blue-200/80 text-sm">Hackers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-500 font-mono">13</div>
              <div className="text-blue-600/80 dark:text-blue-200/80 text-sm">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-500 font-mono">$10K</div>
              <div className="text-blue-600/80 dark:text-blue-200/80 text-sm">In Prizes</div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 text-center">
            <a href="/register" target="_blank" rel="noopener noreferrer">
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
            </a>

            <a href="https://hcb.hackclub.com/donations/start/codecatalyst">
              <motion.button
                onClick={() => scrollToSection("about")}
                className="bg-transparent hover:bg-blue-500/10 text-blue-700 dark:text-blue-200 px-8 py-3 rounded-md font-semibold min-w-full md:min-w-fit transition-colors border border-blue-500/30 dark:border-blue-400/20"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Donate Now
              </motion.button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
