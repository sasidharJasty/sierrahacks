import React from "react";
import { motion } from "framer-motion";

const FAQ = () => {
  return (
    <div className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {/* Example FAQ Item */}
          <motion.div
            className="bg-gray-800 p-4 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-semibold">What is SierraHacks?</h3>
            <p>SierraHacks is a hackathon where developers come together to innovate and create solutions.</p>
          </motion.div>
          {/* Add more FAQ items here */}
        </div>
      </div>
    </div>
  );
};

export default FAQ;