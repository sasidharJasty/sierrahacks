import React from "react";
import { motion } from "framer-motion";

const Members = () => {
  const teamMembers = [
    {
      name: "Sasidhar Jasty",
      role: "Lead Organizer",
      bio: "Full-stack developer focused on creating seamless and accessible hackathon experiences.",
      image: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
    },
    {
      name: "Varshith Gude",
      role: "Lead Organizer",
      bio: "Passionate about building tech communities and making hackathons accessible to everyone.",
      image: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
    },
    {
      name: "Sagar Shah",
      role: "Finance Lead",
      bio: "Dedicated to creating a positive and inclusive environment for all participants.",
      image: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
    },
    {
      name: "Nihal Tiyyagura",
      role: "Tech Lead",
      bio: "Focused on connecting with sponsors and partners to enhance the hackathon experience with technology.",
      image: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
    }

    
    /*{
      name: "Jayanth Bandaru",
      role: "Marketing and Finance",
      bio: "Driving outreach and managing finances to ensure a successful and well-funded event.",
      image: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
    },
    {
      name: "Kaustubh Anand",
      role: "Sponsor and Outreach ",
      bio: "Building strong partnerships with sponsors to enhance the hackathon experience.",
      image: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
    },
    {
      name: "Prajwal Nagendra",
      role: "Outreach Manager",
      bio: "Connecting innovative companies with the next generation of tech talent.",
      image: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
    },
    {
      name: "Pranav Malgunde",
      role: "Sponsor and Event Design",
      bio: "Creating memorable moments for hackers through thoughtful event design.",
      image: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
    },
    
    {
      name: "Arjun Ramesh",
      role: "Organizer",
      bio: "Spreading the word about SierraHacks to attract diverse participants.",
      image: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
    },*/

    
  ];

  return (
    <div id="team" className="relative overflow-hidden bg-black/70 py-24">
      {/* Team constellation */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div  style={{
          backgroundImage: 'linear-gradient(0deg, rgba(30, 64, 175, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 64, 175, 0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} className="h-full w-full dark:bg-[linear-gradient(0deg,rgba(56,189,248,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.2)_1px,transparent_1px)] dark:bg-[length:40px_40px]"></div>
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
            Team Members<span className="ml-2 text-[#0E43B6] animate-pulse">✦</span>
          </h2>
          <p className="mx-auto max-w-2xl font-mono text-blue-300/70">
            <span className="text-[#0E43B6]">///</span> The people behind the signal
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="h-full overflow-hidden border border-[#0E43B6]/50 bg-black shadow-[0_0_22px_rgba(14,67,182,0.12)] transition-colors hover:border-[#0E43B6]">
                <div className="flex items-center border-b border-[#0E43B6]/35 bg-[#0E43B6]/10 px-3 py-1.5">
                  <div className="flex space-x-1.5 mr-3">
                    <div className="w-2 h-2 rounded-full bg-red-400/70"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400/70"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400/70"></div>
                  </div>
                  <div className="flex-1 text-center font-mono text-xs text-blue-300/70">organizer profile / {String(index + 1).padStart(2, "0")}</div>
                </div>

                {/* Member content */}
                <div className="p-4 font-mono">
                  <div className="flex flex-col sm:flex-row items-center mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-300/30 dark:border-blue-500/30 mb-4 sm:mb-0 sm:mr-4">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="text-center sm:text-left">
                      <div className="text-blue-800 dark:text-blue-200 font-bold">{member.name}</div>
                      <div className="text-green-600 dark:text-green-400 text-sm">{member.role}</div>
                    </div>
                  </div>

                  <div className="mt-4 bg-blue-100/50 dark:bg-blue-900/10 rounded p-3 border border-blue-300/30 dark:border-blue-500/20">
                    <div className="mb-1 text-xs text-[#5d9aff]">FIELD NOTE</div>
                    <div className="text-blue-100/85">{member.bio}</div>
                  </div>

                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Members;