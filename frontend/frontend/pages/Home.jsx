import React from 'react';

const FAQ = () => {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-xl font-semibold">What is SierraHacks?</h3>
            <p className="text-gray-400">SierraHacks is a hackathon where developers come together to innovate and create solutions.</p>
          </div>
          {/* Add more FAQs here */}
        </div>
      </div>
    </section>
  );
};

export default FAQ;