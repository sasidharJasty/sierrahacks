import React from "react";
import { motion } from "framer-motion";

const Criteria = () => {
  const criteria = [
    {
      name: "Innovation",
      description: "How original and novel is the project? Does it solve a real problem in a new way?",
      weight: 30,
      icon: "💡"
    },
    {
      name: "Technical Complexity",
      description: "How technically impressive is the project? Is the code well-structured and efficient?",
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
      name: "Completion",
      description: "How finished is the project? Does it work end-to-end? Is it functional?",
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
    <div id="criteria" className="relative py-20 bg-gray-900">
      {/* Terminal scanlines effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(0deg, rgba(56, 189, 248, 0.2) 1px, transparent 1px)',
          backgroundSize: '100% 2px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-blue-300 mb-4 font-mono">Judging Criteria<span className="text-blue-500 animate-pulse">_</span></h2>
          <p className="text-blue-200/80 max-w-2xl mx-auto font-mono">
            <span className="text-green-400">$</span> ./evaluate-projects --criteria
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
              <div className="flex-1 text-center font-mono text-xs text-blue-300/70">criteria.json — bash — 80×24</div>
            </div>

            {/* Terminal content */}
            <div className="p-6 font-mono">
              <div className="mb-4 text-blue-300">
                <span className="text-blue-400">const</span> <span className="text-green-400">judgingCriteria</span> <span className="text-blue-300">=</span> <span className="text-yellow-300">[</span>
              </div>
              
              {criteria.map((criterion, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="mb-4 pl-6"
                >
                  <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{criterion.icon}</span>
                      <span className="text-blue-100 font-bold">{criterion.name}</span>
                      <div className="ml-auto bg-blue-900/40 px-2 py-1 rounded text-sm">
                        <span className="text-green-400">{criterion.weight}%</span>
                      </div>
                    </div>
                    
                    <div className="text-blue-200/80 pl-2 border-l-2 border-blue-500/30">
                      {criterion.description}
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-3 h-2 bg-blue-900/30 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${criterion.weight}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <div className="mt-2 text-blue-300">
                <span className="text-yellow-300">];</span>
              </div>
              
              <div className="mt-6 text-blue-300/70 text-sm border-t border-blue-500/20 pt-4">
                <span className="text-green-400">$</span> All projects will be evaluated by our panel of judges using the above criteria. Scores from each criterion will be weighted and combined for a final score.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria;