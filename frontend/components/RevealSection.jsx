import React from "react";
import { motion } from "framer-motion";
import { FiArrowDown, FiLock } from "react-icons/fi";

const revealItems = ["THEME", "TRACK 01", "TRACK 02", "TRACK 03"];

export default function RevealSection() {
  return (
    <section id="reveal" className="relative overflow-hidden bg-black/70 py-24 text-blue-100 sm:py-32">
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#5d9aff]/50"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(rgba(93,154,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(93,154,255,0.35) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <motion.div
        className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full border border-[#5d9aff]/10"
        animate={{ rotate: 360, scale: [1, 1.06, 1] }}
        transition={{ rotate: { duration: 28, repeat: Infinity, ease: "linear" }, scale: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-[#5d9aff]">
              <motion.span
                className="h-2 w-2 rounded-full bg-[#5d9aff]"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              SIERRAHACKS / INCOMING
            </div>
            <h2 className="max-w-xl text-4xl font-bold leading-tight text-white sm:text-6xl">
              Something big is waiting to be built.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-blue-200/70 sm:text-lg">
              The theme and tracks are being kept under wraps for now. Show up curious, meet your team, and get ready for the reveal.
            </p>
            <a href="#tracks" className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-[#8bb8ff] transition-colors hover:text-white">
              See what is coming <FiArrowDown aria-hidden="true" />
            </a>
          </motion.div>

          <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
            {revealItems.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 * index, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5, borderColor: "rgba(93,154,255,0.7)" }}
                className={`group relative min-h-40 overflow-hidden border border-[#0E43B6]/40 bg-black/50 p-5 transition-colors sm:min-h-48 ${index === 0 ? "col-span-2" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs tracking-[0.2em] text-blue-300/55">{item}</span>
                  <FiLock className="text-[#5d9aff]/80 transition-transform duration-500 group-hover:rotate-[-12deg]" aria-hidden="true" />
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="mb-3 h-px w-full bg-[#0E43B6]/30">
                    <motion.div
                      className="h-px bg-[#5d9aff]"
                      initial={{ width: 0 }}
                      whileInView={{ width: index === 0 ? "42%" : "24%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.35 + index * 0.12, duration: 0.9, ease: "easeOut" }}
                    />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-300/45">Revealed soon</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
