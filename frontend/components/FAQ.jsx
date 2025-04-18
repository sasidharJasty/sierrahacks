import React from "react";
import { motion } from "framer-motion";

const FAQ = () => {
  const faqItems = [
    {
      question: "What is SierraHacks?",
      answer: "SierraHacks is a 48-hour hackathon bringing together 500+ innovators to build creative solutions in the heart of the Sierra Nevada mountains. It combines coding, nature, and creativity for a unique hacking experience."
    },
    {
      question: "Who can participate?",
      answer: "Anyone 18+ years old can participate, from students to professionals. All skill levels are welcome - whether you're a beginner or experienced developer."
    },
    {
      question: "Do I need a team?",
      answer: "Teams of up to 4 people are recommended, but you can also participate solo. We'll have team formation activities if you're looking to join forces with other hackers."
    },
    {
      question: "What should I bring?",
      answer: "Laptop, charger, comfortable clothes, toiletries, and your creativity! We provide meals, snacks, and a hacking space with reliable WiFi."
    },
    {
      question: "Is there a cost to attend?",
      answer: "SierraHacks is completely free for all participants. We provide meals, snacks, workspace, and swag with the help of our sponsors."
    },
    {
      question: "Will there be prizes?",
      answer: "Yes! We have $10,000+ in prizes across multiple categories including Best Overall, Best UI/UX, Best Use of AI, and more."
    }
  ];

  return (
    <div id="about" className="relative py-20 bg-gray-900 overflow-hidden">
      {/* Terminal dot matrix background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="terminal-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(56, 189, 248, 0.5)" />
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
          <h2 className="text-4xl font-bold text-blue-300 mb-4 font-mono">FAQ<span className="text-blue-500 animate-pulse">_</span></h2>
          <p className="text-blue-200/80 max-w-2xl mx-auto font-mono">
            <span className="text-green-400">$</span> frequently_asked_questions.sh
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Terminal window container */}
          <div className="border border-blue-500/30 rounded-lg overflow-hidden bg-gray-900/60 backdrop-blur-sm shadow-lg">
            {/* Terminal header */}
            <div className="bg-gray-800/80 px-4 py-2 flex items-center border-b border-blue-500/20">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
              </div>
              <div className="flex-1 text-center font-mono text-xs text-blue-300/70">faq.sh — bash — 80×24</div>
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
                  <div className="text-green-400 mb-1 flex items-start">
                    <span className="mr-2">$</span>
                    <span className="text-yellow-300 font-bold">{item.question}</span>
                  </div>
                  <div className="ml-6 pl-4 border-l border-blue-500/30 text-blue-100/90 leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-blue-300/70 mt-6 pt-4 border-t border-blue-500/20"
              >
                <div className="flex items-center text-sm">
                  <span className="text-green-400 mr-2">$</span>
                  <span>Still have questions? Contact us at <span className="text-blue-300 underline">team@sierrahacks.com</span></span>
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