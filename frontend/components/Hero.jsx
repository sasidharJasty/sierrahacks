import React, { useEffect } from "react";
import { motion } from "framer-motion";
import logo from "../public/logo.png";
import cs from "../public/codestack.jpg";
import { RxArrowBottomRight } from "react-icons/rx";
import ImageCarousel from "./ImageCarousel";


const Hero = () => {

  const slides = [
    {
      url: "/images/IMG_8336.JPG",
      description: "Students work on laptops as a teammate presents a project to the room.",
    },
    {
      url: "/images/IMG_8511.JPG",
      description: "Students present an AI robot project on a classroom display.",
    },
    {
      url: "/images/IMG_8524.JPG",
      description: "A student presents a project about challenges in coding education.",
    },
    {
      url: "/images/IMG_8388.JPG",
      description: "A mentor points at a laptop while helping a student debug a project.",
    },
    {
      url: "/images/IMG_8400.JPG",
      description: "Students collaborate around tables with laptops during the hackathon.",
    },
    {
      url: "/images/IMG_8433.JPG",
      description: "Teammates gather around laptops and an electronics kit while building.",
    },
    {
      url: "/images/IMG_8434.JPG",
      description: "Two students work together on laptops at a shared table.",
    },
    {
      url: "/images/IMG_8435.JPG",
      description: "A team gathers around a laptop and hardware prototype during a demo.",
    },
    {
      url: "/images/IMG_8451.JPG",
      description: "Students explain their GlobalBridge project to an audience.",
    },

    {
      url: "/images/IMG_8479.JPG",
      description: "A team demonstrates a hardware project while others gather around to watch.",
    },
    {
      url: "/images/IMG_8483.JPG",
      description: "Two presenters walk through the GlobalBridge project on a large display.",
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
    <div id="home" className="relative md:min-h-screen min-h-[120vh] bg-black/70 flex items-center justify-center overflow-hidden">
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
      <div className="container mx-auto px-4 -mt-20 relative z-10 md:text-left text-center max-w-8xl flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Logo icon */}
          <div className="w-32 h-32 shadow-blue-500/10 dark:shadow-blue-500/5 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-xl mt-25 mb-[-10] hidden md:block">
            <img src={logo}  alt="SierraHacks logo" />
          </div>

          {/* Event name */}
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-300 dark:to-blue-100 md:mt-0  mt-[0vh] ">
            Sierra<span className="text-blue-500">Hacks</span> 2026
          </h1>

          {/* Date and location */}
                <h2 className="text-xl md:text-2xl text-blue-700 dark:text-white font-light flex md:justify-start justify-center items-center space-x-2 md:text-left text:center">
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
          <div className="flex md:justify-start justify-center gap-10 lg:gap-16">
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
          <div className="w-full flex flex-col items-center gap-4 pt-4 text-center sm:flex-row sm:justify-center md:items-start md:justify-start md:text-left">
            <a className="w-full sm:w-auto" href="https://luma.com/7y8mmyo1?lm_source=sierrahacks-website" target="_blank" rel="noopener noreferrer">
              <motion.button
                onClick={() => scrollToSection("register")}
                className="group flex w-full items-center justify-center rounded-md bg-[#0E43B6] px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-colors hover:bg-[#0E43B6] dark:shadow-blue-900/20 md:w-auto"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Register Now</span>
                <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
            </a>

            <a className="w-full sm:w-auto" href="https://hcb.hackclub.com/donations/start/codecatalyst">
              <motion.button
                onClick={() => scrollToSection("about")}
                className="w-full cursor-pointer rounded-md border border-blue-500/30 bg-[#0E43B6] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#0E43B6] dark:border-blue-400/20 dark:bg-blue-400 md:w-auto"
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
