import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <nav 
      className={`fixed top-0 left-0 w-full py-5 px-6 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-gray-900/80 backdrop-blur-lg border-b border-blue-900/30 shadow-lg shadow-blue-900/10" 
          : "bg-transparent border-b border-blue-900/10"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.a 
          href="/" 
          className="text-xl font-bold flex items-center cursor-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          data-cursor-text="navigate('home')"
          data-cursor-color="#38bdf8"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-100">
            Sierra
          </span>
          <span className="text-blue-400">Hacks</span>
          <motion.span 
            className="ml-1 h-2 w-2 rounded-full bg-blue-400 hidden sm:block"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            { name: "About", delay: 0.1 },
            { name: "Schedule", delay: 0.2 },
            { name: "Sponsors", delay: 0.3 },
            { name: "FAQ", delay: 0.4 }
          ].map((item) => (
            <motion.a
              key={item.name}
              href={`#${item.name.toLowerCase()}`}
              className="text-blue-200 hover:text-white transition-colors relative group cursor-none"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay, duration: 0.3 }}
              data-cursor-text={`navigate('${item.name.toLowerCase()}')`}
              data-cursor-color="#38bdf8"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </motion.a>
          ))}
          
          <motion.a 
            href="#register" 
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md hover:shadow-lg hover:shadow-blue-500/25 transition-all cursor-none relative overflow-hidden group"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            data-cursor-text="register()"
            data-cursor-color="#3b82f6"
          >
            <span className="relative z-10 flex items-center justify-center">
              Register
              <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <motion.span 
              className="absolute inset-0 bg-blue-700 z-0"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            />
          </motion.a>
        </div>
        
        {/* Mobile Menu Button */}
        <motion.button 
          className="block md:hidden text-blue-200 cursor-none"
          onClick={() => setIsOpen(!isOpen)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          data-cursor-text="toggleMenu()"
          data-cursor-color="#38bdf8"
          aria-label="Toggle menu"
        >
          <svg 
            viewBox="0 0 24 24" 
            width="24" 
            height="24" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transition-transform duration-300 ease-in-out"
            style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            {isOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </>
            )}
          </svg>
        </motion.button>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 w-full bg-gray-900/95 backdrop-blur-md border-t border-blue-900/30 shadow-lg shadow-blue-900/10 overflow-hidden"
          >
            <div className="flex flex-col py-2">
              {["About", "Schedule", "Sponsors", "FAQ"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="py-4 px-6 text-blue-200 hover:text-white border-l-2 border-transparent hover:border-blue-400 hover:bg-blue-900/30 transition-all cursor-none"
                  onClick={() => setIsOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  data-cursor-text={`navigate('${item.toLowerCase()}')`}
                  data-cursor-color="#38bdf8"
                >
                  {item}
                </motion.a>
              ))}
              <motion.a 
                href="#register" 
                className="m-6 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-md text-center hover:shadow-lg hover:shadow-blue-500/25 transition-all cursor-none"
                onClick={() => setIsOpen(false)}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                data-cursor-text="register()"
                data-cursor-color="#3b82f6"
              >
                Register Now
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;