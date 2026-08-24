import React, { useEffect } from "react";
import { motion } from "framer-motion";
import logo from "../public/logo.png";
import cs from "../public/codestack.jpg";
import { RxArrowBottomRight } from "react-icons/rx";
import ImageCarousel from "./ImageCarousel";


const Hero = () => {

  const slides = [
    {
      url: "https://picsum.photos/400",
      description: "Ideas begin as a blank canvas and a room full of curious people.",
    },
    {
      url: "https://picsum.photos/400?random=1",
      description: "Late-night building, bright screens, and one more feature to ship.",
    },
    {
      url: "https://picsum.photos/400?random=2",
      description: "A little bit of chaos makes the best collaborations memorable.",
    },
    {
      url: "https://picsum.photos/400?random=3",
      description: "The finished project is only part of the story. The people are the rest.",
    },

  ];
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
      if (mode === "dark" || mode === "light") {
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
    <div id="home" className="relative min-h-screen bg-black/70 flex items-center justify-center overflow-hidden">
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
        {/*<motion.a
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
        </motion.a>*/}

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
      <div className="container mx-auto px-4 -mt-20 relative z-10 text-left max-w-8xl flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Logo icon */}
          <div className="w-32 h-32 shadow-blue-500/10 dark:shadow-blue-500/5 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-xl mt-25 mb-[-10]">
            <img src={logo}  alt="SierraHacks logo" />
          </div>

          {/* Event name */}
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-300 dark:to-blue-100">
            Sierra<span className="text-blue-500">Hacks</span> 2026
          </h1>

          {/* Date and location */}
                <h2 className="text-xl md:text-2xl text-blue-700 dark:text-white font-light flex justify-start items-center space-x-2 text-left">
                <span>Oct 24, 2026 •</span>
                <a
                  href="https://www.google.com/maps/place/Sierra+High+School/@37.7925198,-121.2458948,1539m/data=!3m2!1e3!4b1!4m6!3m5!1s0x809040691efd4429:0xbaa4e817e5d16dcf!8m2!3d37.7925198!4d-121.2433199!16s%2Fm%2F04cw651?entry=ttu&g_ep=EgoyMDI1MTEwNS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline inline-flex items-center space-x-1"
                >
                  <RxArrowBottomRight />
                  <span>Sierra High School</span>
                </a>
                </h2>

                {/* Brief description */}
          <p className="text-lg md:text-xl text-blue-800/90 dark:text-blue-100/80 max-w-2xl">
            A 12-hour coding marathon where innovation meets collaboration!
            <span className="text-blue-600 dark:text-blue-500 animate-pulse ml-1">_</span>
          </p>

          {/* Key stats */}
          <div className="flex justify-start gap-10 lg:gap-16">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-500 font-mono">175+</div>
              <div className="text-blue-600/80 dark:text-blue-200/80 text-sm">Hackers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-500 font-mono">12</div>
              <div className="text-blue-600/80 dark:text-blue-200/80 text-sm">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-500 font-mono">$10K</div>
              <div className="text-blue-600/80 dark:text-blue-200/80 text-sm">In Prizes</div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="w-full flex flex-col sm:flex-row justify-start items-start gap-4 pt-4 text-left">
            <a href="/register" target="_blank" rel="noopener noreferrer">
              <motion.button
                onClick={() => scrollToSection("register")}
                className="bg-[#0E43B6] cursor-pointer hover:bg-[#0E43B6] text-white px-8 py-3 rounded-md font-semibold transition-colors group flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-blue-900/20"
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
                className="cursor-pointer bg-[#0E43B6] dark:bg-blue-400 hover:bg-[#0E43B6] text-white px-8 py-3 rounded-md font-semibold min-w-full md:min-w-fit transition-colors border border-blue-500/30 dark:border-blue-400/20"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Donate Now
              </motion.button>
            </a>
          </div>
        </motion.div>
        <div className="flex item-center justify-center transform  w-[400px] h-[300px]">
        <ImageCarousel images={slides} autoSlide={true} autoSlideInterval={4000} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
