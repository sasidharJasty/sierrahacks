import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../public/logo.png";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle scroll effect for navbar background and section highlighting
  useEffect(() => {
    const handleScroll = () => {
      // Navbar background change on scroll
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Only handle section highlighting on home page
      if (location.pathname === '/') {
        // Section highlighting logic
        const sections = ["home", "about", "timeline", "sponsors", "faq", "criteria", "team", "register"];
        
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
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);
  
  // Navigation items with their respective sections
  const navItems = [
    { name: "Home", id: "home", path: "/", delay: 0.05 },
    { name: "Sponsors", id: "sponsor", path: "/", delay: 0.1 },
    { name: "Timeline", id: "timeline", path: "/", delay: 0.15 },
    { name: "FAQ", id: "about", path: "/", delay: 0.2 },
    { name: "Criteria", id: "criteria", path: "/", delay: 0.25 },
    { name: "Team", id: "team", path: "/", delay: 0.3 },
    { name: "Sponsor", id: "sponsor", path: "/sponsor", delay: 0.4 }
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

  // Handle navigation items based on path or section
  const handleNavItem = (item, e) => {
    e.preventDefault();
    
    // If it's a different page, use navigation (like sponsor)
    if (item.path !== '/' || location.pathname !== '/') {
      navigate(item.path);
      return;
    }

    // Otherwise scroll to section on the same page
    scrollToSection(item.id);
  };
  
  // Determine if an item is active (either by path or section)
  const isItemActive = (item) => {
    if (item.path !== '/' && location.pathname === item.path) {
      return true;
    }
    return location.pathname === '/' && activeSection === item.id;
  };
  
  return (
    <nav 
      className={`fixed top-0  py-2 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-gray-900/80 backdrop-blur-lg border-b border-blue-900/30 shadow-lg shadow-blue-900/10" 
          : "dark:bg-transparent bg-gray-900/80 border-b border-blue-900/10"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Terminal-style Header with macOS Controls */}
        <div className="flex items-center">
          
          
          {/* Logo */}
          <Link 
            to="/"
            className="text-xl ml-10 md:ml-0 font-bold flex items-center cursor-pointer"
            data-cursor-text="navigate('home')"
            data-cursor-color="#38bdf8"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <img src={logo} className="h-15">
              </img>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-100">
                Sierra
              </span>
              <span className="text-blue-400">Hacks</span>
              <motion.span 
                className="ml-1 h-2 w-2 rounded-full bg-blue-400 hidden sm:block"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-green-400 ml-2 font-mono text-sm hidden sm:block">~</span>
            </motion.div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={(e) => handleNavItem(item, e)}
              className={`relative group transition-colors ${
                isItemActive(item) 
                  ? "text-white font-medium" 
                  : "text-blue-200 hover:text-white"
              }`}
              data-cursor-text={`navigate('${item.id}')`}
              data-cursor-color="#38bdf8"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item.delay, duration: 0.3 }}
              >
                {item.name}
                <span 
                  className={`absolute -bottom-1 left-0 h-[2px] bg-blue-400 transition-all duration-300 ${
                    isItemActive(item) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </motion.div>
            </Link>
          ))}
          
          {/* Donate Button */}
          <a
            href="https://hcb.hackclub.com/donations/start/codecatalyst"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:shadow-lg hover:shadow-purple-500/25 transition-all relative overflow-hidden group border border-blue-400/20"
            data-cursor-text="support()"
            data-cursor-color="#a855f7"
          >
            {/* Text container with proper z-index */}
            <div className="relative z-10 flex items-center justify-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <span className="font-mono">support.us</span>
            </div>
            
            {/* Hover animation background */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 z-0"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            />
            
            {/* Animated border glow effect */}
            <motion.span 
              className="absolute inset-0 rounded-md -z-10"
              initial={{ boxShadow: "0 0 0 rgba(168, 85, 247, 0)" }}
              whileHover={{ boxShadow: "0 0 8px rgba(168, 85, 247, 0.6)" }}
              transition={{ duration: 0.3 }}
            />
          </a>
          
          {/* Desktop Navigation Register Button - FIXED */}
          <a
            href="https://tally.so/r/wkzQWZ"
            className="inline-flex items-center justify-center px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md hover:shadow-lg hover:shadow-blue-500/25 transition-all relative overflow-hidden group"
            data-cursor-text="register()"
            data-cursor-color="#3b82f6"
          >
            {/* Text container with proper z-index */}
            <div className="relative z-10 flex items-center justify-center">
              Register
              <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            
            {/* Hover animation background */}
            <motion.div 
              className="absolute inset-0 bg-blue-700 z-0"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            />
          </a>
        </div>
        
        {/* Mobile Menu Button */}
        <motion.button 
          className="block md:hidden text-blue-200 mr-10"
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
              {navItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={(e) => {
                    if (item.path === '/' && location.pathname === '/') {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }
                    setIsOpen(false);
                  }}
                  className={`py-4 px-6 hover:text-white transition-all ${
                    isItemActive(item)
                      ? "text-white border-l-2 border-blue-400 bg-blue-900/40"
                      : "text-blue-200 border-l-2 border-transparent hover:border-blue-400 hover:bg-blue-900/30"
                  }`}
                  data-cursor-text={`navigate('${item.id}')`}
                  data-cursor-color="#38bdf8"
                >
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    {isItemActive(item) && <span className="text-green-500 mr-1">$</span>}
                    {item.name}
                  </motion.div>
                </Link>
              ))}
              {/* Add Donate Button to mobile menu */}
              <a
                href="https://hcb.hackclub.com/donations/start/codecatalyst"
                target="_blank"
                rel="noopener noreferrer"
                className="m-6 mb-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-md text-center hover:shadow-lg hover:shadow-purple-500/25 transition-all border border-purple-400/20"
                data-cursor-text="support()"
                data-cursor-color="#a855f7"
                onClick={() => setIsOpen(false)}
              >
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                  <span className="font-mono">support.us</span>
                </motion.div>
              </a>

              {/* Register button follows after the Donate button */}
              <Link
                to={location.pathname === '/' ? '#register' : '/'}
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    scrollToSection("register");
                  }
                  setIsOpen(false);
                }}
                className="m-6 mt-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-md text-center hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                data-cursor-text="register()"
                data-cursor-color="#3b82f6"
              >
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                >
                  Register Now
                </motion.div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;