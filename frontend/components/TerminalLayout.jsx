import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TerminalLayout = ({ children }) => {
  const [activeSection, setActiveSection] = useState("home");
  // previous command/input state removed (unused in current layout)

  const sections = [
    { id: "home", label: "Home" },
    { id: "faq", label: "FAQ" },
    { id: "timeline", label: "Timeline" },
    { id: "criteria", label: "Criteria" },
    { id: "judges", label: "Judges" },
    { id: "team", label: "Team" }
  ];

  // command handling removed to simplify the layout and avoid unused vars

  // keyboard handling for terminal input was removed (unused) to satisfy lint

  // Global key handler
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Check if user is typing in an input field
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }
      
      // Handle special key commands here
      if (e.key === "/" || e.key === ">") {
        e.preventDefault();
        document.getElementById("terminal-input")?.focus();
      }
    };
    
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-blue-100 flex flex-col">
      {/* Terminal top bar */}
      <div className="bg-gray-800 border-b border-blue-500/30 py-2 px-4 flex items-center sticky top-0 z-20 backdrop-blur-sm bg-opacity-80">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
          <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4 text-sm font-mono text-blue-300/70">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`px-3 py-1 rounded ${activeSection === section.id ? 'bg-blue-900/40 text-blue-300' : 'hover:bg-blue-900/20'}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.id}
            </button>
          ))}
        </div>
        
        <div className="flex-grow text-center hidden sm:block">
          <div className="inline-flex items-center px-3 py-1 bg-blue-900/20 rounded-full border border-blue-500/20 text-xs font-mono text-blue-300/80">
            <span className="mr-2 text-green-400">$</span>
            sierra-hacks:~
          </div>
        </div>
        
        <div className="flex items-center ml-auto">
          <div className="text-xs font-mono text-blue-300/50 mr-2 hidden sm:block">
            Press / to focus
          </div>
          <a 
            href="#register" 
            className="px-3 py-1 bg-blue-600 text-white font-mono text-xs rounded hover:bg-blue-700 transition-colors"
          >
            Register Now
          </a>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Terminal footer with command input */}
      
    </div>
  );
};

export default TerminalLayout;