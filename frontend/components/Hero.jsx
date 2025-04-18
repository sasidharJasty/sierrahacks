import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  // Terminal state management
  const [cursorVisible, setCursorVisible] = useState(true);
  const [terminalUptime, setTerminalUptime] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [typingComplete, setTypingComplete] = useState(false);
  const [terminalBooted, setTerminalBooted] = useState(false);
  const [bootMessages, setBootMessages] = useState([]);
  const [showBackground, setShowBackground] = useState(false);
  const [showGlowEffect, setShowGlowEffect] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Terminal boot sequence
  useEffect(() => {
    // Shorter boot sequence on mobile for better UX
    const bootSequence = [
      { message: "Initializing kernel...", delay: isMobile ? 200 : 300 },
      { message: "Loading system modules... ", delay: isMobile ? 250 : 400 },
      { message: "Starting SierraOS v2.5.0...", delay: isMobile ? 300 : 600 },
      { message: "Retrieving hackathon data... [COMPLETE]", delay: isMobile ? 400 : 800 },
      { message: "Welcome to SierraHacks Terminal", delay: isMobile ? 450 : 900 },
    ];

    let timer = 0;

    bootSequence.forEach((item, index) => {
      timer += item.delay;
      setTimeout(() => {
        setBootMessages((prev) => [...prev, item.message]);
        if (index === bootSequence.length - 1) {
          setTimeout(() => {
            setTerminalBooted(true);
            setTypingComplete(true);

            // Show background elements after boot complete
            setTimeout(() => {
              setShowBackground(true);
              setTimeout(() => {
                setShowGlowEffect(true);
                // Show scroll indicator after all animations are complete
                setTimeout(() => setShowScrollIndicator(true), 500);
              }, 500);
            }, 300);
          }, isMobile ? 300 : 500); // Faster boot completion on mobile
        }
      }, timer);
    });

    return () => clearTimeout(timer);
  }, [isMobile]);

  // Terminal effects
  useEffect(() => {
    // Blinking cursor
    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);

    // Uptime counter (increases every second)
    const uptimeInterval = setInterval(() => {
      setTerminalUptime((prev) => prev + 1);
    }, 1000);

    // Auto focus the input field when terminal is booted
    if (terminalBooted && inputRef.current) {
      inputRef.current.focus();
    }

    return () => {
      clearInterval(cursorInterval);
      clearInterval(uptimeInterval);
    };
  }, [terminalBooted]);

  // Focus terminal input when clicking anywhere in terminal
  useEffect(() => {
    const handleTerminalClick = () => {
      if (inputRef.current && terminalBooted) {
        inputRef.current.focus();
      }
    };

    if (terminalRef.current) {
      terminalRef.current.addEventListener("click", handleTerminalClick);
    }

    return () => {
      if (terminalRef.current) {
        terminalRef.current.removeEventListener("click", handleTerminalClick);
      }
    };
  }, [terminalBooted]);

  // Format terminal uptime in seconds
  const formatUptime = (seconds) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  };

  // Scroll to next section
  const scrollToNextSection = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Process user commands
  const processCommand = (cmd) => {
    const command = cmd.toLowerCase().trim();

    switch (command) {
      case "about":
        return renderAboutSection();

      case "help":
        return (
          <div className="mt-2 mb-4">
            <div className="mb-2 text-blue-300 font-semibold">
              Available commands:
            </div>
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-2 sm:col-span-1 text-green-400">
                about
              </span>
              <span className="col-span-10 sm:col-span-11 text-blue-200">
                Learn about SierraHacks
              </span>

              <span className="col-span-2 sm:col-span-1 text-green-400">
                info
              </span>
              <span className="col-span-10 sm:col-span-11 text-blue-200">
                Event information
              </span>

              <span className="col-span-2 sm:col-span-1 text-green-400">
                stats
              </span>
              <span className="col-span-10 sm:col-span-11 text-blue-200">
                View hackathon statistics
              </span>

              <span className="col-span-2 sm:col-span-1 text-green-400">
                date
              </span>
              <span className="col-span-10 sm:col-span-11 text-blue-200">
                Show event date
              </span>

              <span className="col-span-2 sm:col-span-1 text-green-400">
                register
              </span>
              <span className="col-span-10 sm:col-span-11 text-blue-200">
                Sign up for SierraHacks
              </span>

              <span className="col-span-2 sm:col-span-1 text-green-400">
                clear
              </span>
              <span className="col-span-10 sm:col-span-11 text-blue-200">
                Clear terminal screen
              </span>
            </div>
          </div>
        );

      case "clear":
        setCommandHistory([]);
        return null;

      case "info":
        return (
          <div className="mt-2 mb-4 bg-blue-900/10 p-3 border border-blue-500/20 rounded">
            <div className="text-blue-300 font-semibold mb-2">
              SierraHacks 2025
            </div>
            <div className="text-blue-100">
              <div className="grid grid-cols-12 gap-2 mb-1">
                <span className="col-span-3 sm:col-span-2 text-green-400">Date:</span>
                <span className="col-span-9 sm:col-span-10">May 17-19, 2025</span>
              </div>
              <div className="grid grid-cols-12 gap-2 mb-1">
                <span className="col-span-3 sm:col-span-2 text-green-400">Location:</span>
                <span className="col-span-9 sm:col-span-10">
                  Sierra Nevada Mountains Conference Center
                </span>
              </div>
              <div className="grid grid-cols-12 gap-2 mb-1">
                <span className="col-span-3 sm:col-span-2 text-green-400">Theme:</span>
                <span className="col-span-9 sm:col-span-10">
                  Where code meets the mountains
                </span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-3 sm:col-span-2 text-green-400">Website:</span>
                <span className="col-span-9 sm:col-span-10 text-blue-300 underline">
                  sierrahacks.com
                </span>
              </div>
            </div>
          </div>
        );

      case "stats":
        return (
          <div className="mt-2 mb-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "500+", label: "Hackers", icon: "👩‍💻" },
                { value: "48", label: "Hours", icon: "⏱️" },
                { value: "24", label: "Workshops", icon: "🧠" },
                { value: "$10K", label: "in Prizes", icon: "🏆" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-blue-900/10 p-3 rounded border border-blue-500/20 flex flex-col items-center"
                >
                  <div className="text-lg mb-1">{stat.icon}</div>
                  <div className="text-xl font-bold text-green-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-blue-300 text-xs font-mono">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "date":
        return (
          <div className="mt-2 mb-4 text-yellow-300 font-mono">
            $ date
            <br />
            Sat May 17 00:00:00 PDT 2025 - Mon May 19 23:59:59 PDT 2025
          </div>
        );

      case "register":
        return (
          <div className="mt-2 mb-4">
            <div className="text-green-400 mb-2">
              Registration process started...
            </div>
            <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
              <div className="mb-3 text-blue-200">
                Enter your details to register for SierraHacks 2025:
              </div>
              <a
                href="#register"
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded font-mono text-sm mt-2"
              >
                Complete Registration →
              </a>
            </div>
          </div>
        );

      default:
        return `Command not found: ${cmd}. Type 'help' for available commands.`;
    }
  };

  // Handle command submission
  const handleCommandSubmit = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const newCommand = {
      input: inputValue,
      output: processCommand(inputValue),
    };

    setCommandHistory((prev) => [...prev, newCommand]);
    setInputValue("");

    // Auto-scroll to bottom after command execution
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 100);
  };

  // Render about section
  const renderAboutSection = () => (
    <div className="mt-2 mb-4">
      <div className="text-blue-300 font-semibold mb-2">About SierraHacks:</div>
      <p className="text-blue-100 mb-3">
        SierraHacks is a 48-hour hackathon bringing together 500+ innovators,
        creators, and problem-solvers. Our mission is to foster collaboration
        and creativity to build solutions that shape tomorrow.
      </p>
      <p className="text-blue-200/80 mb-3">
        Join us for a weekend of innovation, collaboration, and creativity in
        the heart of Sierra Nevada. Hack with a view that inspires breakthrough
        solutions.
      </p>
      <div className="bg-blue-900/20 p-3 rounded border-l-2 border-blue-500 text-sm">
        <div className="text-blue-300 mb-1">
          The perfect blend of technology and nature.
        </div>
        <div className="text-blue-200/80 italic">Where code meets the mountains.</div>
      </div>
    </div>
  );

  return (
    <div id="home" className="relative w-full h-screen overflow-hidden bg-gray-900">
      {/* Mountain silhouette backdrop */}
      <AnimatePresence>
        {showBackground && (
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <div className="absolute bottom-0 w-full h-[40%] bg-gradient-to-t from-blue-900/20 via-transparent to-transparent" />
            <div className="absolute bottom-0 w-full">
              <svg
                viewBox="0 0 1200 300"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <path
                  d="M0,300 L0,180 L100,220 L200,150 L300,190 L400,120 L500,170 L600,100 L700,180 L800,130 L900,160 L1000,110 L1100,190 L1200,140 L1200,300 Z"
                  fill="rgba(30, 58, 138, 0.3)"
                />
                <path
                  d="M0,300 L0,200 L150,250 L250,180 L350,230 L450,160 L550,210 L650,140 L750,230 L850,160 L950,200 L1050,150 L1150,220 L1200,180 L1200,300 Z"
                  fill="rgba(30, 58, 138, 0.2)"
                />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal dot matrix background - reduced opacity on mobile */}
      <div className="absolute inset-0 z-0 opacity-5 md:opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>

      {/* Terminal-like scanlines overlay - reduced on mobile */}
      <div className="absolute inset-0 z-0 opacity-5 md:opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9InNjYW5saW5lcyIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMiIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDAsIDAsIDApIj4KICAgICAgPGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iMTAwJSIgeTI9IjAiIHN0eWxlPSJzdHJva2U6IHJnYmEoMjU1LDI1NSwyNTUsMC4wNSk7IHN0cm9rZS13aWR0aDogMXB4OyIgLz4KICAgIDwvcGF0dGVyblRyYW5zZm9ybT4KICA8L2RlZnM+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzY2FubGluZXMpIiAvPgo8L3N2Zz4=')]"></div>

      {/* Terminal-styled gradient overlay - optimized for mobile */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-gray-900/95 to-gray-900/95 md:from-blue-900/80 md:via-gray-900/90 md:to-gray-900/95 z-0"></div>

      {/* Terminal dot matrix background - fewer particles on mobile */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.07 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute inset-0 backdrop-blur-[50px] md:backdrop-blur-[100px]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="terminal-grid"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="3" cy="3" r="1" fill="rgba(56, 189, 248, 0.3)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#terminal-grid)" />
          </svg>
        </div>
      </motion.div>

      {/* Animated particles - fewer on mobile */}
      <AnimatePresence>
        {showBackground && (
          <>
            {[...Array(isMobile ? 5 : 15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-blue-400"
                initial={{
                  opacity: 0,
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0,
                }}
                animate={{
                  opacity: [0, 0.3, 0.1],
                  scale: [0, 1, 0.8],
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                transition={{
                  duration: 7 + Math.random() * 10,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                style={{
                  width: Math.random() * 6 + 2,
                  height: Math.random() * 6 + 2,
                  filter: "blur(1px)",
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Terminal glow effect - subtle on mobile */}
      <AnimatePresence>
        {showGlowEffect && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[90%] max-w-4xl h-[60vh] md:h-[70vh] rounded-full z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              background:
                "radial-gradient(circle, rgba(56,189,248,0.05) 0%, rgba(29,78,216,0.02) 50%, rgba(0,0,0,0) 70%)",
              filter: "blur(15px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Fixed SierraHacks title - only on mobile */}
      <div className="absolute top-0 left-0 w-full z-30 bg-gradient-to-b from-gray-900 via-gray-900/95 to-transparent py-4 px-6 md:hidden">
        <div className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400 bg-clip-text text-transparent">
            SierraHacks
          </div>
          <div className="text-xs bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-blue-400">
            May 17-19, 2025
          </div>
        </div>
      </div>

      {/* Mobile Quick Action Buttons - visible at top on small screens */}
      <div className="absolute top-16 right-4 z-30 flex flex-col gap-2 md:hidden">
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.3 }}
          className="bg-blue-600/40 hover:bg-blue-600/60 text-white text-xs px-3 py-2 rounded-full border border-blue-400/30 flex items-center shadow-lg shadow-blue-900/20"
          onClick={() => {
            setInputValue("register");
            handleCommandSubmit({ preventDefault: () => {} });
          }}
        >
          <span className="mr-1.5">Register</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6, duration: 0.3 }}
          className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-100 text-xs px-3 py-2 rounded-full border border-blue-400/20 flex items-center shadow-lg shadow-blue-900/10"
          onClick={() => {
            setInputValue("help");
            handleCommandSubmit({ preventDefault: () => {} });
          }}
        >
          <span className="mr-1.5">Help</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.button>
      </div>

      {/* Terminal window frame - simplified for mobile */}
      <div className="container mx-auto h-full sm:h-[90%] flex items-center justify-center px-2 sm:px-4 z-10 relative pt-14 sm:pt-0">
        <div className="w-full max-w-4xl relative z-10">
          {/* Terminal window frame border */}
          <div className="absolute inset-0 border border-blue-500/20 rounded-lg pointer-events-none shadow-[inset_0_0_30px_rgba(56,189,248,0.1)]"></div>

          {/* Terminal window header bar - smaller on mobile */}
          <div className="h-8 sm:h-10 border-b border-blue-500/20 bg-gray-900/60 backdrop-blur-sm flex items-center px-3 sm:px-4 rounded-t-lg">
            {/* Terminal controls */}
            <div className="flex space-x-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400/70 relative group">
                <span className="absolute opacity-0 group-hover:opacity-100 text-[10px] text-white -top-5 whitespace-nowrap font-mono hidden sm:block">
                  kill -9
                </span>
              </div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400/70 relative group">
                <span className="absolute opacity-0 group-hover:opacity-100 text-[10px] text-white -top-5 whitespace-nowrap font-mono hidden sm:block">
                  kill -STOP
                </span>
              </div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400/70 relative group">
                <span className="absolute opacity-0 group-hover:opacity-100 text-[10px] text-white -top-5 whitespace-nowrap font-mono hidden sm:block">
                  ./execute
                </span>
              </div>
            </div>

            {/* Terminal title - simplified for mobile */}
            <div className="flex-1 text-center flex items-center justify-center">
              <div className="flex items-center bg-blue-900/20 px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-mono space-x-1">
                <svg
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 10h-4v4h4v-4z" />
                  <rect x="2" y="14" width="4" height="4" />
                  <rect x="10" y="2" width="4" height="4" />
                  <line x1="4" y1="14" x2="4" y2="2" />
                  <line x1="4" y1="2" x2="10" y2="2" />
                  <line x1="14" y1="4" x2="14" y2="10" />
                  <line x1="14" y1="14" x2="14" y2="22" />
                  <line x1="4" y1="18" x2="4" y2="22" />
                  <line x1="4" y1="22" x2="14" y2="22" />
                </svg>
                <span className="text-green-400">ssh://</span>
                <span className="text-blue-300/50">hacker@sierrahacks</span>
                <span className="text-gray-400 ml-1 bg-blue-900/30 px-1 py-0.5 rounded text-[8px] sm:text-[10px] hidden xs:inline-block">
                  CONNECTED
                </span>
              </div>
            </div>
          </div>

          {/* Terminal content - adjusted height for mobile */}
          <div
            ref={terminalRef}
            className="h-[calc(100vh-12rem)] sm:h-[calc(100vh-14rem)] md:h-[calc(92vh-12rem)] overflow-y-auto bg-gray-900/70 backdrop-blur-sm p-3 sm:p-4 font-mono text-xs sm:text-sm text-blue-100 border-x border-blue-500/20"
          >
            {/* Boot sequence - visible until terminal is booted */}
            {!terminalBooted && (
              <div>
                {bootMessages.map((message, idx) => (
                  <div key={idx} className="text-blue-300">
                    {message}
                  </div>
                ))}
                <div className="inline-flex text-green-400">
                  ${" "}
                  <div
                    className={`w-1.5 sm:w-2 ml-1 h-3.5 sm:h-4 bg-green-400 ${
                      cursorVisible ? "opacity-100" : "opacity-0"
                    }`}
                  ></div>
                </div>
              </div>
            )}

            {/* Terminal welcome splash - mobile optimized */}
            {terminalBooted && commandHistory.length === 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="text-center mb-4 mt-2"
                >
                  {/* Logo - mobile friendly version */}
                  <div className="md:hidden text-xl font-bold text-blue-400 flex justify-center items-center">
                    <svg className="w-5 h-5 mr-1.5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1-2a3 3 0 00-3 3v6a3 3 0 003 3h12a3 3 0 003-3V5a3 3 0 00-3-3H4z" clipRule="evenodd" />
                      <path d="M4 8h1v2H4V8zm3 0h1v2H7V8zm3 0h1v2h-1V8zm3 0h1v2h-1V8z" />
                    </svg>
                    Sierra<span className="text-blue-300">Hacks</span>
                  </div>

                  {/* ASCII art logo - hidden on small screens */}
                  <pre className="hidden md:inline-block text-blue-400 text-xs sm:text-sm md:text-base leading-tight text-left">
                    {`  ____  _                      _   _            _        
 / ___|(_) ___ _ __ _ __ __ _| | | | __ _  ___| | _____ 
 \\___ \\| |/ _ \\ '__| '__/ _\` | |_| |/ _\` |/ __| |/ / __|
  ___) | |  __/ |  | | | (_| |  _  | (_| | (__|   <\\__ \\
 |____/|_|\\___|_|  |_|  \\__,_|_| |_|\\__,_|\\___|_|\\_\\___/
                                                        `}
                  </pre>

                  <div className="text-base sm:text-lg sm:mt-2 md:mt-4 bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400 bg-clip-text text-transparent font-bold">
                    Build. Break. Breakthrough.
                  </div>
                  <div className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-blue-400 mt-1 text-xs sm:text-sm">
                    May 17-19, 2025
                  </div>
                </motion.div>

                {/* Mobile optimized info card */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mb-3 max-w-2xl mx-auto"
                >
                  <div className="flex flex-col border border-blue-500/30 rounded-lg overflow-hidden shadow-lg">
                    <div className="bg-blue-900/20 p-1.5 sm:p-2 border-b border-blue-500/20 flex items-center">
                      <svg
                        className="w-3.5 h-3.5 text-blue-400 mr-1.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-blue-300 text-xs">
                        Terminal Ready
                      </span>
                    </div>
                    <div className="p-3 bg-gray-900/50 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-gray-900/0"></div>
                      <div className="relative z-10">
                        <p className="mb-2 text-xs sm:text-sm text-blue-100">
                          <span className="text-green-400 font-bold">
                            SierraHacks 2025
                          </span>
                          : The ultimate hackathon experience in the Sierra Nevada mountains.
                        </p>

                        {/* Quick action buttons for mobile */}
                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
                          {["register", "info", "stats"].map((cmd, i) => (
                            <motion.button
                              key={cmd}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7 + i * 0.1 }}
                              className="bg-blue-900/20 hover:bg-blue-900/30 text-blue-200 text-xs py-1.5 px-2 rounded border border-blue-500/20 transition-colors"
                              onClick={() => {
                                setInputValue(cmd);
                                handleCommandSubmit({ preventDefault: () => {} });
                              }}
                            >
                              <span className="text-green-400 mr-1">$</span>
                              {cmd}
                            </motion.button>
                          ))}
                        </div>

                        <div className="mt-2 text-xs text-blue-200/70">
                          <span className="text-green-400">$</span>
                          <span className="ml-1">Type</span>
                          <code className="bg-blue-900/30 px-1.5 py-0.5 rounded mx-1 text-yellow-200">
                            help
                          </code>
                          <span>for more commands</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Stats - Mobile optimized */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="mb-3 grid grid-cols-2 gap-2 max-w-4xl mx-auto"
                >
                  {[
                    { value: "500+", label: "Hackers", icon: "👩‍💻" },
                    { value: "48", label: "Hours", icon: "⏱️" },
                    { value: "24", label: "Workshops", icon: "🧠" },
                    { value: "$10K", label: "in Prizes", icon: "🏆" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="flex p-2 border border-blue-500/20 rounded-lg bg-blue-900/10 backdrop-blur-sm items-center"
                    >
                      <div className="text-xl mr-2">{stat.icon}</div>
                      <div>
                        <div className="text-base font-bold text-green-400">{stat.value}</div>
                        <div className="text-blue-300 text-[10px]">{stat.label}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Quick input field for mobile */}
                <motion.form
                  onSubmit={handleCommandSubmit}
                  className="flex items-center mt-3 px-1 py-2 rounded-full border border-blue-500/30 bg-blue-900/20 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <span className="text-green-400 font-bold mx-2">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-grow bg-transparent border-none outline-none text-blue-100 font-mono text-xs"
                    placeholder="Type a command..."
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 bg-blue-800/30 hover:bg-blue-800/50 rounded-full mr-1 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7" />
                    </svg>
                  </button>
                </motion.form>
              </>
            )}

            {/* Command history - optimized for mobile */}
            {commandHistory.map((cmd, i) => (
              <div key={i} className="mb-3">
                <div className="flex items-center">
                  <span className="text-green-400 font-bold mr-1.5 sm:mr-2">$</span>
                  <span className="text-blue-100">{cmd.input}</span>
                </div>
                <div className="pl-3 sm:pl-4 mt-1">
                  {typeof cmd.output === "string" ? (
                    <div
                      className={
                        cmd.output.startsWith("Command not found")
                          ? "text-red-400"
                          : "text-blue-300"
                      }
                    >
                      {cmd.output}
                    </div>
                  ) : (
                    cmd.output
                  )}
                </div>
              </div>
            ))}

            {/* Current command input - visible after boot */}
            {terminalBooted && commandHistory.length > 0 && (
              <form onSubmit={handleCommandSubmit} className="flex items-center">
                <span className="text-green-400 font-bold mr-1.5 sm:mr-2">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-grow bg-transparent border-none outline-none text-blue-100 font-mono"
                  autoComplete="off"
                  spellCheck="false"
                />
                <span
                  className={`h-4 sm:h-5 w-2 sm:w-2.5 bg-blue-400 ml-1 ${
                    cursorVisible ? "opacity-100" : "opacity-0"
                  }`}
                ></span>
              </form>
            )}
          </div>

          {/* Terminal window footer/status bar - simplified for mobile */}
          <div className="h-5 sm:h-6 border-t border-blue-500/20 bg-gray-900/50 backdrop-blur-sm flex items-center text-[10px] sm:text-xs font-mono px-2 sm:px-3 rounded-b-lg text-blue-300/50">
            <div className="flex items-center">
              <svg
                className="w-2.5 h-2.5 text-green-500 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="hidden xs:inline mr-1">Uptime:</span>
              {formatUptime(terminalUptime)}
            </div>
            <div className="flex-1 text-right">
              <span className="bg-blue-900/20 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px]">
                <span className="text-green-400">●</span>
                <span className="hidden xs:inline">Sierra</span>OS v2.5
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile action buttons at bottom */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 flex justify-center gap-2 md:hidden">
        <motion.button
          className="bg-blue-600/30 text-blue-100 border border-blue-500/30 px-2.5 py-1.5 rounded-full text-xs font-mono flex items-center shadow-lg shadow-blue-900/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          onClick={scrollToNextSection}
        >
          <span className="mr-1.5">Explore</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.button>
      </div>

      {/* Enhanced mobile scroll indicator */}
      <AnimatePresence>
        {showScrollIndicator && (
          <motion.div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer"
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              y: [0, 5, 0],
            }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            onClick={scrollToNextSection}
          >
            <div className="flex flex-col items-center">
              <div className="text-[10px] sm:text-xs text-blue-300/80 font-mono tracking-wide mb-1">
                Scroll Down
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-900/30 border border-blue-500/20 shadow-lg shadow-blue-900/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;