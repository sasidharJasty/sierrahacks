import React from "react";
import { motion } from "framer-motion";

const Timeline = () => {
  const timelineData = [
    {
      date: "7:30 AM - 8:15 AM",
      title: "Check-In & Breakfast",
      description: "Registration and morning refreshments."
    },
    {
      date: "8:15 AM - 8:45 AM",
      title: "Opening Ceremony & Team Formation",
      description: "Welcome address and team organization."
    },
    {
      date: "8:45 AM - 9:00 AM",
      title: "Team Formation",
      description: "Forming teams for the hackathon."
    },
    {
      date: "9:00 AM - 12:00 PM",
      title: "Hacking Time",
      description: "Forming teams for the hackathon."
    },
    {
      date: "10:00 AM - 11:00 AM",
      title: "Beginners Workshop",
      description: "Introductory session for first-time hackers."
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
      date: "2:00 PM - 3:00 PM",
      title: "Machine Learning Workshop",
      description: "Hands-on session on machine learning basics."
    },
    {
      date: "6:00 PM",
      title: "Devpost Submissions Due & Code Freeze",
      description: "Final submissions on Devpost platform."
    },
    {
      date: "6:00 PM - 6:30 PM",
      title: "Dinner & Networking",
      description: "Evening meal and project discussions."
    },
    {
      date: "6:30 PM - 7:30 PM",
      title: "Project Presentations & Demos",
      description: "Teams present their projects to judges and audience."
    },
    {
      date: "7:30 PM - 8:00 PM",
      title: "Closing Ceremony & Awards",
      description: "Announcement of winners and prize distribution."
    }
  ];

  return (
    <div id="timeline" className="relative overflow-hidden bg-black/70 py-24">
      {/* Event grid */}
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
          <h2 className="mb-4 font-mono text-4xl font-bold text-blue-100">
            Timeline<span className="ml-2 text-[#0E43B6] animate-pulse">✦</span>
          </h2>
          <p className="mx-auto max-w-2xl font-mono text-blue-300/70">
            <span className="text-[#0E43B6]">///</span> A day mapped in motion
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="border-l border-[#0E43B6]/60 bg-black/70 p-6 font-mono shadow-[0_0_28px_rgba(14,67,182,0.16)]">
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
                    <div className="rounded border border-[#0E43B6]/35 bg-[#0E43B6]/[0.06] p-3">
                      <div className="mb-1 text-sm text-[#5d9aff]">{item.date}</div>
                      <div className="mb-1 font-bold text-blue-100">{item.title}</div>
                      <div className="text-sm text-blue-200/70">{item.description}</div>
                    </div>
                  </motion.div>
                ))}

                <motion.div 
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-[5px] w-4 h-4 bg-blue-500/70 dark:bg-blue-400/70"
                />
              </div>

              <div className="mt-6 text-sm text-blue-300/70">
                <span className="text-[#0E43B6]">///</span> Event times may shift slightly. Watch for live updates.
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Timeline;