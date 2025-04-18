import React from "react";
import { motion } from "framer-motion";

const Timeline = () => {
  const timelineData = [
    {
      date: "May 17, 16:00",
      title: "Registration Opens",
      description: "Check in and receive your welcome packet with swag"
    },
    {
      date: "May 17, 18:00",
      title: "Opening Ceremony",
      description: "Welcome address, sponsor introductions, and hackathon rules"
    },
    {
      date: "May 17, 19:00",
      title: "Hacking Begins",
      description: "Start building your projects!"
    },
    {
      date: "May 17, 20:00",
      title: "Team Formation & Dinner",
      description: "Find teammates and enjoy dinner together"
    },
    {
      date: "May 18, 08:00",
      title: "Breakfast",
      description: "Fuel up for a day of coding"
    },
    {
      date: "May 18, 10:00",
      title: "Workshops Begin",
      description: "Choose from multiple tech workshops throughout the day"
    },
    {
      date: "May 19, 11:00",
      title: "Submission Deadline",
      description: "All projects must be submitted by this time"
    },
    {
      date: "May 19, 13:00",
      title: "Expo & Demos",
      description: "Showcase your projects to judges and attendees"
    },
    {
      date: "May 19, 17:00",
      title: "Awards Ceremony",
      description: "Winners announced and prizes distributed"
    }
  ];

  return (
    <div id="timeline" className="relative py-20 bg-gray-900">
      {/* Terminal grid lines */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="timeline-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#timeline-grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-blue-300 mb-4 font-mono">Timeline<span className="text-blue-500 animate-pulse">_</span></h2>
          <p className="text-blue-200/80 max-w-2xl mx-auto font-mono">
            <span className="text-green-400">$</span> cat schedule.log | sort -t
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Terminal window */}
          <div className="border border-blue-500/30 rounded-lg overflow-hidden bg-gray-900/60 backdrop-blur-sm shadow-lg">
            {/* Terminal header */}
            <div className="bg-gray-800/80 px-4 py-2 flex items-center border-b border-blue-500/20">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
              </div>
              <div className="flex-1 text-center font-mono text-xs text-blue-300/70">timeline.sh — bash — 80×24</div>
            </div>

            {/* Terminal content */}
            <div className="p-6 font-mono">
              <div className="relative pl-8 border-l-2 border-blue-500/30">
                {timelineData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="mb-8 relative"
                  >
                    {/* Terminal node */}
                    <div className="absolute -left-[25px] w-6 h-6 rounded-full bg-blue-900/50 border-2 border-blue-400 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                    </div>

                    {/* Content */}
                    <div className="bg-blue-900/10 border border-blue-500/20 rounded p-3">
                      <div className="text-green-400 text-sm mb-1">{item.date}</div>
                      <div className="text-blue-100 font-bold mb-1">{item.title}</div>
                      <div className="text-blue-200/80 text-sm">{item.description}</div>
                    </div>
                  </motion.div>
                ))}

                {/* Terminal cursor at the end */}
                <motion.div 
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-[5px] w-4 h-4 bg-blue-400/70"
                />
              </div>

              <div className="mt-6 text-blue-300/70 text-sm">
                <span className="text-green-400">$</span> Event times subject to minor adjustments. Check the event dashboard for real-time updates.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;