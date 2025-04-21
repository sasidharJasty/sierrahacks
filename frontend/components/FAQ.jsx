import React from "react";
import { motion } from "framer-motion";

const FAQ = () => {
  const faqItems = [
    {
      question: "Do I need coding experience to participate?",
      answer: "No, you don't need prior coding experience. We welcome participants of all skill levels. Teams are encouraged to have a mix of skills, and there will be mentors available to help you throughout the event."
    },
    {
      question: "What should I bring to the hackathon?",
      answer: "You should bring your laptop, charger, any hardware you plan to use for your project, and personal items you'll need for a 13-hour event. We'll provide food, drinks, and a comfortable hacking environment."
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

  return (
    <div id="about" className="relative py-20 bg-[#D9E7FD] dark:bg-gray-900 overflow-hidden">
      {/* Terminal dot matrix background */}
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
          <h2 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-4 font-mono">
            FAQ<span className="text-blue-600 dark:text-blue-500 animate-pulse">_</span>
          </h2>
          <p className="text-blue-800/80 dark:text-blue-200/80 max-w-2xl mx-auto font-mono">
            <span className="text-green-600 dark:text-green-400">$</span> frequently_asked_questions.sh
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Terminal window container */}
          <div className="border border-blue-300/30 dark:border-blue-500/30 rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm shadow-lg">
            {/* Terminal header */}
            <div className="bg-blue-100/80 dark:bg-gray-800/80 px-4 py-2 flex items-center border-b border-blue-200/50 dark:border-blue-500/20">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
              </div>
              <div className="flex-1 text-center font-mono text-xs text-blue-500/70 dark:text-blue-300/70">
                faq.sh — bash — 80×24
              </div>
            </div>

            {/* Terminal content */}
            <div className="p-4 font-mono">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="mb-6"
                >
                  <div className="text-green-600 dark:text-green-400 mb-1 flex items-start">
                    <span className="mr-2">$</span>
                    <span className="text-blue-700 dark:text-yellow-300 font-bold">{item.question}</span>
                  </div>
                  <div className="ml-6 pl-4 border-l text-sm dark:text-md border-blue-200/50 dark:border-blue-500/30 text-blue-800/90 dark:text-blue-100/90 leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-blue-600/70 dark:text-blue-300/70 mt-6 pt-4 border-t border-blue-200/50 dark:border-blue-500/20"
              >
                <div className="flex items-center text-sm">
                  <span className="text-green-600 dark:text-green-400 mr-2">$</span>
                  <span>Still have questions? Contact us at <span className="text-blue-600 dark:text-blue-300 underline">team@sierrahacks.com</span></span>
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