import React from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiCpu, FiHeart, FiLayers, FiUsers, FiZap } from "react-icons/fi";

const moments = [
  {
    icon: FiLayers,
    title: "Build something real",
    text: "Turn a rough idea into a working app, game, tool, or experiment before the day is done.",
  },
  {
    icon: FiZap,
    title: "Use AI with intention",
    text: "Learn practical ways to use AI as a creative partner while keeping your ideas unmistakably yours.",
  },
  {
    icon: FiCpu,
    title: "Level up together",
    text: "Workshops and mentors turn confusing problems into your next small, satisfying breakthrough.",
  },
  {
    icon: FiUsers,
    title: "Find your people",
    text: "Meet curious builders, designers, and future collaborators from across the Central Valley.",
  },
  {
    icon: FiHeart,
    title: "Make room for fun",
    text: "Good food, playful breaks, and a room full of energy keep the best ideas moving.",
  },
];

const photos = [
  {
    src: "/images/IMG_8516.JPG",
    alt: "Hackers building projects together",
    label: "BUILD / 01",
  },
  {
    src: "/images/IMG_8351.JPG",
    alt: "Participants collaborating",
    label: "CONNECT / 02",
  },
  {
    src: "/images/IMG_8525.JPG",
    alt: "A hackathon workshop",
    label: "LEARN / 03",
  },

];

const AboutSection = () => (
  <section id="about" className="relative overflow-hidden bg-black/70 py-24 text-blue-100 sm:py-32">
    <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 80% 15%, rgba(14,67,182,0.22), transparent 28%), radial-gradient(circle at 15% 80%, rgba(14,67,182,0.12), transparent 30%)" }} />
    <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#0E43B6] to-transparent" />

    <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-14 max-w-3xl"
      >
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-[#5d9aff]">SierraHacks / the experience</p>
        <h2 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-6xl">
          12 hours of making, learning, and building something worth sharing.
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-blue-200/70 sm:text-lg">
          SierraHacks brings high-school builders together at Sierra High School to turn curiosity into something you can demo, share, and be proud of.
        </p>
      </motion.div>

      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="grid gap-3 sm:grid-cols-2">
          {moments.map(({ icon: Icon, title, text }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.45 }}
              className={`group border border-[#0E43B6]/35 bg-[#0E43B6]/[0.05] p-5 transition-all hover:-translate-y-1 hover:border-[#5d9aff] hover:bg-[#0E43B6]/[0.11] ${index === 0 ? "sm:col-span-2" : ""}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <Icon className="text-xl text-[#5d9aff]" />
                <span className="font-mono text-[10px] tracking-[0.2em] text-blue-300/45">0{index + 1}</span>
              </div>
              <h3 className="font-bold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-blue-200/65">{text}</p>
            </motion.article>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {photos.map((photo, index) => (
            <motion.figure
              key={photo.src}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className={`group relative overflow-hidden border border-[#0E43B6]/35 bg-black ${index === 0 ? "col-span-2 row-span-2" : ""} ${index === 1 ? "mt-6" : ""}`}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" className={`h-full w-full object-cover grayscale-[18%] opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100 ${index === 0 ? "aspect-[1.15]" : "aspect-[1.2]"}`} />
              <figcaption className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/75 px-3 py-2 font-mono text-[9px] tracking-[0.18em] text-blue-200">
                {photo.label}
                <FiArrowUpRight className="text-[#5d9aff]" />
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </div>
  </section>
  );

export default AboutSection;
