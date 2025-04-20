import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TerminalLayout = ({ children }) => {
  const [activeSection, setActiveSection] = useState("home");
  const [commandHistory, setCommandHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);

  const sections = [
    { id: "home", label: "Home" },
    { id: "faq", label: "FAQ" },
    { id: "timeline", label: "Timeline" },
    { id: "criteria", label: "Criteria" },
    { id: "judges", label: "Judges" },
    { id: "team", label: "Team" }
  ];

  const handleCommand = (cmd) => {
    // Add command to history
    setCommandHistory(prev => [...prev, { cmd, output: processCommand(cmd) }]);
    setInputValue("");
    setHistoryIndex(-1);
  };

  const processCommand = (cmd) => {
    const command = cmd.toLowerCase().trim();
    
    if (command === "clear" || command === "cls") {
      setCommandHistory([]);
      return null;
    }
    
    if (command === "help") {
      return (
        <div className="text-blue-200 mt-2 mb-4">
          <div className="font-bold mb-2">Available commands:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div><span className="text-green-400">home</span> - Go to homepage</div>
            <div><span className="text-green-400">faq</span> - View FAQ section</div>
            <div><span className="text-green-400">timeline</span> - See event schedule</div>
            <div><span className="text-green-400">criteria</span> - View judging criteria</div>
            <div><span className="text-green-400">judges</span> - Meet our judges</div>
            <div><span className="text-green-400">team</span> - See the organizing team</div>
            <div><span className="text-green-400">clear</span> - Clear command history</div>
            <div><span className="text-green-400">help</span> - Show this help menu</div>
          </div>
        </div>
      );
    }
    
    if (sections.some(section => section.id === command)) {
      setActiveSection(command);
      return `Navigating to ${command}...`;
    }
    
    return `Command not found: ${command}. Type 'help' for available commands.`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        handleCommand(inputValue);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex]?.cmd || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex]?.cmd || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue("");
      }
    }
  };

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