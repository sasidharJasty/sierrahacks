import React from "react";
import { motion } from "framer-motion";

const Timeline = () => {
  const timelineData = [
    {
      date: "7:00 AM - 8:00 AM",
      title: "Venue Setup",
      description: "Preparation of the hackathon venue."
    },
    {
      date: "8:00 AM - 8:30 AM",
      title: "Check-In & Breakfast",
      description: "Registration and morning refreshments."
    },
    {
      date: "8:30 AM - 9:00 AM",
      title: "Opening Ceremony & Team Formation",
      description: "Welcome address and team organization."
    },
    {
      date: "9:00 AM - 12:00 PM",
      title: "Hacking Begins",
      description: "Start of the coding and project development."
    },
    {
      date: "12:00 PM - 1:00 PM",
      title: "Lunch & Networking",
      description: "Mid-day break with food and socializing."
    },
    {
      date: "1:00 PM - 6:00 PM",
      title: "Hacking Continues",
      description: "Continued work on projects and mentoring sessions."
    },
    {
      date: "6:00 PM - 6:30 PM",
      title: "Devpost Submissions Due & Code Freeze",
      description: "Final submissions on Devpost platform."
    },
    {
      date: "6:30 PM - 7:00 PM",
      title: "Dinner & Networking",
      description: "Evening meal and project discussions."
    },
    {
      date: "7:00 PM - 8:00 PM",
      title: "Project Presentations & Demos",
      description: "Teams present their projects to judges and audience."
    },
    {
      date: "8:00 PM - 8:30 PM",
      title: "Judging & Deliberation",
      description: "Judges evaluate projects based on criteria."
    },
    {
      date: "8:30 PM - 9:00 PM",
      title: "Closing Ceremony & Awards",
      description: "Announcement of winners and prize distribution."
    }
  ];

  return (
    <div id="timeline" className="relative py-20 bg-[#D9E7FD] dark:bg-gray-900">
      {/* Terminal grid lines */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="timeline-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(30, 64, 175, 0.3)" className="dark:stroke-[rgba(56,189,248,0.3)]" strokeWidth="0.5"/>
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
          <h2 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-4 font-mono">
            Timeline, May 17th<span className="text-blue-600 dark:text-blue-500 animate-pulse">_</span>
          </h2>
          <p className="text-blue-800/80 dark:text-blue-200/80 max-w-2xl mx-auto font-mono">
            <span className="text-green-600 dark:text-green-400">$</span> cat schedule.log | sort -t
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Terminal window */}
          <div className="border border-blue-300/30 dark:border-blue-500/30 rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm shadow-lg">
            {/* Terminal header */}
            <div className="bg-blue-100/80 dark:bg-gray-800/80 px-4 py-2 flex items-center border-b border-blue-200/50 dark:border-blue-500/20">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
              </div>
              <div className="flex-1 text-center font-mono text-xs text-blue-500/70 dark:text-blue-300/70">
                timeline.sh — bash — 80×24
              </div>
            </div>

            {/* Terminal content */}
            <div className="p-6 font-mono">
              <div className="relative pl-8 border-l-2 border-blue-400/30 dark:border-blue-500/30">
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
                    <div className="absolute -left-[25px] w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-500 dark:border-blue-400 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse"></div>
                    </div>

                    {/* Content */}
                    <div className="bg-blue-100/30 dark:bg-blue-900/10 border border-blue-300/30 dark:border-blue-500/20 rounded p-3">
                      <div className="text-green-600 dark:text-green-400 text-sm mb-1">{item.date}</div>
                      <div className="text-blue-700 dark:text-blue-100 font-bold mb-1">{item.title}</div>
                      <div className="text-blue-800/90 dark:text-blue-200/80 text-sm">{item.description}</div>
                    </div>
                  </motion.div>
                ))}

                {/* Terminal cursor at the end */}
                <motion.div 
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-[5px] w-4 h-4 bg-blue-500/70 dark:bg-blue-400/70"
                />
              </div>

              <div className="mt-6 text-blue-600/70 dark:text-blue-300/70 text-sm">
                <span className="text-green-600 dark:text-green-400">$</span> Event times subject to minor adjustments. Check further emails for real-time updates.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;