import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = () => {
  const faqItems = [
    {
      question: "Do I need coding experience to participate?",
      answer: "No, you don't need prior coding experience. We welcome participants of all skill levels. Teams are encouraged to have a mix of skills, and there will be mentors available to help you throughout the event."
    },
    {
      question: "What should I bring to the hackathon?",
      answer: "You should bring your laptop, charger, any hardware you plan to use for your project, and personal items you'll need for a 12-hour event. We'll provide food, drinks, and a comfortable hacking environment."
    },
    {
      question: "How are teams formed?",
      answer: "You can form your own team of 2-4 members before the event or join a team during the team formation session at the beginning of the hackathon. We'll help match participants looking for teammates based on skills and interests."
    },
    {
      question: "Will there be food and drinks?",
      answer: "Yes! We'll provide breakfast, lunch, dinner, and snacks throughout the event. If you have dietary restrictions, please let us know when you register so we can accommodate your needs."
    },
    {
      question: "Can I start working on my project before the hackathon?",
      answer: "No, all coding and design work must start during the hackathon. You can brainstorm ideas and plan your approach before the event, but implementation should begin when the hacking officially starts."
    },
    {
      question: "Do I need to submit anything before the hackathon?",
      answer: "Just your registration. You don't need to submit your idea or any materials before the event. Project submissions will be done through Devpost during the hackathon."
    },   
    {
      question: "What resources will be available during the event?",
      answer: "We'll provide Wi-Fi, power outlets and mentors who can help with technical challenges. We'll also have workshops and tech talks throughout the day to help you learn new skills."
    },
    {
      question: "How does the judging process work?",
      answer: "Teams will present their projects to a panel of judges who will evaluate them based on innovation, technical implementation, impact, presentation, and collaboration. Winners will be announced at the closing ceremony."
    }
  ];

  // Only one item open at a time (set to null to close all)
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <div id="faq" className="relative overflow-hidden bg-black/70 py-24">
      {/* Soft signal field */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="terminal-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(30, 64, 175, 0.5)" className="dark:fill-[rgba(56,189,248,0.5)]" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#terminal-dots)" />
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
            FAQ<span className="ml-2 text-[#0E43B6] animate-pulse">✦</span>
          </h2>
          <p className="mx-auto max-w-2xl font-mono text-blue-300/70">
            <span className="text-[#0E43B6]">///</span> Clear answers for the big build
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="overflow-hidden border border-[#0E43B6]/60 bg-black shadow-[0_0_28px_rgba(14,67,182,0.16)]">
            <div className="p-4 font-mono">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="mb-2 sm:mb-4"
                >
                  {/* Toggle button (accessible) */}
                  <button
                    onClick={() => toggle(index)}
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-panel-${index}`}
                    className="flex w-full items-start justify-between gap-3 rounded-md border-b border-[#0E43B6]/20 px-2 py-3 text-left transition-colors hover:bg-[#0E43B6]/10"
                  >
                    <div className="text-green-600 dark:text-green-400 mb-0 flex items-start">
                      <span className="mr-2 text-[#0E43B6]">+</span>
                      <span className="font-bold text-blue-100">{item.question}</span>
                    </div>

                    {/* Chevron icon */}
                    <svg
                      className={`w-5 h-5 text-blue-600 dark:text-blue-300 mt-0.5 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Collapsible answer */}
                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        id={`faq-panel-${index}`}
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="ml-6 pl-4 border-l text-sm dark:text-md border-blue-200/50 dark:border-blue-500/30 text-blue-800/90 dark:text-blue-100/90 leading-relaxed py-2">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Footer line stays visible */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-blue-600/70 dark:text-blue-300/70 mt-6 pt-4 border-t border-blue-200/50 dark:border-blue-500/20"
              >
                <div className="flex items-center text-sm">
                  <span className="mr-2 text-[#0E43B6]">+</span>
                  <span>Still have questions? Contact us at <span className="text-blue-600 dark:text-blue-300 underline">support@sierrahacks.com</span></span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;