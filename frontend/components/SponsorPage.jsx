import React from "react";
import { motion } from "framer-motion";

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

  // Sponsorship tiers with detailed perks
  const sponsorshipTiers = [
    {
      name: "Diamond",
      price: "$15,000",
      color: "bg-blue-400",
      perks: [
        "Custom hackathon challenge with dedicated prize",
        "Keynote speaking opportunity (30 minutes)",
        "Dedicated workshop session (1 hour)",
        "Premium logo placement on website, t-shirts, and venue",
        "Access to participant resumes",
        "6 recruitment booth hours",
        "Social media shoutouts (5+)",
        "5 sponsor tickets with VIP access",
        "Judge position on final panel",
        "Branded swag in welcome bags",
        "GitHub organization spotlight"
      ]
    },
    {
      name: "Platinum",
      price: "$10,000",
      color: "bg-gray-300",
      perks: [
        "Dedicated workshop session (45 minutes)",
        "Large logo on website and t-shirts",
        "Access to participant resumes",
        "4 recruitment booth hours",
        "Social media shoutouts (3+)",
        "4 sponsor tickets",
        "Judge position on final panel",
        "LinkedIn company feature",
        "Branded item in welcome bags"
      ]
    },
    {
      name: "Gold",
      price: "$5,000",
      color: "bg-yellow-400",
      perks: [
        "Medium logo on website and t-shirts",
        "Demo table opportunity",
        "Access to participant resumes",
        "2 recruitment booth hours",
        "Social media shoutouts (2)",
        "3 sponsor tickets",
        "Option for mini-workshop (20 minutes)",
        "Company mention in opening ceremony"
      ]
    },
    {
      name: "Silver",
      price: "$2,500", 
      color: "bg-gray-400",
      perks: [
        "Small logo on website",
        "Recruiting table (shared)",
        "Social media shoutout (1)",
        "2 sponsor tickets",
        "Company mention in closing ceremony",
        "Distribute promotional materials"
      ]
    },
    {
      name: "Bronze",
      price: "$1,000",
      color: "bg-yellow-700",
      perks: [
        "Name on website",
        "1 sponsor ticket",
        "Distribute promotional materials",
        "Company mention in sponsor list"
      ]
    },
    {
      name: "Custom",
      price: "Contact Us",
      color: "bg-blue-600",
      perks: [
        "In-kind donations (hardware, software, etc)",
        "API-specific prize sponsorship",
        "Meal/snack sponsorship",
        "Travel reimbursement fund",
        "Create your own package"
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
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
    <div id="sponsor" className="relative py-20 bg-[#D9E7FD] dark:bg-gray-900 overflow-hidden">
      {/* Terminal dot matrix background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="sponsor-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(30, 64, 175, 0.5)" className="dark:fill-[rgba(56,189,248,0.5)]" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sponsor-dots)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-4 font-mono">
            Become a Sponsor<span className="text-blue-600 dark:text-blue-500 animate-pulse">_</span>
          </h2>
          <p className="text-blue-800/80 dark:text-blue-200/80 max-w-2xl mx-auto font-mono">
            <span className="text-green-600 dark:text-green-400">$</span> ./sponsor-opportunities.sh
          </p>
        </motion.div>

        {/* Why sponsor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="border border-blue-300/30 dark:border-blue-500/30 rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm shadow-lg">
            {/* Terminal header */}
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

            {/* Terminal content */}
            <div className="p-6 font-mono">
              <div className="mb-4 text-blue-700 dark:text-blue-300">
                <span className="text-blue-800 dark:text-yellow-300"># Why Sponsor SierraHacks?</span>
              </div>
              
              <div className="space-y-4 text-blue-800/90 dark:text-blue-200/90">
                <p>SierraHacks brings together 500+ talented developers, designers, and innovators for a weekend of creativity and problem-solving. By sponsoring, you'll:</p>
                
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
                    Demonstrate your APIs, tools, and platforms to eager developers
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    Get fresh perspectives and innovative implementations of your technology
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
                    "SierraHacks gave us unprecedented access to talented developers who were eager to work with our APIs. We hired three interns directly from the event!"<br/>
                    <span className="text-blue-600 dark:text-blue-400 italic">— Previous Sponsor</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sponsorship Tiers */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="border border-blue-300/30 dark:border-blue-500/30 rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm shadow-lg">
            {/* Terminal header */}
            <div className="bg-blue-100/80 dark:bg-gray-800/80 px-4 py-2 flex items-center border-b border-blue-200/50 dark:border-blue-500/20">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
              </div>
              <div className="flex-1 text-center font-mono text-xs text-blue-500/70 dark:text-blue-300/70">
                sponsorship-tiers.json — javascript — 80×24
              </div>
            </div>

            {/* Terminal content */}
            <div className="p-6 font-mono overflow-x-auto">
              <div className="mb-4 text-blue-700 dark:text-blue-300">
                <span className="text-blue-800 dark:text-blue-400">const</span> <span className="text-green-600 dark:text-green-400">sponsorshipTiers</span> <span className="text-blue-700 dark:text-blue-300">=</span> <span className="text-blue-800 dark:text-yellow-300">[</span>
              </div>

              {sponsorshipTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="pl-4 mb-4 border-l-2 border-blue-300/30 dark:border-blue-500/30"
                >
                  <div className="mb-1 text-blue-700 dark:text-blue-300">{'{'}</div>
                  <div className="pl-6">
                    <div className="flex items-center mb-2">
                      <span className="text-blue-800 dark:text-blue-400">tier:</span> 
                      <span className="ml-2 text-green-600 dark:text-green-400">"{tier.name}"</span>,
                      <span className="ml-4 px-3 py-1 text-xs text-white font-bold rounded-full ${tier.color}">
                        <span className={`ml-2 px-3 py-1 text-xs text-white font-bold rounded-full ${tier.color}`}>
                          {tier.price}
                        </span>
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-blue-800 dark:text-blue-400">perks: </span>
                      <span className="text-blue-700 dark:text-blue-300">[</span>
                    </div>
                    <div className="pl-6">
                      {tier.perks.map((perk, perkIndex) => (
                        <div key={perkIndex} className="mb-1 flex items-baseline">
                          <span className="text-green-600 dark:text-green-400">"{perk}"</span>
                          {perkIndex < tier.perks.length - 1 && <span className="text-blue-700 dark:text-blue-300">,</span>}
                        </div>
                      ))}
                    </div>
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">]</span>
                    </div>
                  </div>
                  <div className="text-blue-700 dark:text-blue-300">{'}'}{index < sponsorshipTiers.length - 1 ? ',' : ''}</div>
                </motion.div>
              ))}
              
              <div className="text-blue-700 dark:text-blue-300">
                <span className="text-blue-800 dark:text-yellow-300">];</span>
              </div>

              <div className="mt-6 text-sm text-blue-600/70 dark:text-blue-300/70 border-t border-blue-200/50 dark:border-blue-500/20 pt-4">
                <span className="text-green-600 dark:text-green-400">$</span> We also offer custom sponsorship packages. Contact us to create a package that meets your specific needs and goals.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="border border-blue-300/30 dark:border-blue-500/30 rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm shadow-lg">
            {/* Terminal header */}
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

            {/* Terminal content */}
            <div className="p-6">
              <div className="mb-4">
                <span className="font-mono text-green-600 dark:text-green-400">$</span>
                <span className="font-mono text-blue-700 dark:text-blue-300"> ./contact-form.sh --inquiry=sponsor</span>
              </div>

              {submitSuccess ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 p-4 rounded-lg mb-6 font-mono"
                >
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Message sent successfully! Processing sponsorship request...
                  </p>
                  <p className="mt-2 text-sm">Our team will contact you within 48 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-mono font-medium text-blue-800 dark:text-blue-200 mb-1">
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
                      <label htmlFor="email" className="block text-sm font-mono font-medium text-blue-800 dark:text-blue-200 mb-1">
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
                    <label htmlFor="company" className="block text-sm font-mono font-medium text-blue-800 dark:text-blue-200 mb-1">
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
                    <label htmlFor="message" className="block text-sm font-mono font-medium text-blue-800 dark:text-blue-200 mb-1">
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
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : ">> Submit Inquiry"}
                  </motion.button>
                </form>
              )}
              
              <div className="mt-6 pt-4 border-t border-blue-200/50 dark:border-blue-500/20 font-mono text-sm">
                <div className="text-blue-700 dark:text-blue-300">
                  <span className="text-green-600 dark:text-green-400">$</span> For immediate inquiries:
                </div>
                <div className="pl-6 mt-2">
                  <div className="flex items-center">
                    <span className="text-blue-600 dark:text-blue-400">EMAIL:</span>
                    <a href="mailto:sponsors@sierrahacks.com" className="ml-2 text-green-600 dark:text-green-400 hover:underline">sponsors@sierrahacks.com</a>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-blue-600 dark:text-blue-400">PHONE:</span>
                    <a href="tel:+15551234567" className="ml-2 text-green-600 dark:text-green-400 hover:underline">(555) 123-4567</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Past sponsors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto mt-16 text-center"
        >
          <h3 className="text-2xl font-mono text-blue-700 dark:text-blue-300 mb-8">
            <span className="text-green-600 dark:text-green-400">$</span> cat previous-sponsors.txt
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/50 dark:bg-gray-800/50 h-16 rounded-lg flex items-center justify-center p-4 border border-blue-200/30 dark:border-blue-500/20 shadow-sm">
                <div className="bg-blue-200/30 dark:bg-blue-900/30 w-full h-6 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SponsorPage;