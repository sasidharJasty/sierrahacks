import React from "react";
import { motion } from "framer-motion";

const Judges = () => {
  const judges = [
    {
      name: "Dr. Alexandra Chen",
      role: "CTO, TechFuture Inc.",
      expertise: "AI & Machine Learning",
      image: "https://randomuser.me/api/portraits/women/29.jpg",
      twitter: "@alexchen",
      github: "alexchen"
    },
    {
      name: "Michael Rodriguez",
      role: "Lead Engineer, CloudWave",
      expertise: "Cloud Architecture & DevOps",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      twitter: "@mrodriguez",
      github: "mrodriguez"
    },
    {
      name: "Sarah Washington",
      role: "UX Director, DesignHub",
      expertise: "UI/UX & Product Design",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      twitter: "@sarahw",
      github: "sarahw"
    },
    {
      name: "James Tran",
      role: "VP Engineering, InnovateNow",
      expertise: "Mobile & Web Development",
      image: "https://randomuser.me/api/portraits/men/68.jpg",
      twitter: "@jamestran",
      github: "jamestran"
    }
  ];

  return (
    <div id="judges" className="relative py-20 bg-gray-900">
      {/* Terminal matrix code effect */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute font-mono text-xs text-blue-400"
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
          <h2 className="text-4xl font-bold text-blue-300 mb-4 font-mono">Judges<span className="text-blue-500 animate-pulse">_</span></h2>
          <p className="text-blue-200/80 max-w-2xl mx-auto font-mono">
            <span className="text-green-400">$</span> ls -la ./experts/
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {judges.map((judge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="border border-blue-500/30 rounded-lg overflow-hidden bg-gray-900/60 backdrop-blur-sm shadow-lg"
            >
              {/* Terminal header */}
              <div className="bg-gray-800/80 px-3 py-1.5 flex items-center border-b border-blue-500/20">
                <div className="flex space-x-1.5 mr-3">
                  <div className="w-2 h-2 rounded-full bg-red-400/70"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400/70"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400/70"></div>
                </div>
                <div className="flex-1 text-center font-mono text-xs text-blue-300/70 truncate">{judge.name.toLowerCase().replace(' ', '-')}.json</div>
              </div>

              {/* Image */}
              <div className="relative h-48 flex items-center justify-center p-3 border-b border-blue-500/20">
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <div className="text-[8px] text-blue-500/10 font-mono whitespace-pre leading-tight">
                    {Array(20).fill(0).map((_, i) => (
                      <div key={i}>
                        {Array(40).fill(0).map((_, j) => (
                          Math.random() > 0.5 ? "1" : "0"
                        )).join(" ")}
                      </div>
                    ))}
                  </div>
                </div>
                <motion.div 
                  className="w-28 h-28 rounded-full border-2 border-blue-500/40 overflow-hidden z-10"
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={judge.image} 
                    alt={judge.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* Info */}
              <div className="p-4 font-mono">
                <div className="text-blue-100 font-bold mb-1">{judge.name}</div>
                <div className="text-green-400 text-sm mb-2">{judge.role}</div>
                <div className="flex items-center mb-3">
                  <div className="h-1 flex-grow bg-blue-900/40">
                    <motion.div 
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                </div>
                <div className="text-blue-300/80 text-sm mb-4">
                  <span className="text-blue-400 opacity-70">expertise:</span> {judge.expertise}
                </div>
                <div className="flex justify-between text-xs mt-2">
                  <a href={`https://twitter.com/${judge.twitter}`} className="text-blue-400 hover:underline">
                    {judge.twitter}
                  </a>
                  <a href={`https://github.com/${judge.github}`} className="text-blue-400 hover:underline">
                    github/{judge.github}
                  </a>
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