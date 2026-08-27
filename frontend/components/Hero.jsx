import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiCalendar,
  FiMapPin,
  FiRadio,
} from "react-icons/fi";

const EVENT_DATE = new Date(2026, 9, 24).getTime();
const STAR_POSITIONS = [
  [7, 18], [14, 35], [21, 11], [29, 27], [38, 16], [46, 31], [54, 9],
  [62, 24], [70, 14], [78, 33], [87, 19], [94, 8], [11, 62], [24, 52],
  [35, 68], [66, 61], [82, 54], [91, 70],
];

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef(null);
  const [timeRemaining, setTimeRemaining] = useState(() => Math.max(EVENT_DATE - Date.now(), 0));
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const starsY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const sunY = useTransform(scrollYProgress, [0, 1], ["0%", "-58%"]);
  const sunScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const sunOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.75, 0.15]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-38%"]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.78]);
  const titleRotate = useTransform(scrollYProgress, [0, 1], [0, -4]);
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const consoleY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  useEffect(() => {
    const updateCountdown = () => setTimeRemaining(Math.max(EVENT_DATE - Date.now(), 0));
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdownUnits = [
    { label: "Days", value: Math.floor(timeRemaining / 86400000) },
    { label: "Hours", value: Math.floor((timeRemaining / 3600000) % 24) },
    { label: "Minutes", value: Math.floor((timeRemaining / 60000) % 60) },
    { label: "Seconds", value: Math.floor((timeRemaining / 1000) % 60) },
  ];

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <main ref={heroRef} id="home" className="relative min-h-screen overflow-hidden bg-[#090414] font-mono text-[#fff7ff]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_68%,rgba(255,38,184,0.25),transparent_31%),linear-gradient(180deg,#090414_0%,#16062c_54%,#360b4f_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(0deg,transparent_0_3px,rgba(255,255,255,0.16)_4px)]" />

      <motion.div style={{ y: shouldReduceMotion ? 0 : starsY }} className="pointer-events-none absolute inset-x-0 top-28 h-[42%]">
        {STAR_POSITIONS.map(([left, top], index) => (
          <motion.span
            key={`${left}-${top}`}
            className="absolute h-1 w-1 rounded-full bg-[#fff7ff] shadow-[0_0_8px_#fff7ff]"
            style={{ left: `${left}%`, top: `${top}%` }}
            animate={shouldReduceMotion ? {} : { opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 2 + (index % 4), repeat: Infinity, delay: (index % 5) * 0.35 }}
          />
        ))}
      </motion.div>

      <motion.div style={{ y: shouldReduceMotion ? 0 : sunY, scale: shouldReduceMotion ? 1 : sunScale, opacity: shouldReduceMotion ? 1 : sunOpacity }} className="pointer-events-none absolute left-1/2 top-[29%] h-44 w-44 -translate-x-1/2 rounded-full bg-[#ffb13b] shadow-[0_0_30px_#ff4dbb,0_0_110px_rgba(255,32,170,0.75)] sm:h-60 sm:w-60">
        <div className="absolute inset-0 rounded-full bg-[repeating-linear-gradient(0deg,transparent_0_13px,#ff229f_14px_17px)]" />
      </motion.div>

      <motion.div style={{ y: shouldReduceMotion ? 0 : gridY, scale: shouldReduceMotion ? 1 : gridScale }} className="pointer-events-none absolute bottom-0 left-1/2 h-[38%] w-[180%] -translate-x-1/2 overflow-hidden [perspective:230px]">
        <motion.div
          className="absolute inset-0 origin-bottom [transform:rotateX(63deg)] [background-image:linear-gradient(rgba(72,245,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(72,245,255,0.45)_1px,transparent_1px)] [background-size:4rem_2.8rem]"
          animate={shouldReduceMotion ? {} : { backgroundPositionY: ["0px", "45px"] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      <div className="pointer-events-none absolute bottom-[26%] left-0 right-0 h-px bg-[#ff36b7] shadow-[0_0_14px_#ff36b7]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-5 pb-6 pt-24 sm:px-8 sm:pt-28 lg:px-12">
        <motion.header {...reveal(0.05)} className="flex items-center justify-between border-b border-[#48f5ff]/40 pb-4 text-[10px] uppercase tracking-[0.2em] text-[#b8faff] sm:text-xs">
          <span className="flex items-center gap-2"><FiRadio className="text-[#ff49c8]" /> SierraHacks broadcast</span>
          <span className="hidden text-[#e3b4df] sm:block">Stockton, California / 2026</span>
          <span className="text-[#48f5ff]">Live signal <i className="ml-2 inline-block h-2 w-2 rounded-full bg-[#48f5ff] shadow-[0_0_9px_#48f5ff]" /></span>
        </motion.header>

        <div className="relative flex flex-1 flex-col justify-center py-16 text-center sm:py-20">
          <motion.div {...reveal(0.16)} className="relative z-10 mb-5 text-[10px] uppercase tracking-[0.35em] text-[#ffb5e8] sm:text-xs">
            The future is homemade
          </motion.div>
          <motion.h1
            {...reveal(0.24)}
            style={{ y: shouldReduceMotion ? 0 : titleY, scale: shouldReduceMotion ? 1 : titleScale, rotate: shouldReduceMotion ? 0 : titleRotate }}
            className="relative z-10 mx-auto max-w-6xl text-[clamp(3.8rem,14vw,12.5rem)] font-black uppercase leading-[0.76] tracking-[-0.1em] text-[#fff7ff] [text-shadow:3px_3px_0_#ff21aa,6px_6px_0_#48f5ff]"
          >
            <span className="block">Sierra</span>
            <span className="block text-[#ff49c8]">Hacks</span>
            <span className="block text-[0.42em] tracking-[-0.06em] text-[#48f5ff] [text-shadow:2px_2px_0_#ff21aa]">2026</span>
          </motion.h1>
          <motion.div {...reveal(0.38)} className="relative z-10 mx-auto mt-9 flex max-w-2xl flex-col items-center gap-5 text-xs leading-relaxed text-[#e3b4df] sm:text-sm">
            <p>12 hours. 175+ hackers. One signal from the next generation of builders.</p>
            <a href="/register" className="group inline-flex items-center gap-3 border border-[#48f5ff] bg-[#100522]/70 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#48f5ff] shadow-[0_0_18px_rgba(72,245,255,0.18)] transition-all hover:border-[#ff49c8] hover:text-[#ff49c8] hover:shadow-[0_0_24px_rgba(255,73,200,0.28)]">
              Enter the arena <FiArrowUpRight className="text-base transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>

        <motion.section style={{ y: shouldReduceMotion ? 0 : consoleY }} {...reveal(0.5)} aria-label="Event countdown" className="relative z-10 border border-[#ff49c8]/60 bg-[#100522]/90 shadow-[0_0_25px_rgba(255,32,189,0.18)]">
          <div className="flex flex-col gap-4 border-b border-[#ff49c8]/40 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-[#ffb5e8] sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span className="flex items-center gap-2"><span className="h-2 w-2 bg-[#ff49c8] shadow-[0_0_8px_#ff49c8]" /> Countdown to launch</span>
            <span className="text-[#48f5ff]">October 24, 2026 / 12-hour build sprint</span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-y divide-[#ff49c8]/30 sm:grid-cols-4 sm:divide-y-0">
            {countdownUnits.map(({ label, value }) => (
              <div key={label} className="px-4 py-5 sm:px-6 sm:py-7">
                <p className="text-[clamp(2.1rem,5vw,4.5rem)] font-black leading-none tabular-nums text-[#fff7ff] [text-shadow:0_0_14px_#ff49c8]">{String(value).padStart(2, "0")}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[#48f5ff]">{label}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 border-t border-[#ff49c8]/40 px-4 py-4 text-[10px] uppercase tracking-[0.15em] text-[#e3b4df] sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:px-6">
            <span className="flex items-center gap-2"><FiCalendar className="text-[#ff49c8]" /> Saturday / 10.24.26</span>
            <FiArrowDown className="hidden justify-self-center text-[#48f5ff] sm:block" />
            <a href="https://www.google.com/maps/place/Sierra+High+School/@37.7925198,-121.2458948" target="_blank" rel="noreferrer" className="flex items-center gap-2 sm:justify-self-end hover:text-[#48f5ff]"><FiMapPin className="text-[#ff49c8]" /> Sierra High School <FiArrowUpRight /></a>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default Hero;
