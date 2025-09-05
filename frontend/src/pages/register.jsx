import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HackathonSignup() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(
    localStorage.getItem("hackathonSubmitted") === "true"
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    school: "",
    grade: "",
    gender: "",
    city: "",
    state: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    parentRelationship: "",
    diet: "",
    allergies: "",
    specialNeeds: "",
    tshirt: "",
    experience: "",
    teamPreference: "",
    teamMembers: "",
    waiverFile: null,
  });

  // Questions with type & options
  const questions = [
    { key: "name", question: "What’s your full name?", type: "text" },
    { key: "email", question: "What’s your email?", type: "email" },
    { key: "phone", question: "What’s your phone number?", type: "text" },
    { key: "age", question: "How old are you?", type: "number" },
    { key: "school", question: "Which school do you attend?", type: "text" },
    { key: "grade", question: "What grade are you in?", type: "multiple", options: ["7th","8th","9th", "10th", "11th", "12th"] },
    {
      key: "gender",
      question: "What’s your gender?",
      type: "multiple",
      options: ["Male", "Female", "Non-binary", "Prefer not to say"],
    },
    { key: "city", question: "What city do you live in?", type: "text" },
    { key: "state", question: "What state do you live in?", type: "text" },
    { key: "parentName", question: "Parent/Guardian full name?", type: "text" },
    { key: "parentPhone", question: "Parent/Guardian phone?", type: "text" },
    { key: "parentEmail", question: "Parent/Guardian email?", type: "email" },
    {
      key: "parentRelationship",
      question: "Relationship to participant?",
      type: "text",
    },
    {
      key: "diet",
      question: "Dietary preference?",
      type: "multiple",
      options: ["Veg", "Non-Veg", "Vegan"],
    },
    { key: "allergies", question: "Any allergies?", type: "text" },
    { key: "specialNeeds", question: "Any special accommodations?", type: "text" },
    {
      key: "tshirt",
      question: "T-Shirt Size?",
      type: "multiple",
      options: ["S", "M", "L", "XL"],
    },
    {
      key: "experience",
      question: "Any prior hackathon experience?",
      type: "multiple",
        options: ["0", "1","2", "3", "4", "5+"],
    },
    {
      key: "teamPreference",
      question: "Do you have a team?",
      type: "Multiple",
        options: ["Yes, I have a team", "No, I need a team"],
    },
    {
        key: "teamMembers",
        question: "Who is in your team? (full names, separated by commas)",
        type: "text"
      },
    {
      key: "waiverFile",
      question:
        "Please download the waiver, sign it, and upload the signed document.",
      type: "file",
    },
  ];

  // Convert file to Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleChange = (e, option = null) => {
    const { name, value, files } = e.target || {};
    if (option) {
      setFormData({ ...formData, [questions[step].key]: option });
    } else {
      setFormData({
        ...formData,
        [name || questions[step].key]: files ? files[0] : value,
      });
    }
  };

  const nextStep = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      let payload = { ...formData };

      if (formData.waiverFile) {
        const base64File = await toBase64(formData.waiverFile);
        payload.waiverFile = base64File;
        payload.fileName = formData.waiverFile.name;
        payload.fileType = formData.waiverFile.type;
      }

      const formBody = new URLSearchParams(payload);

      await fetch("https://script.google.com/macros/s/AKfycbw9L_SN0a4rSFh5t8GE2ZIeVaBaKEQ6HYF4suLQyQWvR6ZPk1Phy4ccAy2LcloBfete/exec", {
        method: "POST",
        body: formBody,
      });

      localStorage.setItem("hackathonSubmitted", "true");
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  if (submitted) {
    return (
      <div className="relative min-h-screen py-20 bg-[#D9E7FD] dark:bg-gray-900 overflow-hidden">
        {/* Dot-matrix background */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="terminal-dots-register-success" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(30, 64, 175, 0.5)" className="dark:fill-[rgba(56,189,248,0.5)]" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#terminal-dots-register-success)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto border border-blue-300/30 dark:border-blue-500/30 rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm shadow-lg">
            <div className="h-1.5 bg-gradient-to-r from-blue-400/70 to-sky-400/70" />
            <div className="bg-blue-100/80 dark:bg-gray-800/80 px-4 py-2 flex items-center border-b border-blue-200/50 dark:border-blue-500/20">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
              </div>
              <div className="flex-1 text-center font-mono text-xs text-blue-500/70 dark:text-blue-300/70">
                register.sh — done
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="p-8 text-center font-mono"
            >
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-200">
                🎉 Thanks for signing up! See you at the hackathon 🚀
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-20 bg-[#D9E7FD] dark:bg-gray-900 overflow-hidden">
      {/* Terminal dot matrix background (match Sponsors) */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="terminal-dots-register" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(30, 64, 175, 0.5)" className="dark:fill-[rgba(56,189,248,0.5)]" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#terminal-dots-register)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header to align with site */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-2 font-mono">
            Register<span className="text-blue-600 dark:text-blue-500 animate-pulse">_</span>
          </h2>
          <p className="text-blue-800/80 dark:text-blue-200/80 font-mono">
            <span className="text-green-600 dark:text-green-400">$</span> ./register.sh
          </p>
        </div>

        {/* Terminal-style card */}
        <div className="max-w-2xl mx-auto border border-blue-300/30 dark:border-blue-500/30 rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm shadow-lg shadow-blue-500/10 dark:shadow-blue-900/20">
          {/* Tier-like accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-400/70 to-sky-400/70" />

          {/* Terminal header */}
          <div className="bg-blue-100/80 dark:bg-gray-800/80 px-4 py-2 flex items-center border-b border-blue-200/50 dark:border-blue-500/20">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
            </div>
            <div className="flex-1 text-center font-mono text-xs text-blue-500/70 dark:text-blue-300/70">
              register.sh — step {step + 1} / {questions.length}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 font-mono">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
              >
                <div className="text-lg font-semibold mb-6 text-blue-800 dark:text-blue-100">
                  {questions[step].question}
                </div>

                {/* Multiple choice */}
                {questions[step].type === "multiple" && (
                  <div className="space-y-3">
                    {questions[step].options.map((opt) => {
                      const selected = formData[questions[step].key] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleChange({}, opt)}
                          className={`w-full py-2 rounded-lg border transition-colors
                            ${selected
                              ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30"
                              : "bg-blue-50/60 border-blue-300/40 text-blue-800 hover:bg-blue-100/60 dark:bg-gray-800 dark:text-blue-200 dark:border-blue-500/20 dark:hover:bg-gray-700"}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Text/email/number */}
                {["text", "email", "number"].includes(questions[step].type) && (
                  <input
                    type={questions[step].type}
                    name={questions[step].key}
                    value={formData[questions[step].key]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/80 border border-blue-300/40 text-blue-900 placeholder-blue-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500/60
                               dark:bg-gray-800 dark:text-blue-100 dark:placeholder-blue-300/70 dark:border-blue-500/20"
                    placeholder="Type your answer…"
                  />
                )}

                {/* File */}
                {questions[step].type === "file" && (
                  <div className="space-y-4">
                    <a
                      href="/waiver.pdf"
                      download
                      className="block text-blue-700 dark:text-blue-300 underline hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      📥 Download Waiver Form
                    </a>
                    <input
                      type="file"
                      name="waiverFile"
                      accept=".pdf,.jpg,.png"
                      onChange={handleChange}
                      className="w-full text-sm text-blue-800 dark:text-blue-200 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 dark:file:bg-blue-600 dark:hover:file:bg-blue-700"
                    />
                  </div>
                )}

                {/* Controls */}
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="px-4 py-2 rounded-lg border border-blue-300/40 text-blue-700 hover:bg-blue-50/60 disabled:opacity-50
                               dark:text-blue-200 dark:border-blue-500/20 dark:hover:bg-white/5"
                  >
                    ← Back
                  </button>

                  <button
                    onClick={nextStep}
                    disabled={
                      questions[step].type !== "file" &&
                      !formData[questions[step].key]
                    }
                    className="bg-blue-600 px-6 py-2 rounded-lg text-white hover:bg-blue-700 disabled:bg-blue-600/50
                               shadow-lg shadow-blue-500/30 dark:shadow-blue-900/20"
                  >
                    {step === questions.length - 1 ? "Submit" : "Next →"}
                  </button>
                </div>

                <div className="mt-4 text-sm text-blue-600/80 dark:text-blue-300/70 text-right">
                  {step + 1} / {questions.length}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}