import React from "react";

const FAQ = () => {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold">What is SierraHacks?</h3>
            <p className="mt-2">SierraHacks is a hackathon event where developers, designers, and innovators come together to create amazing projects.</p>
          </div>
          {/* Add more FAQs here */}
        </div>
      </div>
    </section>
  );
};

export default FAQ;