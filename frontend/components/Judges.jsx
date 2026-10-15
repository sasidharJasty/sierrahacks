import React from "react";
import { motion } from "framer-motion";

const Judges = () => {
  const judges = Array.from({ length: 8 }, (_, index) => ({
    name: "TBA",
    role: "Judge announcement coming soon",
    expertise: "To be announced",
    number: index + 1,
  }));

  return (
    <div id="judges" className="relative overflow-hidden bg-black/70 py-24">
      {/* Quiet data rain */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute font-mono text-xs text-blue-600 dark:text-blue-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [0, 500],
              opacity: [1, 0.3, 1]
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {Math.random() > 0.5 ? "1" : "0"}
          </motion.div>
        ))}
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
            Judges<span className="ml-2 text-[#0E43B6] animate-pulse">✦</span>
          </h2>
          <p className="mx-auto max-w-2xl font-mono text-blue-300/70">
            <span className="text-[#0E43B6]">///</span> A panel of curious experts
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {judges.map((judge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="overflow-hidden border border-[#0E43B6]/50 bg-black shadow-[0_0_24px_rgba(14,67,182,0.14)] transition-colors hover:border-[#0E43B6]"
            >
              <div className="flex items-center border-b border-[#0E43B6]/35 bg-[#0E43B6]/10 px-3 py-1.5">
                <div className="flex space-x-1.5 mr-3">
                  <div className="w-2 h-2 rounded-full bg-red-400/70"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400/70"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400/70"></div>
                </div>
                <div className="flex-1 text-center font-mono text-xs text-blue-300/70 truncate">expert profile / {String(index + 1).padStart(2, "0")}</div>
              </div>

              {/* Image */}
              <div className="relative h-48 flex items-center justify-center p-3 border-b border-blue-200/50 dark:border-blue-500/20">
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <div className="text-[8px] text-blue-500/10 font-mono whitespace-pre leading-tight">
                    {Array(20).fill(0).map((_, rowIdx) => (
                      <div key={rowIdx}>
                        {Array(40).fill(0).map(() => (
                          Math.random() > 0.5 ? "1" : "0"
                        )).join(" ")}
                      </div>
                    ))}
                  </div>
                </div>
                <motion.div
                  className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-blue-300/40 font-mono text-xl text-blue-200/70 dark:border-blue-500/40 z-10"
                  whileHover={{ scale: 1.05 }}
                >
                  TBA
                </motion.div>
              </div>

              {/* Info */}
              <div className="p-4 font-mono">
                <div className="text-blue-800 dark:text-blue-100 font-bold mb-1">{judge.name}</div>
                <div className="text-green-600 dark:text-green-400 text-sm mb-2">{judge.role}</div>
                <div className="flex items-center mb-3">
                  <div className="h-1 flex-grow bg-blue-200/40 dark:bg-blue-900/40">
                    <motion.div 
                      className="h-full bg-blue-600 dark:bg-blue-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
                <div className="text-blue-700/80 dark:text-blue-300/80 text-sm mb-4">
                  <span className="text-blue-600 dark:text-blue-400 opacity-70">expertise:</span> {judge.expertise}
                </div>
                <div className="mt-2 text-xs text-blue-300/55">
                  Judge {String(judge.number).padStart(2, "0")} / details coming soon
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Judges;