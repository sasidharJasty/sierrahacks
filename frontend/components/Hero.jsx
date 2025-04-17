import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      {/* Dark tech background with noise texture */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-gray-900/90 z-0"></div>
      
      {/* Animated grid lines */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 backdrop-blur-[100px]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </motion.div>
      
      {/* Orbital accents */}
      <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2">
        <div className="relative w-full h-full">
          <motion.div 
            className="absolute inset-0 rounded-full border border-blue-500/20"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute inset-[15%] rounded-full border border-blue-400/20"
            animate={{
              rotate: -360
            }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute inset-[30%] rounded-full border border-blue-300/20"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear" 
            }}
          />
          <div className="absolute inset-[45%] rounded-full bg-blue-500/10" />
        </div>
      </div>
      
      {/* Floating code elements with glowing effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(8)].map((_, i) => {
          const codeElements = [
            '<SierraHacks />',
            'function hack() { }',
            'await innovation()',
            '{ creativity: true }',
            '=> mountains',
            '/* code & nature */',
            '[...hackers]',
            'new Ideas()'
          ];
          
          return (
            <motion.div
              key={i}
              className="absolute font-mono font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200 opacity-[0.15]"
              style={{
                fontSize: Math.max(14, Math.min(24, i * 2 + 10)) + 'px',
                left: (i * 10 + Math.random() * 10) + '%',
                top: (i * 10 + Math.random() * 10) + '%',
                textShadow: '0 0 15px rgba(56, 189, 248, 0.5)'
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.1, 0.2, 0.1],
                filter: ['blur(0px)', 'blur(1px)', 'blur(0px)']
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              data-cursor-text="snippet()" 
              data-cursor-color="#0ea5e9"
            >
              {codeElements[i]}
            </motion.div>
          );
        })}
      </div>
      
      {/* Main content with asymmetrical layout */}
      <div className="relative z-10 h-full container mx-auto px-4 lg:px-8">
        <div className="h-full flex flex-col lg:flex-row items-center">
          {/* Left side: Main heading */}
          <div className="w-full lg:w-7/12 pt-20 lg:pt-0 order-2 lg:order-1">
            <motion.div
              className="lg:max-w-3xl"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Mobile-only compact display */}
              <div className="block lg:hidden mb-12 text-center">
                <span className="inline-block py-1 px-3 mb-2 bg-blue-500/10 text-blue-300 text-xs font-mono uppercase rounded-full tracking-widest border border-blue-500/30">
                  May 17-19, 2025
                </span>
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-100">
                  Sierra<span className="text-blue-400">Hacks</span>
                </h2>
              </div>
              
              {/* Desktop title - hidden on mobile */}
              <div className="hidden lg:block">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <h1 
                    className="text-7xl xl:text-8xl 2xl:text-9xl font-bold tracking-tighter mb-6"
                    data-cursor-text="highlight()" 
                    data-cursor-color="#38bdf8"
                  >
                    <div className="flex flex-col items-start leading-[0.9]">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-100">
                        Sierra
                      </span>
                      <span className="text-blue-400 inline-flex items-center">
                        Hacks
                        <motion.span 
                          className="ml-2 h-3 w-3 rounded-full bg-blue-400"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </span>
                    </div>
                  </h1>
                </motion.div>
              </div>
              
              {/* Tagline & Description */}
              <motion.div
                className="mb-10 lg:pr-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <p 
                  className="text-2xl lg:text-3xl font-light text-blue-100 mb-4 leading-relaxed"
                  data-cursor-text="tagline()" 
                  data-cursor-color="#93c5fd"
                >
                  Where code meets the mountains.
                </p>
                <p 
                  className="text-lg text-blue-200/80 lg:max-w-xl"
                  data-cursor-text="readMore()" 
                  data-cursor-color="#93c5fd"
                >
                  Join us for a weekend of innovation, collaboration, and creativity in the heart of Sierra Nevada. Hack with a view that inspires breakthrough solutions.
                </p>
              </motion.div>
              
              {/* CTA buttons with animated hover effects */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <motion.a 
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  href="#register" 
                  className="relative overflow-hidden group px-8 py-4 bg-gradient-to-tr from-blue-600 to-blue-500 text-white font-medium rounded-md transition-all"
                  data-cursor-text="register()" 
                  data-cursor-color="#3b82f6"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Register Now
                    <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                
                <motion.a 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="#sponsor" 
                  className="px-8 py-4 bg-transparent text-blue-300 font-medium rounded-md border border-blue-500/30 hover:bg-blue-500/10 transition-colors"
                  data-cursor-text="sponsor()" 
                  data-cursor-color="#93c5fd"
                >
                  Become a Sponsor
                </motion.a>
              </motion.div>
              
              {/* Key stats with highlighted numbers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:pr-10"
              >
                {[
                  { value: '500+', label: 'Hackers', cursorText: "getHackers()" },
                  { value: '48', label: 'Hours', cursorText: "getDuration()" },
                  { value: '24', label: 'Workshops', cursorText: "getWorkshops()" },
                  { value: '$10K', label: 'in Prizes', cursorText: "getPrizes()" }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + (i * 0.1) }}
                    className="flex flex-col"
                    data-cursor-text={stat.cursorText} 
                    data-cursor-color="#38bdf8"
                  >
                    <span className="text-3xl font-bold text-white">
                      {stat.value}
                    </span>
                    <span className="text-blue-300 text-sm font-mono mt-1">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
          
          {/* Right side: Visual element, date and floating items */}
          <div className="w-full lg:w-5/12 flex flex-col justify-center items-center order-1 lg:order-2 pt-20 lg:pt-0">
            <div className="relative w-full max-w-md aspect-square">
              {/* Hidden on mobile */}
              <div className="hidden lg:block absolute top-0 left-0 right-0">
                <motion.span
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="inline-flex items-center py-2 px-4 bg-blue-500/10 text-blue-300 text-sm font-mono rounded-full tracking-wide border border-blue-500/30"
                  data-cursor-text="getDate()" 
                  data-cursor-color="#38bdf8"
                >
                  <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  May 17-19, 2025
                </motion.span>
              </div>
              
              {/* Main visual - abstract mountain with code */}
              <motion.div 
                className="relative mt-16 lg:mt-24 mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                {/* Mountain silhouette container */}
                <div className="relative w-80 h-80 mx-auto">
                  {/* Glowing blue circle backdrop */}
                  <div className="absolute inset-0 rounded-full bg-blue-500/10 filter blur-xl"></div>
                  
                  {/* Stylized mountain */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 20 L160 160 H40 Z" fill="url(#mountain-gradient)" stroke="#38bdf8" strokeWidth="0.5" />
                    <defs>
                      <linearGradient id="mountain-gradient" x1="100" y1="20" x2="100" y2="160" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#1e3a8a" />
                        <stop offset="100%" stopColor="#172554" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Code overlay */}
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-20">
                    <pre className="text-xs font-mono text-blue-300 p-4 leading-tight">
                      {`function hackathon() {
  const mountain = new Peak('Sierra');
  const event = {
    name: 'SierraHacks',
    duration: '48h',
    hackers: 500,
    location: mountain,
    prizes: '$10K'
  };
  
  return event.start();
}`}
                    </pre>
                  </div>
                  
                  {/* Animated particles */}
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-blue-400"
                      style={{
                        width: Math.random() * 3 + 1 + 'px',
                        height: Math.random() * 3 + 1 + 'px',
                        left: 40 + Math.random() * 120 + 'px',
                        top: 40 + Math.random() * 120 + 'px',
                        opacity: Math.random() * 0.5 + 0.2,
                      }}
                      animate={{
                        y: [0, Math.random() * 15 - 7.5],
                        x: [0, Math.random() * 15 - 7.5],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-blue-300 font-mono text-xs cursor-none group"
        animate={{
          y: [0, 10, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        data-cursor-text="scrollDown()" 
        data-cursor-color="#38bdf8"
      >
        <div className="flex flex-col items-center">
          <span className="mb-1 opacity-75">explore()</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" className="group-hover:translate-y-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12l-4 4-4-4M12 16V4" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
