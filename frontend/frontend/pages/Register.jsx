// src/components/sections/FAQ.jsx
import React from "react";

const FAQ = () => {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="border-b border-blue-500 pb-4">
            <h3 className="text-xl font-semibold">What is SierraHacks?</h3>
            <p className="text-blue-200">SierraHacks is a hackathon event where developers, designers, and innovators come together to create amazing projects.</p>
          </div>
          <div className="border-b border-blue-500 pb-4">
            <h3 className="text-xl font-semibold">Who can participate?</h3>
            <p className="text-blue-200">Anyone with a passion for technology and innovation can participate, regardless of skill level.</p>
          </div>
          {/* Add more FAQs as needed */}
        </div>
      </div>
    </section>
  );
};

export default FAQ;