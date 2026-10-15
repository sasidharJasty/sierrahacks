import React from "react";
import { motion } from "framer-motion";
import { FiBookOpen, FiCode, FiHelpCircle, FiLayers, FiUsers } from "react-icons/fi";

const tracks = ["Track 01", "Track 02", "Track 03"];

const workshops = [
  {
    icon: FiCode,
    title: "HTML",
    text: "Start with the building blocks of the web and make something you can see right away.",
  },
  {
    icon: FiBookOpen,
    title: "Python",
    text: "Learn the fundamentals by turning a simple idea into a useful program.",
  },
  {
    icon: FiLayers,
    title: "Advanced workshop",
    text: "Stretch your skills with deeper tools, techniques, and project ideas.",
  },
];

export default function TracksSection() {
  return (
    <section id="tracks" className="relative overflow-hidden bg-black/70 py-24 text-blue-100 sm:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 18% 20%, rgba(14,67,182,0.18), transparent 30%), linear-gradient(90deg, transparent 49.8%, rgba(93,154,255,0.05) 50%, transparent 50.2%)", backgroundSize: "auto, 34px 34px" }} />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-3xl"
        >
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-[#5d9aff]">SierraHacks / coming soon</p>
          <h2 className="mb-4 font-mono text-4xl font-bold text-blue-100">
            Theme and tracks<span className="ml-2 text-[#0E43B6] animate-pulse">✦</span>
          </h2>
          <p className="font-mono text-blue-300/70">
            <span className="text-[#0E43B6]">///</span> The theme will be revealed on the day. All three tracks will be revealed soon.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {tracks.map((track, index) => (
            <motion.article
              key={track}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="border border-[#0E43B6]/30 bg-white/[0.025] p-6 transition-colors duration-500 hover:border-[#5d9aff]/70 hover:bg-[#0E43B6]/[0.08]"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="font-mono text-xs tracking-[0.16em] text-blue-300/50">{track}</span>
                <FiHelpCircle className="text-xl text-[#5d9aff]" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-white">Revealed soon</h3>
              <p className="mt-3 text-sm text-blue-200/60">Track details will be shared soon.</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="mb-4 font-mono text-xs tracking-[0.2em] text-[#5d9aff]">/// Beginner friendly</p>
            <h3 className="font-mono text-3xl font-bold text-blue-100 sm:text-4xl">Start wherever you are.</h3>
            <p className="mt-5 max-w-xl leading-relaxed text-blue-200/70">
              You do not need to be an expert to join. Start with a workshop, ask questions, and build alongside mentors and other people who are here to help.
            </p>
            <div className="mt-6 flex items-center gap-3 border-l border-[#5d9aff]/70 pl-4 text-sm text-blue-200/75">
              <FiUsers className="shrink-0 text-[#5d9aff]" aria-hidden="true" />
              <span>Bring curiosity. We will help with the rest.</span>
            </div>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-3">
            {workshops.map((workshop, index) => {
              const workshopIcon = workshop.icon;
              return (
              <motion.article
                key={workshop.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="border border-[#0E43B6]/30 bg-black/35 p-5 transition-colors duration-500 hover:border-[#5d9aff]/70 hover:bg-[#0E43B6]/[0.08]"
              >
                {React.createElement(workshopIcon, { className: "mb-5 text-xl text-[#5d9aff]", "aria-hidden": true })}
                <h4 className="font-bold text-white">{workshop.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-blue-200/65">{workshop.text}</p>
              </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
