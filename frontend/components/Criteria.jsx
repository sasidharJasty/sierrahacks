import React from "react";
import { motion } from "framer-motion";

const Criteria = () => {
  const criteria = [
    {
      name: "Innovation & Creativity",
      description: "Uniqueness and originality of the project. How different is it from existing solutions?",
      weight: 30,
      icon: "💡"
    },
    {
      name: "Technical Implementation",
      description: "Complexity and efficiency of the solution. How well was it executed from a technical perspective?",
      weight: 25,
      icon: "⚙️"
    },
    {
      name: "Design & UX",
      description: "Is the project well-designed and user-friendly? Does it provide a good user experience?",
      weight: 20,
      icon: "🎨"
    },
    {
      name: "Relavence & Impact",
      description: "How well it addresses the given problem and its potential real-world impact.",
      weight: 15,
      icon: "✅"
    },
    {
      name: "Presentation",
      description: "How well was the project presented? Was the demo clear and compelling?",
      weight: 10,
      icon: "🎭"
    }
  ];

  return (
    <div id="criteria" className="relative overflow-hidden bg-black/70 py-24">
      {/* Fine scoring grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03] pointer-events-none">
        <div style={{
          backgroundImage: 'linear-gradient(0deg, rgba(30, 64, 175, 0.2) 1px, transparent 1px)',
          backgroundSize: '100% 2px'
        }} className="dark:bg-[linear-gradient(0deg,rgba(56,189,248,0.2)_1px,transparent_1px)] h-full w-full"></div>
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
            Criteria<span className="ml-2 text-[#0E43B6] animate-pulse">✦</span>
          </h2>
          <p className="mx-auto max-w-2xl font-mono text-blue-300/70">
            <span className="text-[#0E43B6]">///</span> How projects become standouts
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="overflow-hidden bg-black">
            <div className="p-6 font-mono">


              {criteria.map((criterion, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="mb-4 pl-6 shadow-[0_0_28px_rgba(14,67,182,0.16)] hover:scale-[1.05] transition-transform ease-in-out duration-300"
                >
                  <div className="rounded-lg border border-[#0E43B6]/35 bg-[#0E43B6]/[0.06] p-4">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{criterion.icon}</span>
                      <span className="text-blue-800 dark:text-blue-100 font-bold">{criterion.name}</span>
                      <div className="ml-auto bg-blue-200/50 dark:bg-blue-900/40 px-2 py-1 rounded text-sm">
                        <span className="text-blue-700 dark:text-green-400">{criterion.weight}%</span>
                      </div>
                    </div>
                    
                    <div className="text-blue-800/90 dark:text-blue-200/80 pl-2 border-l-2 border-blue-300/50 dark:border-blue-500/30">
                      {criterion.description}
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-3 h-2 bg-blue-200/50 dark:bg-blue-900/30 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-400"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${criterion.weight}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
              

              
              <div className="mt-6 text-blue-600/70 dark:text-blue-300/70 text-sm border-t border-blue-200/50 dark:border-blue-500/20 pt-4">
                <span className="text-[#0E43B6]">///</span> Scores are weighted into one final project signal.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria;