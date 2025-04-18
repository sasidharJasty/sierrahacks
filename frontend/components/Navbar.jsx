import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  
  // Handle scroll effect for navbar background and section highlighting
  useEffect(() => {
    const handleScroll = () => {
      // Navbar background change on scroll
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Section highlighting logic
      const sections = ["home", "about", "schedule", "sponsors", "faq", "register"];
      const link = ["#home", "#about", "#schedule", "#sponsors", "#faq", "#register"];
      
      // Find the section closest to the top of the viewport
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // When the section is in view (allowing some buffer at the top)
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Navigation items with their respective sections
  const navItems = [
    { name: "Home", id: "home", delay: 0.05 },
    { name: "About", id: "about", delay: 0.1 },
    { name: "Schedule", id: "schedule", delay: 0.2 },
    { name: "Sponsors", id: "sponsors", delay: 0.3 },
    { name: "FAQ", id: "faq", delay: 0.4 }
  ];
  
  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Close mobile menu if open
      if (isOpen) setIsOpen(false);
      
      // Smooth scroll to section
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  
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
          onClick={() => scrollToSection("home")}
          href="#home"
          className="text-xl font-bold flex items-center cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
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
          {navItems.map((item) => (
            <motion.a
              key={item.id}
              href={`#${item.id}`}
              
              className={`relative group cursor-pointer transition-colors duration-300 ${
                activeSection === item.id 
                  ? "text-white font-medium" 
                  : "text-blue-200 hover:text-white"
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay, duration: 0.3 }}
            >
              {item.name}
              <span 
                className={`absolute -bottom-1 left-0 h-[2px] bg-blue-400 transition-all duration-300 ${
                  activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </motion.a>
          ))}
          
          <motion.div
            onClick={() => scrollToSection("register")}
            className={`px-5 py-2 text-white rounded-md hover:shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer relative overflow-hidden group ${
              activeSection === "register"
                ? "bg-blue-700"
                : "bg-gradient-to-r from-blue-600 to-blue-500"
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
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
          </motion.div>
        </div>
        
        {/* Mobile Menu Button */}
        <motion.button 
          className="block md:hidden text-blue-200"
          onClick={() => setIsOpen(!isOpen)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
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
              {navItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`py-4 px-6 hover:text-white transition-all cursor-pointer ${
                    activeSection === item.id
                      ? "text-white border-l-2 border-blue-400 bg-blue-900/40"
                      : "text-blue-200 border-l-2 border-transparent hover:border-blue-400 hover:bg-blue-900/30"
                  }`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                >
                  {item.name}
                </motion.div>
              ))}
              <motion.div
                onClick={() => scrollToSection("register")}
                className={`m-6 py-3 px-6 text-white font-medium rounded-md text-center hover:shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer ${
                  activeSection === "register"
                    ? "bg-blue-700"
                    : "bg-gradient-to-r from-blue-600 to-blue-500"
                }`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.2 }}
              >
                Register Now
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;