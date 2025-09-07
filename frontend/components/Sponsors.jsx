import React from "react";
import { motion } from "framer-motion";

export default function Sponsors() {
  const sponsors = [
    { name: "XYZ", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/.xyz_logo.svg/800px-.xyz_logo.svg.png", tier: "Platinum", url: "https://gen.xyz" },
    { name: "Great Wolf Lodge", logo: "https://1000logos.net/wp-content/uploads/2020/08/Great-Wolf-Lodge-logo.png", tier: "Gold", url: "https://www.greatwolf.com" },
    { name: "Bowlero", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfCFMiQhnJ0lZB1Qv7T2qJ2qRGaNJrzgGqqw&s", tier: "Silver", url: "https://www.bowlero.com" },
    
  ];

  const tierRank = { Platinum: 0, Gold: 1, Silver: 2, Bronze: 3 };

  const tierStyles = {
    Platinum: {
      colSpan: "md:col-span-2 lg:col-span-2",
      cardGlow: "shadow-blue-500/30 dark:shadow-blue-500/20",
      border: "border-blue-400/60 dark:border-blue-400/50",
      headerBg: "bg-gradient-to-r from-blue-100/90 to-slate-100/80 dark:from-gray-800/80 dark:to-blue-900/40",
      bar: "from-blue-400/70 to-sky-400/70",
      badge: "bg-blue-100/70 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100 border-blue-300/60 dark:border-blue-500/40",
      logoWrap: "w-36 h-36 sm:w-40 sm:h-40 bg-white/90 dark:bg-gray-900/40",
      ring: "ring-2 ring-blue-400/60 dark:ring-blue-400/40",
      name: "text-blue-900 dark:text-blue-100",
    },
    Gold: {
      colSpan: "md:col-span-2 lg:col-span-2",
      cardGlow: "shadow-amber-500/20 dark:shadow-amber-500/15",
      border: "border-amber-300/60 dark:border-amber-400/40",
      headerBg: "bg-gradient-to-r from-amber-100/80 to-yellow-100/70 dark:from-amber-900/30 dark:to-yellow-900/20",
      bar: "from-amber-400/80 to-yellow-400/80",
      badge: "bg-amber-100/70 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 border-amber-300/60 dark:border-amber-500/40",
      logoWrap: "w-32 h-32 sm:w-36 sm:h-36 bg-amber-50/60 dark:bg-amber-900/10",
      ring: "ring-2 ring-amber-400/60 dark:ring-amber-400/40",
      name: "text-amber-900 dark:text-amber-100",
    },
    Silver: {
      colSpan: "md:col-span-1 lg:col-span-1",
      cardGlow: "shadow-slate-500/15 dark:shadow-slate-500/10",
      border: "border-slate-300/60 dark:border-slate-500/40",
      headerBg: "bg-gradient-to-r from-slate-100/80 to-gray-100/70 dark:from-slate-900/30 dark:to-gray-900/20",
      bar: "from-slate-300/80 to-gray-300/80",
      badge: "bg-slate-100/70 dark:bg-slate-900/30 text-slate-800 dark:text-slate-100 border-slate-300/60 dark:border-slate-500/40",
      logoWrap: "w-28 h-28 sm:w-32 sm:h-32 bg-slate-50/60 dark:bg-slate-900/10",
      ring: "ring-1 ring-slate-400/50 dark:ring-slate-500/40",
      name: "text-slate-800 dark:text-slate-100",
    },
    Bronze: {
      colSpan: "md:col-span-1 lg:col-span-1",
      cardGlow: "shadow-orange-500/15 dark:shadow-orange-500/10",
      border: "border-orange-300/60 dark:border-orange-500/40",
      headerBg: "bg-gradient-to-r from-orange-100/80 to-amber-100/70 dark:from-orange-900/30 dark:to-amber-900/20",
      bar: "from-orange-400/80 to-amber-400/80",
      badge: "bg-orange-100/70 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 border-orange-300/60 dark:border-orange-500/40",
      logoWrap: "w-24 h-24 sm:w-28 sm:h-28 bg-orange-50/60 dark:bg-orange-900/10",
      ring: "ring-1 ring-orange-400/50 dark:ring-orange-500/40",
      name: "text-orange-900 dark:text-orange-100",
    },
  };

  const sorted = [...sponsors].sort((a, b) => tierRank[a.tier] - tierRank[b.tier]);

  return (
    <div id="sponsor" className="relative py-20 bg-[#D9E7FD] dark:bg-gray-900 overflow-hidden">
      {/* Terminal dot matrix background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="terminal-dots-sponsors" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(30, 64, 175, 0.5)" className="dark:fill-[rgba(56,189,248,0.5)]" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#terminal-dots-sponsors)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-2 font-mono">
            Sponsors<span className="text-blue-600 dark:text-blue-500 animate-pulse">_</span>
          </h2>
          <p className="text-blue-800/80 dark:text-blue-200/80 font-mono">
            <span className="text-green-600 dark:text-green-400">$</span> cat sponsors.txt
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-6 lg:gap-8">
          {sorted.map((sponsor, index) => {
            const t = tierStyles[sponsor.tier] ?? tierStyles.Bronze;
            return (
              <motion.a
                key={`${sponsor.name}-${index}`}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${sponsor.name} website`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`border ${t.border} rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm shadow-lg ${t.cardGlow} transition-colors ${t.colSpan} cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400/60`}
              >
                {/* Tier color bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${t.bar}`} />

                {/* Terminal header */}
                <div className={`${t.headerBg} px-3 py-1.5 flex items-center border-b ${t.border}`}>
                  <div className="flex space-x-1.5 mr-3">
                    <div className="w-2 h-2 rounded-full bg-red-400/70"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400/70"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400/70"></div>
                  </div>
                  <div className="flex-1 text-center font-mono text-xs text-blue-500/70 dark:text-blue-300/70">
                    sponsor-card.sh
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 font-mono flex flex-col items-center text-center">
                  <div className={`${t.logoWrap} rounded-md border ${t.border} flex items-center justify-center mb-4 ${t.ring}`}>
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-w-[85%] max-h-[85%] object-contain"
                    />
                  </div>

                  <div className={`font-bold ${t.name}`}>{sponsor.name}</div>

                  <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-wide">
                    <span className={`border rounded px-2 py-0.5 ${t.badge}`}>
                      {sponsor.tier} Sponsor
                    </span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
