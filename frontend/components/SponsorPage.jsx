import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from '@emailjs/browser';

emailjs.init({
  publicKey: 'q0VSXMXvZvvNhMZR4',
  blockHeadless: true,
  blockList: {
    list: ['foo@emailjs.com', 'bar@emailjs.com'],
    watchVariable: 'email',
  },
  limitRate: {
    id: 'sponsorship-form',
    throttle: 1000, // 1 request per second
  },
});


const SponsorPage = () => {
  // Contact form state
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  // Popup state for tier selection
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [detailedFormData, setDetailedFormData] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    industry: "",
    employeeCount: "",
    interests: [],
    additionalInfo: "",
    mailingAddress: "",
    hearAboutUs: "",
    previousSponsor: "no"
  });

  // Sponsorship tiers with detailed perks
  const sponsorshipTiers = [
    {
      name: "Diamond",
      price: "$2,000",
      color: "bg-indigo-600",
      perks: [
        "Brief welcome remarks during opening ceremony (2–3 min)",
        "Large logo on website, shirts, and venue banner",
        "Dedicated sponsor table at event",
        "Shoutouts on Instagram and LinkedIn (4+ times)",
        "Opportunity to include items in swag bags",
        "2 sponsor passes with VIP lounge access (if available)",
        "Sponsor mention in all email updates",
        "Optional judge position for final projects"
      ]
    },
    {
      name: "Platinum",
      price: "$1,000",
      color: "bg-sky-600",
      perks: [
        "Medium logo on website, shirts, and event banner",
        "Shared sponsor table at event",
        "Social media mentions (2–3 times)",
        "Include flyers or stickers in swag bags",
        "1 sponsor pass",
        "Sponsor mention in opening and closing ceremonies"
      ]
    },
    {
      name: "Gold",
      price: "$500",
      color: "bg-yellow-500",
      perks: [
        "Logo on website and shirts (small size)",
        "1–2 social media shoutouts",
        "Include small item in swag bags (e.g., pen, sticker)",
        "Mention during closing remarks",
        "1 sponsor pass"
      ]
    },
    {
      name: "Silver",
      price: "$250",
      color: "bg-gray-400",
      perks: [
        "Name listed on website",
        "Social media thank-you post",
        "Distribute flyers at check-in table",
        "Group mention during event wrap-up"
      ]
    },
    {
      name: "Bronze",
      price: "$100",
      color: "bg-amber-700",
      perks: [
        "Thank-you on website sponsor list",
        "Name on printed signage at event",
        "Group thank-you in social media post"
      ]
    },
    {
      name: "Custom",
      price: "Contact Us",
      color: "bg-teal-600",
      perks: [
        "In-kind donations (e.g., snacks, prizes, tech equipment)",
        "Custom partnership (e.g., fund a category or workshop)",
        "Logo on items you sponsor (if applicable)",
        "Let's work together to build your custom package"
      ]
    }
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle detailed form input changes
  const handleDetailedInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (checked) {
        setDetailedFormData({
          ...detailedFormData,
          interests: [...detailedFormData.interests, value]
        });
      } else {
        setDetailedFormData({
          ...detailedFormData,
          interests: detailedFormData.interests.filter(
            (interest) => interest !== value
          )
        });
      }
    } else {
      setDetailedFormData({
        ...detailedFormData,
        [name]: value
      });
    }
  };

  // Handle tier selection
  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
    setIsPopupOpen(true);

    if (formData.name || formData.email || formData.company) {
      const nameParts = formData.name.split(" ");
      setDetailedFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: formData.email || "",
        company: formData.company || ""
      }));
    }
  };

  // Handle detailed form submission
  const handleDetailedSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const templateParams = {
      tier: selectedTier.name + " (" + selectedTier.price + ")",
      firstName: detailedFormData.firstName,
      lastName: detailedFormData.lastName,
      email: detailedFormData.email,
      phone: detailedFormData.phone,
      company: detailedFormData.company,
      jobTitle: detailedFormData.jobTitle,
      website: detailedFormData.website,
      industry: detailedFormData.industry,
      employeeCount: detailedFormData.employeeCount,
      mailingAddress: detailedFormData.mailingAddress,
      interests: detailedFormData.interests.join(", "),
      previousSponsor: detailedFormData.previousSponsor,
      hearAboutUs: detailedFormData.hearAboutUs,
      additionalInfo: detailedFormData.additionalInfo,
    };
  
    emailjs.send(
      'service_xvv7sft',       // found in EmailJS dashboard
      'sponsorship_interest',  // your template ID
      templateParams
    ).then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
        setSubmitSuccess(true);
        setIsPopupOpen(false);
        setIsSubmitting(false);
        // Clear form here...
      },
      (error) => {
        console.error("FAILED...", error);
        setIsSubmitting(false);
        alert("Failed to send email. Please try again.");
      }
    );
  };
  

  // Handle regular form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        company: "",
        message: ""
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div
      id="sponsor"
      className="relative py-20 bg-[#D9E7FD] dark:bg-gray-900 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="sponsor-dots"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="2"
                cy="2"
                r="1"
                fill="rgba(30, 64, 175, 0.5)"
                className="dark:fill-[rgba(56,189,248,0.5)]"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sponsor-dots)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-4 font-mono">
            Become a Sponsor
            <span className="text-blue-600 dark:text-blue-500 animate-pulse">
              _
            </span>
          </h2>
          <p className="text-blue-800/80 dark:text-blue-200/80 max-w-2xl mx-auto font-mono">
            <span className="text-green-600 dark:text-green-400">$</span>{" "}
            ./sponsor-opportunities.sh
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="border border-blue-300/30 dark:border-blue-500/30 rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm shadow-lg">
            <div className="bg-blue-100/80 dark:bg-gray-800/80 px-4 py-2 flex items-center border-b border-blue-200/50 dark:border-blue-500/20">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
              </div>
              <div className="flex-1 text-center font-mono text-xs text-blue-500/70 dark:text-blue-300/70">
                why-sponsor.md — vim — 80×24
              </div>
            </div>

            <div className="p-6 font-mono">
              <div className="mb-4 text-blue-700 dark:text-blue-300">
                <span className="text-blue-800 dark:text-yellow-300">
                  # Why Sponsor SierraHacks?
                </span>
              </div>

              <div className="space-y-4 text-blue-800/90 dark:text-blue-200/90">
                <p>
                  SierraHacks brings together 500+ talented developers,
                  designers, and innovators for a weekend of creativity and
                  problem-solving. By sponsoring, you'll:
                </p>

                <ul className="space-y-2 pl-8 list-disc">
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    Connect with and recruit top technical talent
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Demonstrate your APIs, tools, and platforms to eager
                    developers
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    Get fresh perspectives and innovative implementations of
                    your technology
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    Build brand awareness in the developer community
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    Support the next generation of tech innovators
                  </motion.li>
                </ul>

                <div className="bg-blue-100/50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded">
                  <p className="text-blue-700 dark:text-blue-300">
                    "SierraHacks gave us unprecedented access to talented
                    developers who were eager to work with our APIs. We hired
                    three interns directly from the event!"
                    <br />
                    <span className="text-blue-600 dark:text-blue-400 italic">
                      — Previous Sponsor
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="border border-blue-300/30 dark:border-blue-500/30 rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm shadow-lg">
            {/* Terminal header - existing code */}
            <div className="bg-blue-100/80 dark:bg-gray-800/80 px-4 py-2 flex items-center border-b border-blue-200/50 dark:border-blue-500/20">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
              </div>
              <div className="flex-1 text-center font-mono text-xs text-blue-500/70 dark:text-blue-300/70">
                sponsorship-tiers.sh — terminal — 112×32
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="mb-6 font-mono text-blue-800 dark:text-blue-300">
                <span className="text-green-600 dark:text-green-400">$</span>{" "}
                ./compare-tiers.sh{" "}
                <span className="text-yellow-600 dark:text-yellow-400">
                  --format=table --show-all
                </span>
              </div>

              {/* Mobile/Desktop View Toggle */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 font-mono text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-blue-600 dark:text-blue-400 mr-2 hidden sm:inline">
                      View:
                    </span>
                    <div className="flex border border-blue-200 dark:border-blue-700/50 rounded-md overflow-hidden">
                      <button className="bg-blue-100 dark:bg-blue-800/50 px-3 py-1 text-blue-700 dark:text-blue-300">
                        Table
                      </button>
                      <button className="px-3 py-1 text-blue-600/70 dark:text-blue-400/70 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        Cards
                      </button>
                    </div>
                  </div>
                  
                  <div className="hidden sm:flex items-center">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">
                      Sort:
                    </span>
                    <select className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded px-2 py-1 text-blue-700 dark:text-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs">
                      <option value="price">Price (High to Low)</option>
                      <option value="perks">Perks (Most to Least)</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-blue-600/70 dark:text-blue-400/70">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="hidden sm:inline">Swipe to view all details on mobile</span>
                  <span className="sm:hidden">Scroll to view details</span>
                </div>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto -mx-4 sm:mx-0 scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-800 scrollbar-track-transparent">
                {/* Large Screen Traditional Table */}
                <div className="hidden md:block min-w-full">
                  <table className="w-full border-collapse font-mono text-sm">
                    <thead>
                      <tr className="bg-blue-100/70 dark:bg-blue-900/40 text-left">
                        <th className="py-3 px-4 border-b-2 border-blue-200/70 dark:border-blue-700/50 text-blue-800 dark:text-blue-200">
                          Tier
                        </th>
                        <th className="py-3 px-4 border-b-2 border-blue-200/70 dark:border-blue-700/50 text-blue-800 dark:text-blue-200">
                          Price
                        </th>
                        <th className="py-3 px-4 border-b-2 border-blue-200/70 dark:border-blue-700/50 text-blue-800 dark:text-blue-200 w-full">
                          Perks
                        </th>
                        <th className="py-3 px-4 border-b-2 border-blue-200/70 dark:border-blue-700/50 text-blue-800 dark:text-blue-200"></th>
                      </tr>
                    </thead>

                    <tbody>
                      {sponsorshipTiers.map((tier, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 5 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                          className={`border-b border-blue-100/50 dark:border-blue-800/30 ${
                            index % 2 === 0
                              ? "bg-blue-50/50 dark:bg-blue-900/10"
                              : ""
                          } hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors`}
                        >
                          <td className="py-4 px-4">
                            <div
                              className={`inline-flex items-center px-2.5 py-1 rounded-full bg-gradient-to-r ${tier.color} text-white text-xs font-bold`}
                            >
                              {tier.name}
                            </div>
                          </td>

                          <td className="py-4 px-4 text-blue-700 dark:text-blue-300 whitespace-nowrap">
                            {tier.price}
                          </td>

                          <td className="py-4 px-4">
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                              {tier.perks.map((perk, perkIndex) => (
                                <div
                                  key={perkIndex}
                                  className="flex items-start"
                                >
                                  <span className="text-green-500 dark:text-green-400 mr-2">
                                    ✓
                                  </span>
                                  <span className="text-blue-700 dark:text-blue-200">
                                    {perk}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`bg-gradient-to-r ${tier.color} px-4 py-2 text-white rounded font-mono text-xs flex items-center space-x-2 whitespace-nowrap`}
                              onClick={() => handleTierSelect(tier)}
                            >
                              <span>Select</span>
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                              </svg>
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile/Tablet Optimized Table View */}
                <div className="md:hidden px-4 sm:px-0 space-y-4">
                  {sponsorshipTiers.map((tier, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 5 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className={`border border-blue-100/50 dark:border-blue-800/30 rounded-lg overflow-hidden ${
                        index % 2 === 0
                          ? "bg-blue-50/50 dark:bg-blue-900/10"
                          : "bg-white/80 dark:bg-gray-900/60"
                      }`}
                    >
                      <div className="flex items-center justify-between p-4 border-b border-blue-100/40 dark:border-blue-800/20">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`inline-flex items-center px-2.5 py-1 rounded-full bg-gradient-to-r ${tier.color} text-white text-xs font-bold`}
                          >
                            {tier.name}
                          </div>
                          <span className="text-blue-700 dark:text-blue-300 font-bold">
                            {tier.price}
                          </span>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`bg-gradient-to-r ${tier.color} px-3 py-1.5 text-white rounded font-mono text-xs flex items-center space-x-1.5`}
                          onClick={() => handleTierSelect(tier)}
                        >
                          <span>Select</span>
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </motion.button>
                      </div>
                      
                      <div className="p-4">
                        <div className="mb-2 text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide font-semibold">
                          Perks
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                          {tier.perks.map((perk, perkIndex) => (
                            <div
                              key={perkIndex}
                              className="flex items-start"
                            >
                              <span className="text-green-500 dark:text-green-400 mr-2 text-lg leading-none">
                                •
                              </span>
                              <span className="text-blue-700 dark:text-blue-200 text-sm">
                                {perk}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Terminal Prompt Footer */}
              <div className="mt-8 pt-4 border-t border-blue-200/50 dark:border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between font-mono text-sm gap-4">
                <div className="text-blue-600/70 dark:text-blue-300/70">
                  <span className="text-green-600 dark:text-green-400">$</span>{" "}
                  Found {sponsorshipTiers.length} tiers. Use '--help' for more options.
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1"
                  onClick={() => {
                    document
                      .getElementById("contact-form")
                      .scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span>Contact for custom packages</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          id="contact-form"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div className="border border-blue-300/30 dark:border-blue-500/30 rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm shadow-lg">
              <div className="bg-blue-100/80 dark:bg-gray-800/80 px-4 py-2 flex items-center border-b border-blue-200/50 dark:border-blue-500/20">
                <div className="flex space-x-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
                </div>
                <div className="flex-1 text-center font-mono text-xs text-blue-500/70 dark:text-blue-300/70">
                  contact-us.sh — bash — 80×24
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <span className="font-mono text-green-600 dark:text-green-400">
                    $
                  </span>
                  <span className="font-mono text-blue-700 dark:text-blue-300">
                    {" "}
                    ./contact-form.sh --inquiry=sponsor
                  </span>
                </div>

                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 p-4 rounded-lg mb-6 font-mono"
                  >
                    <p className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Message sent successfully! Processing sponsorship
                      request...
                    </p>
                    <p className="mt-2 text-sm">
                      Our team will contact you within 48 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-mono font-medium text-blue-800 dark:text-blue-200 mb-1"
                        >
                          NAME:
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-blue-700/50 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-colors font-mono"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-mono font-medium text-blue-800 dark:text-blue-200 mb-1"
                        >
                          EMAIL:
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-blue-700/50 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-colors font-mono"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-mono font-medium text-blue-800 dark:text-blue-200 mb-1"
                      >
                        COMPANY:
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-blue-700/50 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-colors font-mono"
                        placeholder="Your company"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-mono font-medium text-blue-800 dark:text-blue-200 mb-1"
                      >
                        MESSAGE:
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-blue-700/50 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-colors resize-none font-mono"
                        placeholder="Tell us about your sponsorship interests..."
                      ></textarea>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600/90 dark:hover:bg-blue-700 text-white px-8 py-3 rounded-md font-mono transition-colors flex items-center justify-center ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      whileHover={isSubmitting ? {} : { scale: 1.01 }}
                      whileTap={isSubmitting ? {} : { scale: 0.99 }}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        ">> Submit Inquiry"
                      )}
                    </motion.button>
                  </form>
                )}

                <div className="mt-6 pt-4 border-t border-blue-200/50 dark:border-blue-500/20 font-mono text-sm">
                  <div className="text-blue-700 dark:text-blue-300">
                    <span className="text-green-600 dark:text-green-400">
                      $
                    </span>{" "}
                    For immediate inquiries:
                  </div>
                  <div className="pl-6 mt-2">
                    <div className="flex items-center">
                      <span className="text-blue-600 dark:text-blue-400">
                        EMAIL:
                      </span>
                      <a
                        href="mailto:sponsors@sierrahacks.com"
                        className="ml-2 text-green-600 dark:text-green-400 hover:underline"
                      >
                        sponsors@sierrahacks.com
                      </a>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-blue-600 dark:text-blue-400">
                        PHONE:
                      </span>
                      <a
                        href="tel:+9253658630"
                        className="ml-2 text-green-600 dark:text-green-400 hover:underline"
                      >
                        (925) 365-8630
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      {/* Terminal grid background */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto mt-16 text-center"
        >
          <h3 className="text-2xl font-mono text-blue-700 dark:text-blue-300 mb-8">
            <span className="text-green-600 dark:text-green-400">$</span> cat
            previous-sponsors.txt
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white/50 dark:bg-gray-800/50 h-16 rounded-lg flex items-center justify-center p-4 border border-blue-200/30 dark:border-blue-500/20 shadow-sm"
              >
                <div className="bg-blue-200/30 dark:bg-blue-900/30 w-full h-6 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isPopupOpen && selectedTier && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsPopupOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.2 }}
              className="bg-white dark:bg-gray-900 max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl border border-blue-300/30 dark:border-blue-700/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-blue-100/80 dark:bg-gray-800/80 px-4 py-3 sticky top-0 z-10 flex items-center justify-between border-b border-blue-200/50 dark:border-blue-500/20">
                <div className="flex items-center">
                  <div className="flex space-x-2 mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
                  </div>
                  <div className="font-mono text-sm text-blue-700 dark:text-blue-300">
                    inquire.sh --tier={selectedTier.name.toLowerCase()}
                  </div>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setIsPopupOpen(false)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 font-mono mb-2">
                    {selectedTier.name} Tier Sponsorship Inquiry
                  </h3>
                  <div className="flex items-center mb-4">
                    <div
                      className={`px-2.5 py-1 rounded-full ${selectedTier.color} text-white text-xs font-mono mr-2`}
                    >
                      {selectedTier.price}
                    </div>
                    <p className="text-sm text-blue-600/70 dark:text-blue-400/70 font-mono">
                      Please provide your information to proceed with this
                      sponsorship tier
                    </p>
                  </div>
                </div>

                <form onSubmit={handleDetailedSubmit} className="space-y-6 font-mono">
                  <div className="border-b border-blue-200/50 dark:border-blue-700/30 pb-6">
                    <h4 className="text-blue-800 dark:text-blue-200 font-mono text-sm mb-4 flex items-center">
                      <span className="text-green-600 dark:text-green-400 mr-2">
                        $
                      </span>
                      cat contact-information.txt
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-blue-800/80 dark:text-blue-200/80 mb-1">
                          FIRST NAME:
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={detailedFormData.firstName}
                          onChange={handleDetailedInputChange}
                          required
                          className="w-full px-3 py-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-blue-700/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-blue-800/80 dark:text-blue-200/80 mb-1">
                          LAST NAME:
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={detailedFormData.lastName}
                          onChange={handleDetailedInputChange}
                          required
                          className="w-full px-3 py-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-blue-700/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-blue-800/80 dark:text-blue-200/80 mb-1">
                          JOB TITLE:
                        </label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={detailedFormData.jobTitle}
                          onChange={handleDetailedInputChange}
                          required
                          className="w-full px-3 py-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-blue-700/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-blue-800/80 dark:text-blue-200/80 mb-1">
                          EMAIL:
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={detailedFormData.email}
                          onChange={handleDetailedInputChange}
                          required
                          className="w-full px-3 py-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-blue-700/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-blue-800/80 dark:text-blue-200/80 mb-1">
                          PHONE:
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={detailedFormData.phone}
                          onChange={handleDetailedInputChange}
                          className="w-full px-3 py-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-blue-700/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-blue-200/50 dark:border-blue-700/30 pb-6">
                    <h4 className="text-blue-800 dark:text-blue-200 font-mono text-sm mb-4 flex items-center">
                      <span className="text-green-600 dark:text-green-400 mr-2">
                        $
                      </span>
                      cat company-information.txt
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-blue-800/80 dark:text-blue-200/80 mb-1">
                          COMPANY NAME:
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={detailedFormData.company}
                          onChange={handleDetailedInputChange}
                          required
                          className="w-full px-3 py-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-blue-700/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-blue-800/80 dark:text-blue-200/80 mb-1">
                          WEBSITE:
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={detailedFormData.website}
                          onChange={handleDetailedInputChange}
                          className="w-full px-3 py-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-blue-700/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-blue-800/80 dark:text-blue-200/80 mb-1">
                          INDUSTRY:
                        </label>
                        <select
                          name="industry"
                          value={detailedFormData.industry}
                          onChange={handleDetailedInputChange}
                          required
                          className="w-full px-3 py-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-blue-700/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select industry</option>
                          <option value="Technology">Technology</option>
                          <option value="Financial Services">
                            Financial Services
                          </option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Education">Education</option>
                          <option value="Retail">Retail</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Non-profit">Non-profit</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-blue-800/80 dark:text-blue-200/80 mb-1">
                          COMPANY SIZE:
                        </label>
                        <select
                          name="employeeCount"
                          value={detailedFormData.employeeCount}
                          onChange={handleDetailedInputChange}
                          required
                          className="w-full px-3 py-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-blue-700/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select company size</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="501-1000">501-1000 employees</option>
                          <option value="1000+">1000+ employees</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-blue-800/80 dark:text-blue-200/80 mb-1">
                          MAILING ADDRESS:
                        </label>
                        <textarea
                          name="mailingAddress"
                          value={detailedFormData.mailingAddress}
                          onChange={handleDetailedInputChange}
                          rows={2}
                          className="w-full px-3 py-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-blue-700/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          placeholder="Optional - for sending physical materials"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-blue-200/50 dark:border-blue-700/30 pb-6">
                    <h4 className="text-blue-800 dark:text-blue-200 font-mono text-sm mb-4 flex items-center">
                      <span className="text-green-600 dark:text-green-400 mr-2">
                        $
                      </span>
                      cat sponsorship-details.txt
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-blue-800/80 dark:text-blue-200/80 mb-2">
                          AREAS OF INTEREST:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                          {[
                            "Talent Recruitment",
                            "Brand Awareness",
                            "Product Showcase",
                            "API/Platform Adoption",
                            "Community Engagement",
                            "Mentoring"
                          ].map((interest) => (
                            <div
                              key={interest}
                              className="flex items-center"
                            >
                              <input
                                type="checkbox"
                                id={`interest-${interest
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                name="interests"
                                value={interest}
                                checked={detailedFormData.interests.includes(
                                  interest
                                )}
                                onChange={handleDetailedInputChange}
                                className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                              />
                              <label
                                htmlFor={`interest-${interest
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                className="ml-2 text-sm text-blue-700 dark:text-blue-300"
                              >
                                {interest}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-blue-800/80 dark:text-blue-200/80 mb-2">
                          HAVE YOU SPONSORED A HACKATHON BEFORE?
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="previously-yes"
                              name="previousSponsor"
                              value="yes"
                              checked={
                                detailedFormData.previousSponsor === "yes"
                              }
                              onChange={handleDetailedInputChange}
                              className="w-4 h-4 text-blue-600 border-blue-300"
                            />
                            <label
                              htmlFor="previously-yes"
                              className="ml-2 text-sm text-blue-700 dark:text-blue-300"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="previously-no"
                              name="previousSponsor"
                              value="no"
                              checked={
                                detailedFormData.previousSponsor === "no"
                              }
                              onChange={handleDetailedInputChange}
                              className="w-4 h-4 text-blue-600 border-blue-300"
                            />
                            <label
                              htmlFor="previously-no"
                              className="ml-2 text-sm text-blue-700 dark:text-blue-300"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-blue-800/80 dark:text-blue-200/80 mb-1">
                          HOW DID YOU HEAR ABOUT US?
                        </label>
                        <select
                          name="hearAboutUs"
                          value={detailedFormData.hearAboutUs}
                          onChange={handleDetailedInputChange}
                          className="w-full px-3 py-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-blue-700/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select an option</option>
                          <option value="Social Media">Social Media</option>
                          <option value="Search Engine">Search Engine</option>
                          <option value="Email">Email</option>
                          <option value="Friend/Colleague">
                            Friend/Colleague
                          </option>
                          <option value="Previous Attendee">
                            Previous Attendee
                          </option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-blue-800/80 dark:text-blue-200/80 mb-1">
                          ADDITIONAL INFORMATION:
                        </label>
                        <textarea
                          name="additionalInfo"
                          value={detailedFormData.additionalInfo}
                          onChange={handleDetailedInputChange}
                          rows={3}
                          className="w-full px-3 py-2 bg-blue-50 dark:bg-gray-700/50 border border-blue-200 dark:border-blue-700/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          placeholder="Anything else you'd like us to know about your sponsorship interests?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPopupOpen(false)}
                      className="px-4 py-2 text-blue-600 dark:text-blue-400 font-mono text-sm hover:underline flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Cancel
                    </button>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-gradient-to-r ${selectedTier.color} px-6 py-2 text-white rounded-md font-mono text-sm flex items-center space-x-2 ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      whileHover={isSubmitting ? {} : { scale: 1.03 }}
                      whileTap={isSubmitting ? {} : { scale: 0.97 }}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit {selectedTier.name} Inquiry</span>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SponsorPage;