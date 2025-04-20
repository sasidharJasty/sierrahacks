import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
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
      const sections = ["home", "about", "timeline", "sponsors", "faq", "criteria", "judges", "team", "register"];
      
      // Find the section closest to the top of the viewport
      let found = false;
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // When the section is in view (allowing some buffer at the top)
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            found = true;
            break;
          }
        }
      }
      
      // If no section was found in view, determine based on scroll position
      if (!found && window.scrollY > 0) {
        let lastVisibleSection = null;
        let lastDistance = Infinity;
        
        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            const distance = Math.abs(rect.top);
            if (distance < lastDistance) {
              lastDistance = distance;
              lastVisibleSection = sectionId;
            }
          }
        }
        
        if (lastVisibleSection) {
          setActiveSection(lastVisibleSection);
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Navigation items with their respective sections
  const navItems = [
    { name: "Home", id: "home", delay: 0.05 },
    { name: "About", id: "about", delay: 0.1 },
    { name: "Timeline", id: "timeline", delay: 0.15 },
    { name: "Criteria", id: "criteria", delay: 0.2 },
    { name: "Judges", id: "judges", delay: 0.25 },
    { name: "Team", id: "team", delay: 0.3 },
    { name: "FAQ", id: "faq", delay: 0.35 }
  ];
  
  // Improved smooth scroll function with fallback
  const scrollToSection = (sectionId) => {
    // Close mobile menu if open
    if (isOpen) setIsOpen(false);
    
    // Try to find the element
    const element = document.getElementById(sectionId);
    
    if (element) {
      // Calculate offset to account for fixed navbar
      const navbarHeight = 80; // Approximate height of navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      
      // Smooth scroll to section with offset
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      // Update active section
      setActiveSection(sectionId);
    } else {
      // Fallback if element not found
      console.warn(`Section with id "${sectionId}" not found`);
      
      // Try again after a short delay (DOM might still be loading)
      setTimeout(() => {
        const retryElement = document.getElementById(sectionId);
        if (retryElement) {
          const navbarHeight = 80;
          const elementPosition = retryElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
          
          setActiveSection(sectionId);
        }
      }, 100);
    }
  };
  
  return (
    <nav 
      className={`fixed top-0 left-0 w-full py-4 px-4 md:px-6 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-sky-200/30 dark:border-blue-900/30 shadow-lg shadow-sky-500/5 dark:shadow-blue-900/10" 
          : "bg-transparent border-b border-sky-200/10 dark:border-blue-900/10"
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
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-sky-500 dark:from-blue-300 dark:to-blue-100">
            Sierra
          </span>
          <span className="text-blue-600 dark:text-blue-400">Hacks</span>
          <motion.span 
            className="ml-1 h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400 hidden sm:block"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.a>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => (
            <motion.a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
              }}
              className={`relative group cursor-pointer transition-colors duration-300 ${
                activeSection === item.id 
                  ? "text-blue-800 dark:text-white font-medium" 
                  : "text-blue-600 dark:text-blue-200 hover:text-blue-800 dark:hover:text-white"
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay, duration: 0.3 }}
            >
              {item.name}
              <span 
                className={`absolute -bottom-1 left-0 h-[2px] bg-blue-500 dark:bg-blue-400 transition-all duration-300 ${
                  activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </motion.a>
          ))}
          
          {/* Theme Toggle Button (Desktop) */}
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors text-blue-700 dark:text-yellow-300 hover:bg-blue-100/50 dark:hover:bg-gray-800/50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </motion.button>
          
          <motion.a
            href="#register"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("register");
            }}
            className={`px-5 py-2 text-white rounded-md hover:shadow-lg transition-all cursor-pointer relative overflow-hidden group ${
              activeSection === "register"
                ? "bg-blue-700 dark:bg-blue-700 hover:shadow-blue-500/25 dark:hover:shadow-blue-500/25"
                : "bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-600 dark:to-blue-500 hover:shadow-blue-500/25 dark:hover:shadow-blue-500/25"
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
              className="absolute inset-0 bg-blue-700 dark:bg-blue-700 z-0"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            />
          </motion.a>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Theme Toggle (Mobile) */}
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors text-blue-700 dark:text-yellow-300 hover:bg-blue-100/50 dark:hover:bg-gray-800/50"
            whileTap={{ scale: 0.95 }}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </motion.button>
          
          {/* Menu Toggle */}
          <motion.button 
            className="text-blue-700 dark:text-blue-200"
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
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-sky-200/30 dark:border-blue-900/30 shadow-lg shadow-sky-500/10 dark:shadow-blue-900/10 overflow-hidden"
          >
            <div className="flex flex-col py-2">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`py-4 px-6 hover:text-blue-800 dark:hover:text-white transition-all cursor-pointer ${
                    activeSection === item.id
                      ? "text-blue-800 dark:text-white border-l-2 border-blue-500 dark:border-blue-400 bg-blue-100/40 dark:bg-blue-900/40"
                      : "text-blue-600 dark:text-blue-200 border-l-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-100/30 dark:hover:bg-blue-900/30"
                  }`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.a
                href="#register"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("register");
                }}
                className={`m-6 py-3 px-6 text-white font-medium rounded-md text-center hover:shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-blue-500/25 transition-all cursor-pointer ${
                  activeSection === "register"
                    ? "bg-blue-700 dark:bg-blue-700"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-600 dark:to-blue-500"
                }`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.2 }}
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